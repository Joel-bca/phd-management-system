import React from "react";
import {
  X,
  Info,
  ShieldCheck,
  Cpu,
  Database,
  Calendar,
  Server,
} from "lucide-react";

export default function SystemManifestModal({ manifest, onClose }) {
  if (!manifest) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg border border-border shadow-2xl overflow-hidden rounded-none flex flex-col">
        {/* HEADER */}
        <div className="p-6 border-b border-border bg-accent/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 border border-primary/20 text-primary">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-medium uppercase tracking-widest italic text-primary">
                System Manifest
              </h2>
              <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-bold">
                Build Identity & Versioning
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8">
          {/* VERSION INFO */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-20 w-20 rounded-full border-4 border-primary/10 flex items-center justify-center bg-primary/5 text-primary text-2xl font-black font-mono">
              {manifest.version_code || "1.0.0"}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] font-bold text-muted-foreground">
                Software Version
              </p>
              <h3 className="text-2xl font-serif italic">Ph.D System</h3>
            </div>
          </div>

          {/* TECHNICAL SPECS */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-border bg-accent/5 space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary font-bold">
                <ShieldCheck className="h-3 w-3" /> Security
              </div>
              <p className="text-xs font-mono">HARDENED</p>
            </div>
            <div className="p-4 border border-border bg-accent/5 space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary font-bold">
                <Server className="h-3 w-3" /> Deployment
              </div>
              <p className="text-xs font-mono uppercase">
                {manifest.deployment_status || "STABLE"}
              </p>
            </div>
            <div className="p-4 border border-border bg-accent/5 space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary font-bold">
                <Database className="h-3 w-3" /> Integrity
              </div>
              <p className="text-xs font-mono uppercase">OPERATIONAL</p>
            </div>
            <div className="p-4 border border-border bg-accent/5 space-y-2">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary font-bold">
                <Calendar className="h-3 w-3" /> Release Date
              </div>
              <p className="text-xs font-mono uppercase">
                {manifest.created_at
                  ? new Date(manifest.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* MOTD / RELEASE NOTES */}
          {manifest.motd_message && (
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground border-b border-border pb-1">
                Release_Notes
              </h4>
              <div className="bg-accent/5 p-4 border-l-2 border-primary italic text-xs leading-relaxed text-muted-foreground">
                "{manifest.motd_message}"
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-primary text-white text-center font-bold text-[9px] tracking-[0.5em] uppercase shadow-inner">
          Institutional Academic Infrastructure • 2026
        </div>
        <div className="p-4 bg-primary text-white text-center font-bold text-[9px] tracking-[0.5em] uppercase shadow-inner">
          Developed by 2 BCA B
        </div>
      </div>
    </div>
  );
}
