import React, { useEffect, useState } from "react";
import { studentService, meetingService } from "../../services/api";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  ShieldCheck,
  RefreshCw,
  Edit2,
  Save,
  X,
  BookOpen,
  Layers,
  GraduationCap,
  MapPin,
  Info,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import MeetingDetailsModal from "../../components/MeetingDetailsModal";

// --- MAIN COMPONENT ---
export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [tempContact, setTempContact] = useState({
    personal_email: "",
    mobile: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, meetingRes] = await Promise.all([
        studentService.getProfile(),
        meetingService.getMeetings(),
      ]);

      if (profileRes.success) {
        setProfile(profileRes.data);
        setTempContact({
          personal_email: profileRes.data.personal_email || "",
          mobile: profileRes.data.mobile || "",
        });
      }

      if (meetingRes.success) {
        setMeetings(meetingRes.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("DATA_SYNC_FAILED: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveContact = async () => {
    try {
      const res = await studentService.updateContact(tempContact);
      if (res.success) {
        setProfile({ ...profile, ...tempContact });
        setIsEditing(false);
        toast.success("CONTACT_PROTOCOL_UPDATED");
      }
    } catch (err) {
      toast.error("UPDATE_FAILED: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-[10px] tracking-[0.4em] uppercase font-bold text-muted-foreground">
            Synchronizing Scholar Information
          </p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Logic to find the next scheduled (pending) meeting
  const upcomingMeeting = meetings
    .filter((m) => m.status === "pending")
    .sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date))[0];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.1em] uppercase">
            <span className="text-primary">
              Scholar <span className="text-primary">Portal</span>
            </span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-muted-foreground font-bold">
            Hello {profile.profiles?.name} | Register Number:{" "}
            {profile.register_number}
          </p>
        </div>
        <Button
          onClick={loadData}
          variant="outline"
          className="rounded-none uppercase text-[10px] tracking-widest bg-white h-11 px-6"
        >
          <RefreshCw
            className={`mr-2 h-3 w-3 ${loading ? "animate-spin" : ""}`}
          />
          Sync Data
        </Button>
      </header>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* CORE IDENTITY MODULE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 border border-border bg-card p-8 flex flex-col items-center text-center">
            <div className="bg-primary/5 p-6 border border-primary/10 mb-6">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-medium uppercase tracking-widest mb-1">
              {profile.profiles?.name}
            </h2>
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground font-bold mb-6">
              {profile.discipline}
            </p>

            <div className="w-full pt-6 border-t border-border space-y-4">
              <div className="flex justify-between text-[10px] tracking-widest uppercase">
                <span className="text-muted-foreground font-bold text-left">
                  Supervisor
                </span>
                <span className="text-foreground font-bold text-right">
                  {profile.student_supervisor_map?.[0]?.supervisors?.name ||
                    "UNASSIGNED"}
                </span>
              </div>
              <div className="flex justify-between text-[10px] tracking-widest uppercase text-left">
                <span className="text-muted-foreground font-bold">Batch</span>
                <span className="text-foreground font-bold text-right">
                  {profile.batches?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 border border-border bg-card p-8">
            <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
              <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary/40" />{" "}
                Contact_Protocol
              </h3>
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-none text-[9px] tracking-widest uppercase font-bold text-primary hover:bg-primary/10"
                >
                  <Edit2 className="h-3 w-3 mr-2" /> Modify_Contact
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveContact}
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-none text-[9px] tracking-widest uppercase font-bold text-primary hover:bg-primary/10"
                  >
                    <Save className="h-3 w-3 mr-2" /> Commit
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-none text-[9px] tracking-widest uppercase font-bold text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-3 w-3 mr-2" /> Abort
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
                    University Email
                  </p>
                  <div className="flex items-center gap-3 p-4 bg-accent/5 border border-border">
                    <Mail className="h-4 w-4 text-primary/40" />
                    <span className="text-xs font-mono">
                      {profile.university_email}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
                    Personal Email
                  </p>
                  {isEditing ? (
                    <Input
                      value={tempContact.personal_email}
                      onChange={(e) =>
                        setTempContact({
                          ...tempContact,
                          personal_email: e.target.value,
                        })
                      }
                      className="rounded-none h-12 bg-white text-xs"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 border border-border">
                      <Mail className="h-4 w-4 text-muted-foreground/30" />
                      <span className="text-xs font-mono">
                        {profile.personal_email || "NOT_SPECIFIED"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
                    Mobile Number
                  </p>
                  {isEditing ? (
                    <Input
                      value={tempContact.mobile}
                      onChange={(e) =>
                        setTempContact({
                          ...tempContact,
                          mobile: e.target.value,
                        })
                      }
                      className="rounded-none h-12 bg-white uppercase text-xs"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-4 border border-border">
                      <Phone className="h-4 w-4 text-muted-foreground/30" />
                      <span className="text-xs font-mono">
                        {profile.mobile || "NOT_SPECIFIED"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="bg-primary/5 p-5 border border-primary/10">
                  <p className="text-[10px] leading-relaxed text-primary/80 italic">
                    All administrative updates are logged and synchronized.
                    Ensure your personal informations remains accessible for
                    emergency contact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS TRACKER SECTION */}
        <div className="border border-border bg-card p-10">
          <div className="flex items-center gap-4 mb-10 border-b border-border pb-6">
            <div className="bg-primary/5 p-3 rounded-none">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-medium uppercase tracking-[0.1em]">
                <span className="text-primary">Research Tracker</span>
              </h3>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-bold mt-1">
                Status: RAH Meetings Tracker
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[2.25rem] left-[5rem] right-[5rem] h-[1px] bg-border z-0" />

            {[1, 2, 3, 4].map((num) => {
              const meeting = meetings.find((m) => m.meeting_number === num);
              const isCompleted = meeting?.status === "completed";
              const isUpcoming = upcomingMeeting?.meeting_number === num;

              return (
                <div
                  key={num}
                  className="relative z-10 flex flex-col items-center group"
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                        : isUpcoming
                          ? "bg-white border-primary text-primary shadow-lg shadow-primary/10"
                          : "bg-white border-border text-muted-foreground/30"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-xs font-bold font-mono">{num}</span>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p
                      className={`text-[10px] tracking-widest uppercase font-bold mb-1 ${
                        isCompleted || isUpcoming
                          ? "text-foreground"
                          : "text-muted-foreground/40"
                      }`}
                    >
                      Meeting_0{num}
                    </p>
                    <p
                      className={`text-[9px] uppercase tracking-tighter ${
                        isCompleted
                          ? "text-primary/60"
                          : isUpcoming
                            ? "text-primary"
                            : "text-muted-foreground/30"
                      }`}
                    >
                      {isCompleted
                        ? "VERIFIED"
                        : isUpcoming
                          ? "SCHEDULED"
                          : "AWAITING"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {upcomingMeeting && (
            <div className="mt-12 p-6 bg-accent/5 border border-border border-dashed flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center px-4 border-r border-border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {new Date(upcomingMeeting.meeting_date).toLocaleDateString(
                      "en-US",
                      { month: "short" },
                    )}
                  </span>
                  <span className="text-2xl font-medium tracking-tighter">
                    {new Date(upcomingMeeting.meeting_date).getDate()}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest">
                    Next Scheduled RAH Meeting
                  </h4>
                  <p className="text-[10px] uppercase text-muted-foreground tracking-tight mt-1">
                    Meeting #{upcomingMeeting.meeting_number} •{" "}
                    {upcomingMeeting.meeting_mode} •{" "}
                    {new Date(upcomingMeeting.meeting_date).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      },
                    )}{" "}
                    • {upcomingMeeting.meeting_location}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setSelectedMeeting(upcomingMeeting)}
                className="rounded-none h-11 px-8 bg-primary hover:bg-primary/90 text-white uppercase text-[10px] tracking-widest font-bold"
              >
                Examine Agenda
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* MEETING MODAL */}
      <MeetingDetailsModal
        meeting={selectedMeeting}
        onClose={() => setSelectedMeeting(null)}
      />
    </div>
  );
}
