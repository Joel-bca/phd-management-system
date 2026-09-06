import React, { useEffect, useState } from "react";
import { studentService } from "../services/api";
import { X, Save, Send, Loader2, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Statuses in which the student can still edit their draft.
// Anything else (submitted / supervisor_reviewed / rac_reviewed / finalized)
// is locked and shown read-only.
const EDITABLE_STATUSES = ["draft"];

export default function MeetingMinutesModal({ meetingId, onClose, onUpdated }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [minutesStatus, setMinutesStatus] = useState(null);
  const [form, setForm] = useState({
    members_present: "",
    points_discussed: "",
    decisions_reached: "",
  });

  useEffect(() => {
    if (!meetingId) return;
    loadMinutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId]);

  const loadMinutes = async () => {
    setLoading(true);
    try {
      const res = await studentService.getMeetingMinutes(meetingId);
      if (res.success) {
        setMeeting(res.data);

        // Supabase returns the 1:1 relation as an array; normalize it
        const existing = Array.isArray(res.data.rah_meeting_minutes)
          ? res.data.rah_meeting_minutes[0]
          : res.data.rah_meeting_minutes;

        if (existing) {
          setForm({
            members_present: existing.members_present || "",
            points_discussed: existing.points_discussed || "",
            decisions_reached: existing.decisions_reached || "",
          });
          setMinutesStatus(existing.status);
        } else {
          setMinutesStatus(null);
        }
      }
    } catch (err) {
      toast.error(err.message);
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  const isEditable = !minutesStatus || EDITABLE_STATUSES.includes(minutesStatus);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await studentService.saveMinutesDraft(meetingId, form);
      if (res.success) {
        setMinutesStatus(res.data.status);
        toast.success("Draft saved");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !form.members_present.trim() ||
      !form.points_discussed.trim() ||
      !form.decisions_reached.trim()
    ) {
      toast.error("Please fill in all fields before submitting.");
      return;
    }
    if (
      !window.confirm(
        "Once submitted, you won't be able to edit these minutes. Continue?",
      )
    ) {
      return;
    }

    setSubmitting(true);
    try {
      // Persist the latest edits as a draft first, then flip to submitted
      await studentService.saveMinutesDraft(meetingId, form);
      const res = await studentService.submitMinutes(meetingId);
      if (res.success) {
        setMinutesStatus(res.data.status);
        toast.success("Minutes submitted to your supervisor");
        onUpdated?.();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!meetingId) return null;

  const scholarName = meeting?.students?.profiles?.name;
  const registerNumber = meeting?.students?.register_number;
  const supervisorName = meeting?.supervisor?.name;
  const racMember1 = meeting?.rac_member_1?.name;
  const racMember2 = meeting?.rac_member_2?.name;

  const statusLabel = {
    draft: "DRAFT",
    submitted: "SUBMITTED — AWAITING SUPERVISOR",
    supervisor_reviewed: "AWAITING RAC MEMBERS",
    rac_reviewed: "REVIEWED — FINALIZING",
    finalized: "FINALIZED",
  }[minutesStatus] || "NOT STARTED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest">
                RAC Meeting Minutes
              </h3>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
                Meeting #{meeting?.meeting_number} • Status: {statusLabel}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-none"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {/* AUTO-FILLED HEADER INFO (read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-accent/5 border border-border p-5">
              <ReadOnlyField label="Date of Meeting" value={meeting?.meeting_date ? new Date(meeting.meeting_date).toLocaleString() : "—"} />
              <ReadOnlyField label="Venue" value={meeting?.meeting_location || "—"} />
              <ReadOnlyField label="Name of Scholar" value={scholarName || "—"} />
              <ReadOnlyField label="Register Number" value={registerNumber || "—"} />
              <ReadOnlyField label="Name of Supervisor" value={supervisorName || "—"} />
              <ReadOnlyField label="RAC Member 1" value={racMember1 || "—"} />
              <ReadOnlyField label="RAC Member 2" value={racMember2 || "—"} />
            </div>

            {!isEditable && (
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-muted-foreground bg-muted/30 border border-border p-3">
                <Lock className="h-3.5 w-3.5" />
                These minutes have been submitted and can no longer be edited.
              </div>
            )}

            {/* EDITABLE CONTENT */}
            <MinutesTextarea
              label="Members Present"
              value={form.members_present}
              disabled={!isEditable}
              onChange={(v) => setForm({ ...form, members_present: v })}
              placeholder="List everyone present at the meeting..."
            />
            <MinutesTextarea
              label="Points Discussed"
              value={form.points_discussed}
              disabled={!isEditable}
              onChange={(v) => setForm({ ...form, points_discussed: v })}
              placeholder="Summarize what was discussed during the meeting..."
            />
            <MinutesTextarea
              label="Decisions Reached"
              value={form.decisions_reached}
              disabled={!isEditable}
              onChange={(v) => setForm({ ...form, decisions_reached: v })}
              placeholder="Summarize the decisions or next steps agreed upon..."
            />

            {isEditable && (
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  onClick={handleSaveDraft}
                  disabled={saving || submitting}
                  variant="outline"
                  className="rounded-none h-11 px-6 uppercase text-[10px] tracking-widest"
                >
                  <Save className="h-3.5 w-3.5 mr-2" />
                  {saving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={saving || submitting}
                  className="rounded-none h-11 px-6 bg-primary hover:bg-primary/90 text-white uppercase text-[10px] tracking-widest font-bold"
                >
                  <Send className="h-3.5 w-3.5 mr-2" />
                  {submitting ? "Submitting..." : "Submit to Supervisor"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-xs font-mono">{value}</p>
    </div>
  );
}

function MinutesTextarea({ label, value, onChange, disabled, placeholder }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </p>
      <textarea
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full border border-border bg-white p-4 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted/30 disabled:text-muted-foreground"
      />
    </div>
  );
}