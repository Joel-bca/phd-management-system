import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import {
  Calendar,
  Search,
  Download,
  History,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  RefreshCw,
  MoreVertical,
  FileText,
  MapPin,
  Video,
  Layers,
  MessageSquare,
  Info,
} from "lucide-react";
import { hodService } from "../../services/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const exportToPDF = async (data, filename) => {
    if (!data) return;

    const doc = new jsPDF();

    // Add University Logo
    try {
      const img = new Image();
      img.src = '/christ-logo.png';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      // Try to maintain aspect ratio for a standard logo height of 20
      const imgWidth = (img.width * 20) / img.height;
      doc.addImage(img, 'PNG', 14, 10, imgWidth, 20);
    } catch (e) {
      console.warn("Could not load logo for PDF:", e);
    }

    doc.setFontSize(22);
    doc.setTextColor(0, 0, 128); // Dark blue text
    doc.text("RAC HISTORY REPORT", 14, 40);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated Date: ${format(new Date(), "PPpp")}`, 14, 48);

    // Define Headers
    const headers = [
      "No.",
      "Meeting Date",
      "Scholar Name",
      "Reg No.",
      "Supervisor",
      "Subject",
      "Status",
    ];

    // Map Data
    const items = Array.isArray(data) ? data : [data];

    if (items.filter(Boolean).length === 0) {
      toast.error("No records to export. Check your search/filter and try again.");
      return;
    }

    const rows = items
      .filter(Boolean)
      .map((m, idx) => [
        idx + 1,
        m.meeting_date ? format(new Date(m.meeting_date), "dd/MM/yyyy") : "--",
        m.scholar?.student_name || "--",
        m.scholar?.register_number || "--",
        m.supervisor?.name || "--",
        m.meeting_subject || "--",
        m.status?.toUpperCase() || "PENDING",
      ]);

    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 55,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [30, 58, 138], textColor: 255 }, // Dark blue header
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    // If single protocol, print detailed info
    if (!Array.isArray(data) || items.length === 1) {
      const singleData = items[0];
      const finalY = doc.lastAutoTable.finalY || 55;

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Session Details", 14, finalY + 15);

      doc.setFontSize(10);
      doc.text(`Access Point: ${singleData.meeting_location || "--"}`, 14, finalY + 23);
      doc.text(`Protocol Mode: ${singleData.meeting_mode || "--"}`, 14, finalY + 29);
      doc.text(`Index Position: PROTOCOL_#${singleData.meeting_number || "--"}`, 14, finalY + 35);
      doc.text(`Registry Log Time: ${singleData.created_at ? format(new Date(singleData.created_at), "PPpp") : "--"}`, 14, finalY + 41);

      doc.text("Post-Session Observations:", 14, finalY + 51);
      doc.setFont(undefined, 'italic');
      doc.text(singleData.remarks || "No observations recorded.", 14, finalY + 57, { maxWidth: 180 });
    }

    doc.save(`${filename}_${format(new Date(), "yyyyMMdd")}.pdf`);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await hodService.getMeetingHistory();
      if (res.success) {
        setMeetings(res.data);
      }
    } catch (err) {
      toast.error("LOG_SYNC_FAILED: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredMeetings = meetings.filter((m) => {
    const matchesSearch =
      m.scholar?.student_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      m.supervisor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.meeting_subject?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "deleted"
        ? m.Status_deletion === false
        : m.status?.toLowerCase() === filterStatus);

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (m) => {
    if (m.Status_deletion === false) {
      return (
        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 text-[10px] font-black uppercase tracking-widest">
          <Trash2 className="h-3 w-3" /> Purged
        </span>
      );
    }

    switch (m.status?.toLowerCase()) {
      case "completed":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle className="h-3 w-3" /> Conducted
          </span>
        );
      case "cancelled":
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-black uppercase tracking-widest">
            <AlertCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-black uppercase tracking-widest">
            <Clock className="h-3 w-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      {/* HEADER */}
      <header className="mb-12 border-b border-border pb-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-medium tracking-[0.1em] uppercase">
              <span className="text-primary">
                rac <span>History</span>
              </span>
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-muted-foreground font-bold">
              Registry: rac_ADVISORY_LOGS • Audit Mode
            </p>
          </div>
          <Button
            onClick={fetchData}
            variant="outline"
            className="rounded-none border-border hover:bg-accent h-12 gap-3"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="text-[10px] font-black tracking-widest uppercase">
              Sync Registry
            </span>
          </Button>
        </div>
      </header>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by Student name or Supervisor name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-accent/5 border-border focus:border-primary rounded-none text-[10px] tracking-widest font-bold uppercase transition-all"
          />
        </div>

        <div className="flex gap-2 p-1 bg-accent/5 border border-border">
          {["all", "pending", "completed", "cancelled", "deleted"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s
                ? "bg-white shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        <Button
          disabled={loading}
          onClick={() => exportToPDF(filteredMeetings, "rac_Audit_Logs")}
          className="h-14 rounded-none bg-primary hover:bg-primary/90 text-white uppercase text-[10px] tracking-widest font-black gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Download className="h-4 w-4" /> Export_Audit_Logs
        </Button>
      </div>

      {/* REGISTRY TABLE */}
      <div className="border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-accent/5">
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>RAC Date</TableHead>
              <TableHead>RAC Comments</TableHead>
              <TableHead>KP Updated Date</TableHead>
              <TableHead>Publication Title</TableHead>
              <TableHead>Journal Details</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredMeetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  No Records Found
                </TableCell>
              </TableRow>
            ) : (
              filteredMeetings.map((meeting, index) => (
                <TableRow key={meeting.id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>
                    {meeting.meeting_date
                      ? format(new Date(meeting.meeting_date), "dd/MM/yyyy")
                      : "--"}
                  </TableCell>

                  <TableCell>
                    {meeting.rac_comments || "--"}
                  </TableCell>

                  <TableCell>
                    {meeting.kp_upload_date ? format(new Date(meeting.kp_upload_date), "dd/MM/yyyy") : "--"}
                  </TableCell>

                  <TableCell>
                    {meeting.publication_title || "--"}
                  </TableCell>

                  <TableCell>
                    {meeting.journal_details || "--"}
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedMeeting(meeting)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>


      {/* SESSION DETAILS MODAL */}
      <Dialog
        open={!!selectedMeeting}
        onOpenChange={() => setSelectedMeeting(null)}
      >
        <DialogContent className="max-w-2xl rounded-none border border-border p-0 bg-white overflow-hidden font-sans">
          <DialogHeader className="p-8 bg-accent/5 border-b border-border">
            <div className="flex justify-between items-start pr-12">
              <div>
                <DialogTitle className="text-2xl font-medium uppercase tracking-tight">
                  Protocol <span className="text-primary">Details</span>
                </DialogTitle>
                <DialogDescription className="text-[10px] tracking-[0.2em] uppercase font-bold text-muted-foreground mt-1">
                  Nexus_Identifier: {selectedMeeting?.id}
                </DialogDescription>
              </div>
              {selectedMeeting && getStatusBadge(selectedMeeting)}
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8">
            {/* SUBJECT */}
            <div className="space-y-3">
              <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-black flex items-center gap-2">
                <FileText className="h-3 w-3 text-primary" />{" "}
                Advisory_Focus_Subject
              </label>
              <div className="p-4 bg-accent/5 border border-border">
                <p className="text-sm font-bold uppercase text-foreground leading-relaxed">
                  {selectedMeeting?.meeting_subject || "NULL_SUBJECT"}
                </p>
              </div>
            </div>

            {/* GRID DETAILS */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-black flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-primary" /> Access_Point
                </label>
                <p className="text-[11px] font-bold uppercase text-foreground">
                  {selectedMeeting?.meeting_location || "AWAITING_COORDINATES"}
                </p>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-black flex items-center gap-2">
                  <Video className="h-3 w-3 text-primary" /> Protocol_Mode
                </label>
                <p className="text-[11px] font-bold uppercase text-foreground">
                  {selectedMeeting?.meeting_mode}
                </p>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-black flex items-center gap-2">
                  <Layers className="h-3 w-3 text-primary" /> Index_Position
                </label>
                <p className="text-[11px] font-bold uppercase text-foreground">
                  PROTOCOL_#{selectedMeeting?.meeting_number}
                </p>
              </div>
              <div className="space-y-3">
                <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-black flex items-center gap-2">
                  <Clock className="h-3 w-3 text-primary" /> Registry_Log_Time
                </label>
                <p className="text-[11px] font-bold uppercase text-foreground">
                  {selectedMeeting &&
                    format(new Date(selectedMeeting.created_at), "PPP p")}
                </p>
              </div>
            </div>

            {/* REMARKS */}
            {selectedMeeting?.remarks && (
              <div className="space-y-3">
                <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-black flex items-center gap-2">
                  <MessageSquare className="h-3 w-3 text-primary" />{" "}
                  Post_Session_Observations
                </label>
                <div className="p-5 bg-primary/5 border-l-2 border-primary/30">
                  <p className="text-[11px] text-foreground/80 leading-relaxed font-medium italic">
                    "{selectedMeeting.remarks}"
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-accent/5 border-t border-border flex justify-between gap-4">
            <Button
              disabled={loading}
              variant="outline"
              onClick={() =>
                selectedMeeting &&
                exportToPDF(
                  selectedMeeting,
                  `Protocol_${selectedMeeting.meeting_number}`,
                )
              }
              className="rounded-none border-border hover:bg-white uppercase text-[10px] tracking-widest font-black flex-1 h-12 gap-3"
            >
              <Download className="h-4 w-4" /> Export_Single_Protocol
            </Button>
            <Button
              onClick={() => setSelectedMeeting(null)}
              className="rounded-none bg-foreground hover:bg-foreground/90 text-white uppercase text-[10px] tracking-widest font-black flex-1 h-12"
            >
              Close_Terminal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AUDIT FOOTER */}
      <footer className="mt-8 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
        <p>
          Registry_Identifier: {crypto.randomUUID().split("-")[0].toUpperCase()}
        </p>
        <p>
          Total_Entries: {filteredMeetings.length} / {meetings.length}
        </p>
      </footer>
    </div>
  );
}
