import React from "react";
import {
  X,
  MapPin,
  Info,
  Calendar,
  AlignLeft,
  ShieldCheck,
} from "lucide-react";

export default function MeetingDetailsModal({ meeting, onClose }) {
  if (!meeting) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl border border-border shadow-2xl overflow-hidden rounded-none flex flex-col font-sans">
        {/* HEADER */}
        <div className="p-8 border-b border-border bg-accent/5 flex justify-between items-start">
          <div className="space-y-3">
            <h2 className="text-2xl font-black uppercase tracking-widest italic text-muted-foreground/30">
              Meeting Number #{meeting.meeting_number}
            </h2>
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-bold">
              ID: {meeting.id.split("-")[0]} // Status: {meeting.status}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-10">
          {/* SUBJECT SECTION */}
          <section className="space-y-4">
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-black text-muted-foreground flex items-center gap-3">
              <Info className="h-3.5 w-3.5" /> Subject Objective
            </h3>
            <p className="text-xl font-medium border-l-[3px] border-primary pl-5 py-1 text-foreground leading-snug text-left">
              {meeting.meeting_subject || "NO SUBJECT SPECIFIED"}
            </p>
          </section>

          <div className="grid grid-cols-2 gap-10">
            {/* LOCATION */}
            <section className="space-y-4">
              <h3 className="text-[10px] tracking-[0.4em] uppercase font-black text-muted-foreground flex items-center gap-3">
                <MapPin className="h-3.5 w-3.5" /> Location Mode
              </h3>
              <p className="text-sm font-bold uppercase tracking-widest text-foreground pl-1 text-left">
                {meeting.meeting_mode}{" "}
                {meeting.meeting_location
                  ? `— ${meeting.meeting_location}`
                  : ""}
              </p>
            </section>

            {/* DATE/TIME */}
            <section className="space-y-4">
              <h3 className="text-[10px] tracking-[0.4em] uppercase font-black text-muted-foreground flex items-center gap-3">
                <Calendar className="h-3.5 w-3.5" /> Timestamp
              </h3>
              <p className="text-sm font-bold uppercase tracking-widest text-foreground pl-1 text-left">
                {new Date(meeting.meeting_date).toLocaleDateString()} //{" "}
                {new Date(meeting.meeting_date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </section>
          </div>

          {/* REMARKS/AGENDA */}
          <section className="space-y-4">
            <h3 className="text-[10px] tracking-[0.4em] uppercase font-black text-muted-foreground flex items-center gap-3">
              <AlignLeft className="h-3.5 w-3.5" /> Remarks
            </h3>
            <div className="bg-background p-8 border border-dashed border-border font-mono text-xs leading-loose text-muted-foreground text-left">
              {meeting.remarks ||
                "NO ADDITIONAL REMARKS OR AGENDA PROVIDED BY SUPERVISOR."}
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="p-5 bg-accent/5 border-t border-border flex justify-end">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-bold text-muted-foreground/40">
            <ShieldCheck className="h-3.5 w-3.5" /> Please Cross Check with your
            Supervisor
          </div>
        </div>
      </div>
    </div>
  );
}
