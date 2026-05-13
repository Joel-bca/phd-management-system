import React, { useState, useEffect } from "react";
import {
  meetingService,
  hodService,
  supervisorService,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import {
  Users,
  Calendar,
  Video,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Search,
  RefreshCw,
  ShieldCheck,
  MoreHorizontal,
  ChevronRight,
  UserCheck,
  CalendarClock,
  Layers,
  Eye,
  Mail,
  Trash2,
  CheckSquare,
  MessageSquare,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentProfileModal from "@/components/StudentProfileModal";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const calendarStyles = `
  .react-day-picker-nexus {
    --rdp-cell-size: 40px;
    --rdp-accent-color: #1e40af;
    --rdp-background-color: #f3f4f6;
    margin: 0;
    font-family: inherit;
  }
  .react-day-picker-nexus .rdp-day_selected { 
    background-color: var(--rdp-accent-color) !important;
    color: white !important;
    border-radius: 0 !important;
  }
  .react-day-picker-nexus .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: #e5e7eb !important;
    border-radius: 0 !important;
  }
  .react-day-picker-nexus .rdp-head_cell {
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 0.1em;
  }
`;

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("10:00");

  // Inside SupervisorDashboard.jsx

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch only students assigned to ME (using new endpoint)
      // You'll need to add supervisorService.getMyStudents to your api.js
      const studentRes = await supervisorService.getMyStudents();

      // 2. Fetch meetings (meetingService already filters by user role)
      const meetingRes = await meetingService.getMeetings();

      if (studentRes.success) {
        setStudents(studentRes.data);
      }

      if (meetingRes.success) {
        setMeetings(meetingRes.data);
      }
    } catch (err) {
      toast.error("PROTOCOL_SYNC_FAILED: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const selectedStudents = fd.getAll("student_ids");
    const meetingDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":");
    meetingDate.setHours(parseInt(hours), parseInt(minutes));

    const dispatchMethod = fd.get("dispatch_method");
    const meetingMessage = fd.get("meeting_message");

    const payload = {
      student_ids: selectedStudents,
      meeting_number: parseInt(fd.get("meeting_number")),
      meeting_date: meetingDate.toISOString(),
      meeting_mode: fd.get("meeting_mode"),
      meeting_subject: fd.get("meeting_subject"),
      meeting_location: fd.get("meeting_location"),
      meeting_message: meetingMessage,
      send_email: dispatchMethod === "auto",
    };

    try {
      await meetingService.createMeeting(payload);

      if (dispatchMethod === "manual") {
        const studentEmails = students
          .filter((s) =>
            selectedStudents
              .map((id) => id.toString())
              .includes(s.id.toString()),
          )
          .map((s) => s.university_email || s.profiles?.email || s.email)
          .filter(Boolean)
          .join(",");

        const body = `Hello,\n\nA new academic session has been established.\n\nSubject: ${payload.meeting_subject}\nDate: ${format(meetingDate, "PPP p")}\nMode: ${payload.meeting_mode}\nLocation: ${payload.meeting_location}\n\nNote: ${meetingMessage}\n\nPlease ensure attendance.\n\nBest regards,\n${user?.name}`;

        const mailtoUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${studentEmails}&su=${encodeURIComponent(`Academic Session | ${payload.meeting_subject}`)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoUrl, "_blank");
      }

      toast.success("MEETING_PROTOCOL_ESTABLISHED");
      setShowMeetingModal(false);
      fetchData();
    } catch (err) {
      toast.error("COMMIT_FAILED: " + err.message);
    }
  };

  const handleDeleteMeeting = async (id) => {
    if (
      !window.confirm(
        "CONFIRM_PROTOCOL_PURGE: Are you sure you want to delete this session?",
      )
    )
      return;
    try {
      await meetingService.deleteMeeting(id);
      toast.success("PROTOCOL_PURGED");
      fetchData();
    } catch (err) {
      toast.error("DELETE_FAILED: " + err.message);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await meetingService.updateMeeting(id, { status });
      toast.success("STATUS_PROTOCOL_UPDATED");
      fetchData();
    } catch (err) {
      toast.error("UPDATE_FAILED: " + err.message);
    }
  };

  const handleUpdateRemarks = async (id, remarks) => {
    try {
      await meetingService.updateMeeting(id, { remarks });
      toast.success("REMARKS_PROTOCOL_LOGGED");
      fetchData();
    } catch (err) {
      toast.error("REMARKS_FAILED: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
      <style>{calendarStyles}</style>
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.1em] uppercase">
            <span className="text-primary">
              Faculty <span className="text-primary">Portal</span>{" "}
            </span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-muted-foreground font-bold">
            Dear Professor {user?.name?.toUpperCase() || "SUPERVISOR"} •
            SUPERVISORY_OVERVIEW • Status: ACTIVE
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button
            onClick={() => setShowMeetingModal(true)}
            className="w-full sm:w-auto rounded-none bg-primary hover:bg-primary/90 text-white uppercase text-[10px] tracking-[0.3em] font-bold h-11 px-8 shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Establish Session
          </Button>
          <Button
            onClick={fetchData}
            variant="outline"
            className="w-full sm:w-auto rounded-none uppercase text-[10px] tracking-widest bg-white h-11 px-6"
          >
            <RefreshCw
              className={`mr-2 h-3 w-3 ${loading ? "animate-spin" : ""}`}
            />
            Sync Registry
          </Button>
        </div>
      </header>

      {/* ANNOUNCEMENT BANNER */}
      <div className="mb-12 p-6 bg-primary/5 border border-primary/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/10">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase font-black text-foreground">
              Institutional Notice • PhD Management System
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-tight font-bold">
              Please ensure all information given are correct.
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-primary/40 hidden md:block" />
      </div>

      {/* STATS QUICK VIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="border border-border bg-card p-8 group hover:border-primary/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-primary/5 p-3 rounded-none group-hover:bg-primary/10 transition-colors">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold mb-1">
                Assigned Scholars
              </p>
              <h3 className="text-3xl font-medium tracking-tight uppercase">
                {students.length}
              </h3>
            </div>
          </div>
        </div>
        <div className="border border-border bg-card p-8 group hover:border-primary/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-primary/5 p-3 rounded-none group-hover:bg-primary/10 transition-colors">
              <CalendarClock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold mb-1">
                Upcoming Sessions
              </p>
              <h3 className="text-3xl font-medium tracking-tight uppercase">
                {
                  meetings.filter((m) => new Date(m.meeting_date) >= new Date())
                    .length
                }
              </h3>
            </div>
          </div>
        </div>
        <div className="border border-border bg-card p-8 group hover:border-primary/50 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-primary/5 p-3 rounded-none group-hover:bg-primary/10 transition-colors">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold mb-1">
                Completed Meetings
              </p>
              <h3 className="text-3xl font-medium tracking-tight uppercase">
                {
                  meetings.filter((m) => new Date(m.meeting_date) < new Date())
                    .length
                }
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border mb-12">
        <div className="flex gap-8 overflow-x-auto no-scrollbar pb-4 md:pb-0">
          {[
            { id: "students", label: "Scholar Details", icon: Users },
            { id: "meetings", label: "Meeting Schedule", icon: CalendarClock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-[10px] tracking-[0.4em] uppercase font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              } flex items-center gap-2`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "students" && (
          <div className="relative w-full md:w-80 mb-4 md:mb-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="SEARCH REGISTRY"
              value={searchQuery}
              className="pl-10 h-10 rounded-none border-border bg-accent/5 text-[10px] tracking-widest uppercase focus:bg-white"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <div className="absolute top-full right-0 mt-2 text-[8px] font-black uppercase tracking-widest text-primary animate-in fade-in slide-in-from-top-1">
                {
                  students.filter(
                    (s) =>
                      s.profiles?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      s.register_number
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  ).length
                }{" "}
                Matches Found
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-card border border-border shadow-2xl shadow-black/5 overflow-hidden">
        {activeTab === "students" ? (
          <div className="w-full">
            {/* DESKTOP TABLE */}
            <div className="hidden md:block">
              <Table>
                <TableHeader className="bg-accent/5">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-[10px] tracking-[0.3em] uppercase pl-8 h-14 font-bold text-muted-foreground">
                      Name
                    </TableHead>
                    <TableHead className="text-[10px] tracking-[0.3em] uppercase h-14 font-bold text-muted-foreground">
                      Register Numbers
                    </TableHead>
                    <TableHead className="text-[10px] tracking-[0.3em] uppercase h-14 font-bold text-muted-foreground">
                      Research Interests
                    </TableHead>
                    <TableHead className="text-[10px] tracking-[0.3em] uppercase pr-8 h-14 font-bold text-muted-foreground text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [1, 2, 3].map((i) => (
                      <TableRow key={i} className="border-border animate-pulse">
                        <TableCell colSpan={4} className="h-16 pl-8">
                          <div className="h-3 bg-accent/20 w-1/3 rounded-none" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-60 text-center">
                        <div className="bg-accent/5 p-4 inline-block mb-4">
                          <Users className="h-6 w-6 text-muted-foreground/30" />
                        </div>
                        <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/40 font-bold">
                          Registry_Empty_No_Assignments
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    students
                      .filter(
                        (s) =>
                          s.profiles?.name
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()) ||
                          s.register_number
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase()),
                      )
                      .map((student) => (
                        <TableRow
                          key={student.id}
                          className="border-border hover:bg-accent/5 group transition-colors"
                        >
                          <TableCell className="pl-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="bg-primary/5 p-3 rounded-none border border-primary/20 text-primary font-mono text-xs font-bold">
                                {student.profiles?.name?.[0] || "?"}
                              </div>
                              <div>
                                <p className="text-sm font-bold tracking-wider uppercase">
                                  {student.profiles?.name || student.name}
                                </p>
                                <p className="text-[9px] text-muted-foreground font-mono mt-0.5">
                                  {student.profiles?.email || student.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-[10px] font-mono bg-accent/20 px-2.5 py-1 border border-border">
                              {student.register_number}
                            </span>
                          </TableCell>
                          <TableCell>
                            <p className="text-[10px] tracking-tight text-muted-foreground italic max-w-md line-clamp-1">
                              {student.research_interests ||
                                "NOT_SPECIFIED_IN_SYSTEM"}
                            </p>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-none h-8 text-[9px] tracking-widest uppercase font-bold text-primary hover:bg-primary/5"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="h-3 w-3 mr-2" /> Examine
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* MOBILE CARDS */}
            <div className="md:hidden divide-y divide-border">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="p-6 animate-pulse space-y-4">
                    <div className="h-4 bg-accent/20 w-1/2" />
                    <div className="h-3 bg-accent/20 w-1/4" />
                  </div>
                ))
              ) : students.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-[10px] tracking-widest uppercase text-muted-foreground/40 font-bold">
                    Registry_Empty
                  </p>
                </div>
              ) : (
                students
                  .filter(
                    (s) =>
                      s.profiles?.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      s.register_number
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  )
                  .map((student) => (
                    <div
                      key={student.id}
                      className="p-6 space-y-4 active:bg-accent/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/5 border border-primary/20 flex items-center justify-center text-primary font-bold">
                            {student.profiles?.name?.[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold tracking-widest uppercase">
                              {student.profiles?.name}
                            </p>
                            <p className="text-[9px] text-muted-foreground font-mono">
                              {student.register_number}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-none h-8 w-8 p-0"
                          onClick={() => setSelectedStudent(student)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <div className="bg-accent/5 p-3 border-l-2 border-primary/20">
                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
                          Current Research Focus
                        </p>
                        <p className="text-[10px] italic line-clamp-2">
                          {student.research_interests || "Pending Update"}
                        </p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {meetings
              .sort(
                (a, b) => new Date(b.meeting_date) - new Date(a.meeting_date),
              )
              .map((meeting) => {
                const isUpcoming = new Date(meeting.meeting_date) >= new Date();
                return (
                  <div
                    key={meeting.id}
                    className="p-8 md:p-10 hover:bg-accent/5 transition-all group border-b border-border last:border-0"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                      <div className="flex flex-col sm:flex-row gap-8 flex-1">
                        <div
                          className={`p-6 border flex flex-col items-center justify-center min-w-[100px] h-fit ${isUpcoming ? "bg-primary text-white shadow-xl shadow-primary/20 border-primary" : "bg-accent/10 text-muted-foreground border-border"}`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
                            {new Date(meeting.meeting_date).toLocaleDateString(
                              "en-US",
                              { month: "short" },
                            )}
                          </span>
                          <span className="text-3xl font-medium tracking-tighter uppercase">
                            {new Date(meeting.meeting_date).getDate()}
                          </span>
                        </div>
                        <div className="space-y-4 flex-1">
                          <div className="flex flex-wrap items-center gap-4">
                            <h4 className="text-xl font-medium uppercase tracking-[0.05em] text-foreground">
                              {meeting.meeting_subject ||
                                `Protocol #${meeting.meeting_number}`}
                            </h4>
                            <span
                              className={`text-[9px] uppercase font-black px-3 py-1 border ${meeting.meeting_mode?.toLowerCase() === "online" ? "border-blue-500/30 text-blue-500 bg-blue-500/5" : "border-amber-500/30 text-amber-500 bg-amber-500/5"}`}
                            >
                              {meeting.meeting_mode}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[10px] tracking-widest uppercase text-muted-foreground font-bold">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-primary/5 border border-primary/10">
                                <Users className="h-3 w-3 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] opacity-60">
                                  Candidate_Nexus
                                </span>
                                <span className="text-foreground">
                                  {students.find(
                                    (s) => s.id === meeting.student_id,
                                  )?.profiles?.name || meeting.student_id}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-primary/5 border border-primary/10">
                                <Video className="h-3 w-3 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] opacity-60">
                                  Access_Point
                                </span>
                                <span className="text-foreground truncate max-w-[200px]">
                                  {meeting.meeting_location ||
                                    "AWAITING_COORDINATES"}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-primary/5 border border-primary/10">
                                <Clock className="h-3 w-3 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] opacity-60">
                                  Temporal_Timestamp
                                </span>
                                <span className="text-foreground">
                                  {new Date(
                                    meeting.meeting_date,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-primary/5 border border-primary/10">
                                <Layers className="h-3 w-3 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[8px] opacity-60">
                                  Protocol_Index
                                </span>
                                <span className="text-foreground">
                                  INDEX_#{meeting.meeting_number}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 self-end lg:self-start">
                        <select
                          value={meeting.status?.toLowerCase() || "pending"}
                          onChange={(e) =>
                            handleUpdateStatus(meeting.id, e.target.value)
                          }
                          className="bg-accent/5 border border-border px-3 py-2 text-[9px] font-black uppercase tracking-widest outline-none focus:border-primary transition-all cursor-pointer h-12"
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Conducted</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const r = window.prompt(
                              "ADD_SESSION_REMARKS:",
                              meeting.remarks || "",
                            );
                            if (r !== null) handleUpdateRemarks(meeting.id, r);
                          }}
                          className="rounded-none border-border hover:border-primary/50 group/rem h-12 w-12 p-0"
                          title="Add Remarks"
                        >
                          <MessageSquare className="h-4 w-4 text-muted-foreground group-hover/rem:text-primary transition-colors" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteMeeting(meeting.id)}
                          className="rounded-none border-border hover:border-red-500/50 hover:bg-red-50 group/del h-12 w-12 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground group-hover/del:text-red-500 transition-colors" />
                        </Button>
                      </div>
                    </div>
                    {meeting.remarks && (
                      <div className="mt-6 p-4 bg-primary/5 border-l-2 border-primary/30 animate-in fade-in slide-in-from-top-1 duration-300">
                        <p className="text-[8px] uppercase tracking-[0.2em] font-black text-primary/60 mb-2 flex items-center gap-2">
                          <Edit3 className="h-3 w-3" />{" "}
                          Post_Session_Observations
                        </p>
                        <p className="text-[10px] text-foreground/80 leading-relaxed font-medium">
                          {meeting.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            {meetings.length === 0 && (
              <div className="py-32 text-center">
                <div className="bg-accent/5 p-6 inline-block mb-6">
                  <CalendarClock className="h-8 w-8 text-muted-foreground/20" />
                </div>
                <h4 className="text-[10px] tracking-[0.4em] uppercase font-bold text-muted-foreground mb-2">
                  No_Logs_Available
                </h4>
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-tight">
                  Establish a new session protocol to initiate academic logging.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 md:p-10 border-b border-border bg-accent/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-medium uppercase tracking-[0.1em]">
                  Establish <span className="text-primary">Session</span>
                </h2>
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-bold mt-1">
                  Protocol: NEW_CONSULTATION_ENTRY
                </p>
              </div>
              <button
                onClick={() => setShowMeetingModal(false)}
                className="w-12 h-12 flex items-center justify-center hover:bg-accent text-muted-foreground hover:text-foreground transition-all uppercase text-xs font-mono"
              >
                ESC
              </button>
            </div>
            <form
              onSubmit={handleCreateMeeting}
              className="p-8 md:p-10 space-y-8 max-h-[70vh] overflow-y-auto"
            >
              {/* SUBJECT */}
              <div className="space-y-4">
                <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-bold flex items-center gap-2">
                  <FileText className="h-3 w-3 text-primary/40" />{" "}
                  Discussion_Agenda_Subject
                </label>
                <Input
                  name="meeting_subject"
                  required
                  placeholder="E.G., LITERATURE_REVIEW_ANALYSIS_PHASE_1"
                  className="rounded-none border-border h-12 bg-accent/5 focus:bg-white uppercase text-xs tracking-widest font-bold"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-bold flex items-center gap-2">
                  <Users className="h-3 w-3 text-primary/40" />{" "}
                  Target_Candidate_Nexus
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-border bg-accent/5 p-4">
                  {students.map((s) => (
                    <label
                      key={s.id}
                      className="flex items-center gap-3 p-3 bg-white border border-border hover:border-primary transition-all cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        name="student_ids"
                        value={s.id}
                        className="w-4 h-4 rounded-none border-border text-primary focus:ring-0 focus:ring-offset-0 bg-transparent"
                      />
                      <div className="flex flex-col">
                        <span className="text-[10px] tracking-widest uppercase font-black text-foreground group-hover:text-primary transition-colors">
                          {s.profiles?.name || s.name}
                        </span>
                        <span className="text-[8px] font-mono text-muted-foreground">
                          {s.register_number}
                        </span>
                      </div>
                    </label>
                  ))}
                  {students.length === 0 && (
                    <p className="col-span-full py-4 text-center text-[9px] tracking-widest uppercase text-muted-foreground/40 italic">
                      No_Assigned_Candidates_Found
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-bold flex items-center gap-2">
                    <Layers className="h-3 w-3 text-primary/40" /> Meeting
                    Number
                  </label>
                  <Input
                    type="number"
                    name="meeting_number"
                    required
                    placeholder="001"
                    className="rounded-none border-border h-12 bg-accent/5 focus:bg-white uppercase text-xs"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-bold flex items-center gap-2">
                    <Video className="h-3 w-3 text-primary/40" /> Mode
                  </label>
                  <select
                    name="meeting_mode"
                    required
                    className="w-full h-12 border border-border bg-accent/5 px-4 text-[10px] tracking-[0.2em] uppercase outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all rounded-none"
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-bold flex items-center gap-2">
                    <Clock className="h-3 w-3 text-primary/40" /> Time
                  </label>
                  <div className="flex flex-col gap-4">
                    <div className="border border-border bg-accent/5 p-4 flex flex-col items-center">
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="react-day-picker-nexus"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground font-bold">
                        Select_Hour
                      </label>
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="rounded-none border-border h-10 bg-accent/5 focus:bg-white uppercase text-xs w-32"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-bold flex items-center gap-2">
                    <Video className="h-3 w-3 text-primary/40" /> Location
                  </label>
                  <Input
                    name="meeting_location"
                    required
                    placeholder="Link or Room No"
                    className="rounded-none border-border h-12 bg-accent/5 focus:bg-white uppercase text-xs"
                  />
                </div>
              </div>

              {/* CUSTOM MESSAGE */}
              <div className="space-y-4">
                <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-bold flex items-center gap-2">
                  <Mail className="h-3 w-3 text-primary/40" />{" "}
                  Custom_Scholar_Instructions
                </label>
                <textarea
                  name="meeting_message"
                  placeholder="ADD_SPECIFIC_INSTRUCTIONS_FOR_THE_CANDIDATE..."
                  className="w-full min-h-[100px] p-4 bg-accent/5 border border-border rounded-none text-xs uppercase tracking-widest font-bold outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>

              {/* DISPATCH METHOD */}
              <div className="space-y-4">
                <label className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-bold flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-primary/40" />{" "}
                  Dispatch_Channel_Registry
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-4 border border-border hover:border-primary cursor-pointer transition-all has-[:checked]:bg-primary/5 has-[:checked]:border-primary group">
                    <input
                      type="radio"
                      name="dispatch_method"
                      value="auto"
                      defaultChecked
                      className="w-4 h-4 text-primary focus:ring-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Auto_Dispatch
                      </span>
                      <span className="text-[8px] text-muted-foreground uppercase">
                        Via_Registry_Mailer
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border border-border hover:border-primary cursor-pointer transition-all has-[:checked]:bg-primary/5 has-[:checked]:border-primary group">
                    <input
                      type="radio"
                      name="dispatch_method"
                      value="manual"
                      className="w-4 h-4 text-primary focus:ring-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Manual_Gmail
                      </span>
                      <span className="text-[8px] text-muted-foreground uppercase">
                        Generate_Draft_Nexus
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 rounded-none bg-primary hover:bg-primary/90 text-white uppercase text-[10px] tracking-[0.4em] font-bold shadow-2xl shadow-primary/20"
              >
                Commit Protocol & Notify
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* PROFILE MODAL */}
      <StudentProfileModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
