import React, { useState } from "react";
import {
  UserCheck,
  Users,
  Link2,
  Mail,
  ExternalLink,
  Hash,
  Search,
  RotateCcw,
} from "lucide-react";

export default function AssignmentsList({ students = [], onReassign }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter students who have an active supervisor assignment
  const allAssignments =
    students?.filter((student) =>
      student.student_supervisor_map?.some((m) => m.is_active),
    ) || [];

  // Filter based on search query
  const filteredAssignments = allAssignments.filter((student) => {
    const activeMapping = student.student_supervisor_map?.find(
      (m) => m.is_active,
    );
    const searchLower = searchQuery.toLowerCase();

    return (
      student.profiles?.name?.toLowerCase().includes(searchLower) ||
      student.register_number?.toLowerCase().includes(searchLower) ||
      activeMapping?.supervisors?.name?.toLowerCase().includes(searchLower) ||
      activeMapping?.supervisors?.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="mt-16 space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-row items-center md:items-start gap-4 text-center md:text-left">
          <div className="p-3 bg-primary/5 border border-primary/10 rounded-full w-fit">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h2
              style={{ color: "#1e40af" }}
              className=" text-[12px] tracking-[0.6em] uppercase font-bold text-foreground"
            >
              Identity_Mapping_Registry
            </h2>
            <p className="text-[9px] tracking-widest uppercase text-muted-foreground font-bold">
              Protocol: Scholar-Faculty Linkage • Active Allocations
            </p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-3 w-3 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="SEARCH BY SCHOLAR NAME, REGISTER NUMBER, SUPERVISOR NAME"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-accent/5 border border-border h-12 pl-12 pr-4 text-[10px] tracking-widest uppercase font-bold outline-none focus:border-primary transition-colors"
          />
          {searchQuery && (
            <div className="absolute top-full right-0 mt-2 text-[8px] font-black uppercase tracking-widest text-primary animate-in fade-in slide-in-from-top-1">
              {filteredAssignments.length} Mappings Found
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAssignments.length > 0 ? (
          filteredAssignments.map((student) => {
            const activeMapping = student.student_supervisor_map?.find(
              (m) => m.is_active,
            );
            const studentInitial =
              student.profiles?.name?.charAt(0).toUpperCase() || "S";
            const supervisorInitial =
              activeMapping?.supervisors?.name?.charAt(0).toUpperCase() || "F";

            return (
              <div
                key={student.id}
                className="relative group bg-card border border-border p-8 transition-all duration-500 hover:border-primary/40"
              >
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/20 transition-colors group-hover:border-primary" />

                <div className="flex flex-col items-center">
                  {/* SCHOLAR SECTION */}
                  <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="w-20 h-20 bg-primary/5 border border-primary/20 flex items-center justify-center text-2xl font-bold tracking-tighter group-hover:bg-primary/10 transition-colors">
                        {studentInitial}
                      </div>
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background border border-border px-3 py-0.5 text-[8px] tracking-[0.3em] font-black uppercase text-muted-foreground">
                        SCHOLAR
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                        {student.profiles?.name || student.student_name}
                      </h3>
                      <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-muted-foreground">
                        <Hash className="h-2.5 w-2.5" />
                        {student.register_number}
                      </div>
                    </div>
                  </div>

                  {/* LINK NODE */}
                  <div className="relative w-full flex justify-center py-4">
                    <div className="absolute inset-y-0 w-px bg-border group-hover:bg-primary/30 transition-colors" />
                    <div className="relative z-10 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center group-hover:border-primary group-hover:rotate-45 transition-all duration-500">
                      <Link2 className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  {/* SUPERVISOR SECTION */}
                  <div className="mt-8 w-full">
                    <div className="bg-accent/5 border border-border p-5 space-y-4">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-primary border border-primary/20 px-4 py-1 text-[8px] tracking-[0.4em] font-black uppercase text-primary-foreground shadow-lg shadow-primary/10">
                          Primary Supervisor
                        </div>
                        <div className="flex items-center gap-3 text-center">
                          <div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-sm font-bold tracking-widest shrink-0">
                            {supervisorInitial}
                          </div>
                          <div className="flex flex-col items-start overflow-hidden">
                            <span className="text-xs font-bold uppercase tracking-wider text-foreground truncate w-full text-left">
                              {activeMapping?.supervisors?.name || "UNLINKED"}
                            </span>
                            <div className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                              <Mail className="h-2.5 w-2.5" />
                              {activeMapping?.supervisors?.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-2 border-t border-border/50">
                        <button
                          onClick={() => onReassign?.(student.id)}
                          className="flex cursor-pointer items-center justify-center gap-2 py-2 border border-border hover:bg-primary hover:text-primary-foreground transition-all text-[9px] font-black uppercase tracking-widest"
                        >
                          <RotateCcw className="h-3 w-3" /> Reassign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-border">
            <p className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground font-black italic">
              Registry_Void • No_Active_Mappings_Detected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
