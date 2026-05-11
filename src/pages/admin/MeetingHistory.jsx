import React, { useState, useEffect } from "react";
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

  const exportToCSV = (data, filename) => {
    if (!data) return;

    // Define Headers
    const headers = [
      "Meeting Date",
      "Scholar Name",
      "Register Number",
      "Supervisor",
      "Subject",
      "Mode",
      "Location",
      "Status",
      "Purged",
      "Remarks",
    ];

    // Map Data
    const items = Array.isArray(data) ? data : [data];
    const rows = items
      .filter(Boolean)
      .map((m) => [
        format(new Date(m.meeting_date), "yyyy-MM-dd HH:mm"),
        m.scholar?.student_name || "N/A",
        m.scholar?.register_number || "N/A",
        m.supervisor?.name || "N/A",
        m.meeting_subject || "N/A",
        m.meeting_mode || "N/A",
        m.meeting_location || "N/A",
        m.status || "pending",
        m.Status_deletion === false ? "YES" : "NO",
        m.remarks || "",
      ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((r) =>
        r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${format(new Date(), "yyyyMMdd")}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                RAH <span>History</span>
              </span>
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-muted-foreground font-bold">
              Registry: RAH_ADVISORY_LOGS • Audit Mode
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
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${
                filterStatus === s
                  ? "bg-white shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <Button
          onClick={() => exportToCSV(filteredMeetings, "RAH_Audit_Logs")}
          className="h-14 rounded-none bg-primary hover:bg-primary/90 text-white uppercase text-[10px] tracking-widest font-black gap-3 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Download className="h-4 w-4" /> Export_Audit_Logs
        </Button>
      </div>

      {/* REGISTRY TABLE */}
      <div className="border border-border bg-card shadow-2xl shadow-black/5 overflow-hidden">
        <Table>
          <TableHeader className="bg-accent/5">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="w-[120px] text-[10px] font-black uppercase tracking-widest py-6 pl-8">
                TIme
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest py-6">
                Name
              </TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest py-6 text-center">
                RAH Status
              </TableHead>
              <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest py-6">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-32 text-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary/20 mx-auto mb-4" />
                  <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-muted-foreground/40">
                    Synchronizing_Archive...
                  </p>
                </TableCell>
              </TableRow>
            ) : filteredMeetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-32 text-center">
                  <div className="bg-accent/5 p-6 inline-block mb-4">
                    <History className="h-8 w-8 text-muted-foreground/20" />
                  </div>
                  <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-muted-foreground/40">
                    No_Historical_Protocols_Found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredMeetings.map((meeting) => (
                <TableRow
                  key={meeting.id}
                  className="group hover:bg-accent/5 border-b border-border last:border-0 transition-all"
                >
                  <TableCell className="py-8 pl-8">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-foreground font-mono">
                        {format(new Date(meeting.meeting_date), "dd.MM.yy")}
                      </span>
                      <span className="text-[9px] text-muted-foreground uppercase font-medium mt-1">
                        {format(new Date(meeting.meeting_date), "HH:mm")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] font-black text-primary">
                          C
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-foreground">
                          {meeting.scholar?.student_name || "UNKNOWN_CANDIDATE"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-amber-50 border border-amber-200 flex items-center justify-center text-[9px] font-black text-amber-600">
                          S
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {meeting.supervisor?.name || "UNASSIGNED_FACULTY"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {getStatusBadge(meeting)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedMeeting(meeting)}
                      className="rounded-none h-10 w-10 p-0 border border-transparent hover:border-border hover:bg-white transition-all shadow-sm group/btn"
                    >
                      <MoreVertical className="h-4 w-4 text-muted-foreground group-hover/btn:text-primary" />
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
            <div className="flex justify-between items-start">
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
              variant="outline"
              onClick={() =>
                selectedMeeting &&
                exportToCSV(
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
