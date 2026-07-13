import { createUserClient } from "../../utils/supabaseUser.js";
import { sendMeetingInvitation } from "../../utils/mailer.js";

export const createMeetings = async (token, supervisorId, body) => {
  const supabase = createUserClient(token);

  const {
    student_ids,
    meeting_number,
    meeting_date,
    meeting_mode,
    meeting_subject,
    meeting_location,
    meeting_message,
    send_email,
  } = body;

  const payload = student_ids.map((studentId) => ({
    student_id: studentId,
    supervisor_id: supervisorId,
    meeting_number,
    meeting_date,
    meeting_mode,
    meeting_subject,
    meeting_location,
    Status_deletion: true, // Visible by default
  }));

  const { data, error } = await supabase
    .from("rah_meetings")
    .insert(payload)
    .select();

  if (error) throw new Error(error.message);

  // TRIGGER_DISPATCH: Handle automated notifications if flag is set
  if (send_email) {
    try {
      // 1. Resolve Scholar Identities (Institutional Emails)
      const { data: scholars } = await supabase
        .from("students")
        .select("university_email, student_name")
        .in("id", student_ids);

      // 2. Resolve Supervisor Identity
      const { data: supervisor } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", supervisorId)
        .single();

      if (scholars && scholars.length > 0) {
        const emails = scholars.map(s => s.university_email).filter(Boolean);
        if (emails.length > 0) {
          await sendMeetingInvitation(
            emails,
            { 
              meeting_subject, 
              meeting_date, 
              meeting_mode, 
              meeting_location, 
              meeting_message 
            },
            supervisor?.name || "Faculty Supervisor"
          );
        }
      }
    } catch (mailErr) {
      console.error("PROTOCOL_DISPATCH_ERROR: Notification failed:", mailErr.message);
    }
  }

  return data;
};

export const updateMeeting = async (token, meetingId, updates) => {
  const supabase = createUserClient(token);

  const { data, error } = await supabase
    .from("rah_meetings")
    .update(updates)
    .eq("id", meetingId)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};

export const deleteMeeting = async (token, meetingId) => {
  const supabase = createUserClient(token);

  // SOFT_DELETE: Update Status_deletion to false AND status to cancelled
  const { error } = await supabase
    .from("rah_meetings")
    .update({ 
      Status_deletion: false,
      status: "cancelled" 
    })
    .eq("id", meetingId);

  if (error) throw new Error(error.message);

  return { success: true };
};

export const getMeetings = async (token, user, showDeleted = false) => {
  const supabase = createUserClient(token);

  // Fetch base meeting protocols
  let query = supabase.from("rah_meetings").select("*");

  if (!showDeleted) {
    query = query.eq("Status_deletion", true);
  }

  if (user.role === "student") {
    query = query.eq("student_id", user.id);
  }

  if (user.role === "supervisor") {
    query = query.eq("supervisor_id", user.id);
  }

  const { data: meetings, error } = await query;
  if (error) throw new Error(error.message);

  // 🛡️ DATA_ENRICHMENT: Resolve Scholar and Supervisor identities manually
  // to avoid schema relationship errors in Supabase joins
  if (meetings && meetings.length > 0) {
    const studentIds = [...new Set(meetings.map(m => m.student_id))];
    const supervisorIds = [...new Set(meetings.map(m => m.supervisor_id))];

    const [{ data: scholars }, { data: supervisors }] = await Promise.all([
      supabase.from("students").select("id, student_name, register_number").in("id", studentIds),
      supabase.from("supervisors").select("id, name").in("id", supervisorIds)
    ]);

    return meetings.map(meeting => ({
      ...meeting,
      scholar: scholars?.find(s => s.id === meeting.student_id),
      supervisor: supervisors?.find(sup => sup.id === meeting.supervisor_id)
    }));
  }

  return meetings;
};