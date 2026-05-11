import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  FileText,
  MoreHorizontal,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  Eye,
} from "lucide-react";
import { hodService } from "../../services/api";
import { Button } from "@/components/ui/button";
import StudentProfileModal from "../../components/StudentProfileModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userRes, batchRes] = await Promise.all([
        hodService.getUsers("student"),
        hodService.getBatches(),
      ]);

      if (userRes?.success) setStudents(userRes.data || []);
      if (batchRes?.success) setBatches(batchRes.data || []);
    } catch (err) {
      console.error("Failed to load data", err);
      toast.error("DIRECTORY_SYNC_FAILED");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.profiles?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.register_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      student.university_email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesBatch =
      selectedBatch === "all" || student.batch_id === parseInt(selectedBatch);

    return matchesSearch && matchesBatch;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 font-sans">
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[0.1em] uppercase">
            <span className="text-primary">
              Student <span className="text-primary">Directory</span>
            </span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase mt-2 text-muted-foreground font-bold">
            Catalog: CANDIDATES • System: ACTIVE • Encryption: AES-256
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            onClick={loadData}
            variant="outline"
            className="rounded-none uppercase text-[10px] tracking-widest bg-white h-10 px-6"
          >
            <RefreshCw
              className={`mr-2 h-3 w-3 ${loading ? "animate-spin" : ""}`}
            />
            Sync Nexus
          </Button>
        </div>
      </header>

      {/* SEARCH/FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH_BY_NAME_OR_REG_NO..."
            className="w-full bg-card border border-border h-11 pl-10 pr-4 text-[10px] tracking-[0.2em] uppercase outline-none focus:ring-1 focus:ring-primary transition-all rounded-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-card border border-border h-11 px-4">
          <Filter className="h-3 w-3 text-muted-foreground" />
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="bg-transparent text-[10px] tracking-widest uppercase font-bold outline-none cursor-pointer"
          >
            <option value="all">All_Batches</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="border border-border bg-card">
        <Table>
          <TableHeader className="bg-accent/5">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[10px] tracking-[0.3em] uppercase pl-8 h-14 font-bold text-muted-foreground">
                Candidate Name
              </TableHead>
              <TableHead className="text-[10px] tracking-[0.3em] uppercase h-14 font-bold text-muted-foreground">
                Registry NO
              </TableHead>
              <TableHead className="text-[10px] tracking-[0.3em] uppercase h-14 font-bold text-muted-foreground">
                Field Discipline
              </TableHead>
              <TableHead className="text-[10px] tracking-[0.3em] uppercase h-14 font-bold text-muted-foreground">
                Supervisor
              </TableHead>
              <TableHead className="text-[10px] tracking-[0.3em] uppercase pr-8 h-14 font-bold text-muted-foreground text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} className="border-border animate-pulse">
                  <TableCell colSpan={5} className="h-16 pl-8">
                    <div className="h-3 bg-accent/20 w-1/3 rounded-none" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground/40 font-bold">
                    {searchQuery || selectedBatch !== "all"
                      ? "No_Matches_Found"
                      : "Registry_Empty_Awaiting_Data"}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className="border-border hover:bg-accent/5 group transition-colors"
                >
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-none border border-primary/20">
                        <GraduationCap className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-wider uppercase">
                          {student.student_name || "IDENTITY_UNKNOWN"}
                        </p>
                        <p className="text-[9px] text-muted-foreground font-mono mt-0.5">
                          {student.university_email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-mono bg-accent/20 px-2 py-1 border border-border">
                      {student.register_number}
                    </span>
                  </TableCell>
                  <TableCell className="text-[10px] tracking-widest uppercase font-medium">
                    {student.discipline}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        className={`h-3 w-3 ${student.student_supervisor_map?.some((m) => m.is_active) ? "text-primary/60" : "text-muted-foreground/30"}`}
                      />
                      <span className="text-[10px] tracking-tighter uppercase font-bold text-muted-foreground">
                        {student.student_supervisor_map?.find(
                          (m) => m.is_active,
                        )?.supervisors?.name || "UNASSIGNED"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
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

      {/* PROFILE MODAL */}
      <StudentProfileModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
