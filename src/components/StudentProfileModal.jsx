import React from "react";
import {
  X,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  User,
  Fingerprint,
  CheckCircle,
  AlertCircle,
  Building2,
} from "lucide-react";

export default function StudentProfileModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col rounded-none">
        {/* HEADER */}
        <div className="p-8 border-b border-border bg-accent/5 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-2xl font-mono uppercase">
              {(student.profiles?.name || student.name || "S")[0]}
            </div>
            <div>
              <h2 className="text-3xl font-medium uppercase tracking-tighter italic">
                {student.profiles?.name || student.name}
              </h2>
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-bold">
                Register No: {student.register_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-4 hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* CONTENT (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12">
          {/* PRIMARY INFO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <h3 className="text-[11px] tracking-[0.4em] uppercase font-black text-primary/60 border-b border-primary/10 pb-2">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm uppercase tracking-wider font-medium">
                  <Mail className="h-4 w-4 text-primary" />{" "}
                  {student.profiles?.email ||
                    student.personal_email ||
                    "NO EMAIL DATA"}
                </div>
                <div className="flex items-center gap-4 text-sm uppercase tracking-wider font-medium">
                  <Phone className="h-4 w-4 text-primary" />{" "}
                  {student.mobile || "NO CONTACT DATA"}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-[11px] tracking-[0.4em] uppercase font-black text-primary/60 border-b border-primary/10 pb-2">
                Academic Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm uppercase tracking-wider font-medium">
                  <Building2 className="h-4 w-4 text-primary" /> Campus:{" "}
                  {student.campus || "N/A"}
                </div>
                <div className="flex items-center gap-4 text-sm uppercase tracking-wider font-medium font-mono">
                  <Fingerprint className="h-4 w-4 text-primary" /> Batch:{" "}
                  {student.batches?.name || "NOT_ASSIGNED"}
                </div>
                <div className="flex items-center gap-4 text-sm uppercase tracking-wider font-medium">
                  <BookOpen className="h-4 w-4 text-primary" /> Discipline:{" "}
                  {student.discipline || "N/A"}
                </div>
                <div className="flex items-center gap-4 text-sm uppercase tracking-wider font-medium">
                  <Calendar className="h-4 w-4 text-primary" /> Register No:{" "}
                  {student.register_number || "N/A"}
                </div>
                <div className="flex items-center gap-4 text-sm uppercase tracking-wider font-medium">
                  <Mail className="h-4 w-4 text-primary" /> University Email:{" "}
                  {student.university_email || "N/A"}
                </div>
              </div>
            </section>
          </div>

          {/* RESEARCH TRACKER */}
          <section className="space-y-6">
            <h3 className="text-[11px] tracking-[0.4em] uppercase font-black text-primary/60 border-b border-primary/10 pb-2">
              Proposed Thesis Title
            </h3>
            <div className="bg-accent/5 p-8 border border-border italic font-serif text-lg leading-relaxed">
              "
              {student.proposed_title || "RESEARCH PROPOSAL PENDING SUBMISSION"}
              "
            </div>
          </section>

          {/* RESEARCH Interests */}
          <section className="space-y-6">
            <h3 className="text-[11px] tracking-[0.4em] uppercase font-black text-primary/60 border-b border-primary/10 pb-2">
              Research Interests
            </h3>
            <div className="bg-accent/5 p-8 border border-border italic font-serif text-lg leading-relaxed">
              "
              {student.research_interests ||
                "RESEARCH INTERESTS PENDING SUBMISSION"}
              "
            </div>
          </section>

          {/* MEETING LOGS */}
          <section className="space-y-6 pb-10">
            <h3 className="text-[11px] tracking-[0.4em] uppercase font-black text-primary/60 border-b border-primary/10 pb-2">
              RAH Session Registry
            </h3>
            <div className="border border-border">
              <table className="w-full text-left text-[10px] tracking-widest uppercase font-bold">
                <thead className="bg-accent/5 border-b border-border">
                  <tr>
                    <th className="p-4">Session</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Mode</th>
                    <th className="p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {student.rah_meetings?.length > 0 ? (
                    student.rah_meetings
                      .sort((a, b) => a.meeting_number - b.meeting_number)
                      .map((m) => (
                        <tr
                          key={m.id}
                          className="hover:bg-accent/5 transition-colors"
                        >
                          <td className="p-4 font-mono">
                            #00{m.meeting_number}
                          </td>
                          <td className="p-4">
                            {new Date(m.meeting_date).toLocaleDateString()}
                          </td>
                          <td className="p-4">{m.meeting_mode}</td>
                          <td
                            className={`p-4 text-right ${m.status === "completed" ? "text-green-500" : "text-amber-500"}`}
                          >
                            {m.status}
                          </td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-muted-foreground/40 italic"
                      >
                        NO SESSION LOGS DETECTED
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* FOOTER ACTION */}
        <div className="p-6 bg-primary text-white text-center font-bold text-[10px] tracking-[0.5em] uppercase shadow-inner">
          Scholar Information
        </div>
      </div>
    </div>
  );
}
