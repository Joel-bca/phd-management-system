import React, { useState, useEffect } from "react";
import {
  Link,
  Link2,
  Users,
  UserCheck,
  RefreshCw,
  Search,
  ShieldCheck,
  ArrowRightLeft,
  CheckCircle2,
} from "lucide-react";
import { hodService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AssignmentsList from "../../components/hod/assigements";

export default function Assignment() {
  const [students, setStudents] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");

  const loadData = async () => {
    setSyncing(true);
    try {
      const [sData, spData] = await Promise.all([
        hodService.getUsers("student"),
        hodService.getUsers("supervisor"),
      ]);

      if (sData?.success) setStudents(sData.data || []);
      if (spData?.success) setSupervisors(spData.data || []);
    } catch (err) {
      console.error("Data load failed", err);
      toast.error("PROTOCOL_SYNC_FAILED");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async () => {
    if (!selectedStudent || !selectedSupervisor) {
      toast.error("MISSING_ASSIGNMENT_PARAMETERS");
      return;
    }

    setLoading(true);
    try {
      const res = await hodService.assignSupervisor({
        student_id: selectedStudent,
        supervisor_id: selectedSupervisor,
      });

      if (res?.success) {
        toast.success("ASSIGNMENT_PROTOCOL_COMMITTED");
        setSelectedStudent("");
        setSelectedSupervisor("");
        loadData(); // Refresh to show updated mappings in directory later
      }
    } catch (err) {
      toast.error(err.message || "ASSIGNMENT_FAILED");
    } finally {
      setLoading(false);
    }
  };

  const handleReassign = (studentId) => {
    setSelectedStudent(studentId);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("CANDIDATE_SELECTED_FOR_REASSIGNMENT");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
      {/* ... (rest of the header and mapping section remains same) */}
      
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.1em] uppercase">
            <span className="text-primary">Faculty Assignment </span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-muted-foreground font-bold">
            CANDIDATE_FACULTY_LINKING • Encryption: SECURE_CHANNEL
          </p>
        </div>
        <Button
          onClick={loadData}
          variant="outline"
          className="rounded-none uppercase text-[10px] tracking-widest bg-white h-10 px-6"
        >
          <RefreshCw
            className={`mr-2 h-3 w-3 ${syncing ? "animate-spin" : ""}`}
          />
          Refresh Registry
        </Button>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-8 items-center mb-12">
          {/* STUDENT SELECTION */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-muted-foreground">
                Select_Candidate
              </h3>
            </div>
            <div className="border border-border bg-card p-6 min-h-[200px] flex flex-col justify-between">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 text-[11px] tracking-widest uppercase outline-none focus:border-primary transition-colors cursor-pointer mb-6"
              >
                <option value="">-- SEARCH_CANDIDATE_REGISTRY --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.profiles?.name} ({s.register_number})
                  </option>
                ))}
              </select>

              {selectedStudent && (
                <div className="animate-in fade-in slide-in-from-left-2">
                  <p className="text-[9px] uppercase tracking-tighter text-muted-foreground mb-1">
                    Current Status
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider">
                    {students
                      .find((s) => s.id === selectedStudent)
                      ?.student_supervisor_map?.some((m) => m.is_active)
                      ? "ALREADY_ASSIGNED"
                      : "AWAITING_ALLOCATION"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CONNECTOR */}
          <div className="md:col-span-1 flex justify-center">
            <div className="bg-accent/10 p-3 rounded-full border border-border">
              <ArrowRightLeft className="h-4 w-4 text-primary/40" />
            </div>
          </div>

          {/* SUPERVISOR SELECTION */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] tracking-[0.3em] uppercase font-bold text-muted-foreground">
                Select_Faculty
              </h3>
            </div>
            <div className="border border-border bg-card p-6 min-h-[200px] flex flex-col justify-between">
              <select
                value={selectedSupervisor}
                onChange={(e) => setSelectedSupervisor(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 text-[11px] tracking-widest uppercase outline-none focus:border-primary transition-colors cursor-pointer mb-6"
              >
                <option value="">-- SELECT_AVAILABLE_SUPERVISOR --</option>
                {supervisors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              {selectedSupervisor && (
                <div className="animate-in fade-in slide-in-from-right-2">
                  <p className="text-[9px] uppercase tracking-tighter text-muted-foreground mb-1">
                    Load Status
                  </p>
                  <p className="text-xs font-bold uppercase tracking-wider">
                    FACULTY_NODE_READY
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SUBMIT SECTION */}
        <div className="flex flex-col items-center">
          <Button
            onClick={handleAssign}
            disabled={loading || !selectedStudent || !selectedSupervisor}
            className="h-16 px-12 rounded-none bg-primary hover:bg-primary/90 text-white uppercase text-[10px] tracking-[0.4em] font-bold shadow-2xl shadow-primary/20 disabled:opacity-30 disabled:grayscale transition-all"
          >
            {loading ? (
              <RefreshCw className="mr-3 h-4 w-4 animate-spin" />
            ) : (
              <Link2 className="mr-3 h-4 w-4" />
            )}
            Establish Mapping Protocol
          </Button>

          <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-accent/5 border border-border">
            <ShieldCheck className="h-3 w-3 text-primary/40" />
            <p className="text-[9px] tracking-widest uppercase text-muted-foreground">
              All assignments are logged and synchronized across the System.
            </p>
          </div>

          {/* ASSIGNMENT REGISTRY LIST */}
          <div className="w-full max-w-7xl">
            <AssignmentsList students={students} onReassign={handleReassign} />
          </div>
        </div>
      </div>
    </div>
  );
}
