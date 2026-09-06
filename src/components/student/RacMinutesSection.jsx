import React, { useEffect, useState } from "react";
import { studentService } from "../../services/api";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
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

const hasOccurred = (meeting) =>
  meeting?.meeting_date && new Date(meeting.meeting_date) <= new Date();

export default function RacMinutesSection({ meetings, onOpenMinutes }) {
  const [statusMap, setStatusMap] = useState({});
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    if (!meetings?.length) return;

    let cancelled = false;

    const loadStatuses = async () => {
      const entries = await Promise.all(
        meetings.map(async (m) => {
          if (!hasOccurred(m)) return [m.id, null];
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

      <div className="space-y-4">
        {[1, 2, 3, 4].map((num) => {
          const meeting = meetings.find((m) => m.meeting_number === num);
          const status = meeting ? statusMap[meeting.id] : null;
          const occurred = hasOccurred(meeting);
          const isDownloading = downloadingId === meeting?.id;

          return (
            <div
              key={num}
              className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center border border-border text-xs font-bold font-mono">
                  {num}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold">
                    Meeting_0{num}
                  </p>
                  <p className="text-[9px] uppercase tracking-tighter text-muted-foreground mt-1">
                    {meeting?.meeting_date
                      ? new Date(meeting.meeting_date).toLocaleDateString()
                      : "Not scheduled yet"}
                    {status && status !== "not_started"
                      ? ` • ${STATUS_LABEL[status] || status}`
                      : occurred
                        ? " • NOT STARTED"
                        : ""}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => onOpenMinutes(meeting.id)}
                  disabled={!meeting || !occurred}
                  variant="outline"
                  className="rounded-none h-9 px-4 uppercase text-[9px] tracking-widest"
                >
                  {status && status !== "draft" && status !== "not_started"
                    ? "View Minutes"
                    : "Fill Minutes"}
                </Button>
                <Button
                  onClick={() => handleDownload(meeting)}
                  disabled={!meeting || !occurred || isDownloading}
                  className="rounded-none h-9 px-4 bg-primary hover:bg-primary/90 text-white uppercase text-[9px] tracking-widest font-bold"
                >
                  <Download className="h-3 w-3 mr-2" />
                  {isDownloading ? "Preparing..." : "Download PDF"}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
