import React, { useEffect, useState } from "react";
import { studentService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { FileText, Download, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { exportRacDocuments } from "../../utils/racPdfExport";
// Adjust this path to wherever the logo asset actually lives in your project
import christLogo from "../../assets/christ-logo.png";

const STATUS_LABEL = {
  draft: "DRAFT",
  submitted: "SUBMITTED",
  supervisor_reviewed: "SUPERVISOR REVIEWED",
  rac_reviewed: "RAC REVIEWED",
  finalized: "FINALIZED",
};

// A meeting "has ended" once its stored timestamp is in the past.
// This is the single source of truth for when the forms unlock —
// no separate "scheduled/not scheduled" placeholder logic anymore.
const hasEnded = (meeting) =>
  !!meeting?.meeting_date && new Date(meeting.meeting_date).getTime() <= Date.now();

export default function RacMinutesSection({ meetings, onOpenMinutes }) {
  const [statusMap, setStatusMap] = useState({});
  const [downloadingId, setDownloadingId] = useState(null);

  // Read directly off whatever meetings actually exist in rah_meetings
  // for this student — sorted so Meeting #1 always appears first.
  const sortedMeetings = [...(meetings || [])].sort(
    (a, b) => (a.meeting_number || 0) - (b.meeting_number || 0),
  );

  useEffect(() => {
    if (!sortedMeetings.length) return;

    let cancelled = false;

    const loadStatuses = async () => {
      const entries = await Promise.all(
        sortedMeetings
          .filter((m) => hasEnded(m))
          .map(async (m) => {
            try {
              const res = await studentService.getMeetingMinutes(m.id);
              const minutes = Array.isArray(res.data?.rah_meeting_minutes)
                ? res.data.rah_meeting_minutes[0]
                : res.data?.rah_meeting_minutes;
              return [m.id, minutes?.status || "not_started"];
            } catch {
              return [m.id, null];
            }
          }),
      );
      if (!cancelled) setStatusMap(Object.fromEntries(entries));
    };

    loadStatuses();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetings]);

  const handleDownload = async (meeting) => {
    setDownloadingId(meeting.id);
    try {
      const res = await studentService.getMeetingMinutes(meeting.id);
      if (res.success) {
        await exportRacDocuments(res.data, christLogo);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="border border-border bg-card p-10">
      <div className="flex items-center gap-4 mb-8 border-b border-border pb-6">
        <div className="bg-primary/5 p-3 rounded-none">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-medium uppercase tracking-[0.1em]">
            <span className="text-primary">RAC Minutes</span>
          </h3>
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-bold mt-1">
            Minutes of Meeting &amp; Progress Review
          </p>
        </div>
      </div>

      {sortedMeetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <CalendarClock className="h-6 w-6 text-muted-foreground/40" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            No RAC meetings scheduled yet
          </p>
          <p className="text-[9px] uppercase tracking-wide text-muted-foreground/60 max-w-sm">
            Once your supervisor schedules a meeting, it will appear here
            automatically, and the forms unlock right after the meeting time
            has passed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMeetings.map((meeting) => {
            const ended = hasEnded(meeting);
            const status = statusMap[meeting.id];
            const isDownloading = downloadingId === meeting.id;

            return (
              <div
                key={meeting.id}
                className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border border-border text-xs font-bold font-mono">
                    {meeting.meeting_number}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold">
                      Meeting_0{meeting.meeting_number}
                      {meeting.meeting_subject ? ` — ${meeting.meeting_subject}` : ""}
                    </p>
                    <p className="text-[9px] uppercase tracking-tighter text-muted-foreground mt-1">
                      {meeting.meeting_date
                        ? new Date(meeting.meeting_date).toLocaleString()
                        : "Date not set"}
                      {!ended && " • UPCOMING"}
                      {ended && status && status !== "not_started"
                        ? ` • ${STATUS_LABEL[status] || status}`
                        : ""}
                      {ended && (!status || status === "not_started") && " • NOT STARTED"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => onOpenMinutes(meeting.id)}
                    disabled={!ended}
                    variant="outline"
                    className="rounded-none h-9 px-4 uppercase text-[9px] tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                    title={!ended ? "Unlocks once the meeting time has passed" : undefined}
                  >
                    {status && status !== "draft" && status !== "not_started"
                      ? "View Minutes"
                      : "Fill Minutes"}
                  </Button>
                  <Button
                    onClick={() => handleDownload(meeting)}
                    disabled={!ended || isDownloading}
                    className="rounded-none h-9 px-4 bg-primary hover:bg-primary/90 text-white uppercase text-[9px] tracking-widest font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                    title={!ended ? "Unlocks once the meeting time has passed" : undefined}
                  >
                    <Download className="h-3 w-3 mr-2" />
                    {isDownloading ? "Preparing..." : "Download PDF"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}