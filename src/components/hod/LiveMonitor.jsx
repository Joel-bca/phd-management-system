import React from "react";
import { Activity } from "lucide-react";

export default function LiveMonitor({ logs }) {
  return (
    <div className="border border-border bg-card flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center bg-accent/5">
        <div className="flex items-center gap-3">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-[10px] tracking-[0.4em] uppercase font-bold">
            Recent Session Events
          </h3>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground tracking-tighter uppercase animate-pulse">
          Monitoring Active
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans no-scrollbar">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground text-[10px] uppercase tracking-[0.4em] italic opacity-50">
              No transmissions recorded
            </p>
          </div>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className="flex items-start gap-4 pb-3 border-b border-border/50 last:border-0"
            >
              <span className="text-[9px] font-mono text-muted-foreground bg-accent/10 px-2 py-0.5 border border-border/30 tabular-nums">
                {log.timestamp}
              </span>
              <span
                className={`text-[11px] uppercase tracking-tight font-medium ${
                  log.type === "error"
                    ? "text-destructive"
                    : log.type === "success"
                      ? "text-primary"
                      : "text-foreground/70"
                }`}
              >
                {log.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
