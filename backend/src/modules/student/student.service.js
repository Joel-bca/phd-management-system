import supabaseAdmin from "../../config/supabaseClient.js"; //

export const getStudentFullProfile = async (studentId) => {
  // Fetch detailed student data, joined with profile and supervisor mapping
  const { data, error } = await supabaseAdmin
    .from("students")
    .select(
      `
      *,
      profiles (name, email),
      student_supervisor_map (
        is_active,
        supervisors (
          id,
          name,
          profiles (email)
        )
      ),
      rah_meetings (*)
    `,
    )
    .eq("id", studentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Student profile data not found in the registry.");
  return data;
};

export const updateStudentContact = async (
  userId,
  { personal_email, mobile },
) => {
  const { data, error } = await supabaseAdmin
    .from("students")
    .update({ personal_email, mobile })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ---------------------------------------------------------------------
// RAC Meeting Minutes / Progress Review
// ---------------------------------------------------------------------

// Fetch a single meeting with everything needed to auto-fill the
// Minutes form: scholar info, supervisor, both RAC members, and any
// minutes draft/submission that already exists.
// Scoped to studentId so a scholar can only ever pull their own meetings.
export const getMeetingForMinutes = async (meetingId, studentId) => {
  const { data, error } = await supabaseAdmin
    .from("rah_meetings")
    .select(
      `
      id,
      meeting_number,
      meeting_date,
      meeting_location,
      meeting_mode,
      meeting_subject,
      status,
      student_id,
      students (
        register_number,
        profiles ( name )
      ),
      supervisor:supervisors!rah_meetings_supervisor_id_fkey ( id, name ),
      rac_member_1:supervisors!rah_meetings_rac_member_1_fkey ( id, name ),
      rac_member_2:supervisors!rah_meetings_rac_member_2_fkey ( id, name ),
      rah_meeting_minutes ( * )
    `,
    )
    .eq("id", meetingId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Meeting not found or access denied.");
  return data;
};

// Confirms the meeting belongs to this student. Used by both
// saveMeetingMinutesDraft and submitMeetingMinutes to keep ownership
// checks in one place.
const assertOwnsMeeting = async (meetingId, studentId) => {
  const { data, error } = await supabaseAdmin
    .from("rah_meetings")
    .select("id, student_id")
    .eq("id", meetingId)
    .eq("student_id", studentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error("Meeting not found or access denied.");
  return data;
};

// Create or update the student's draft. Blocked once minutes have
// already been submitted (status moves past 'draft').
export const saveMeetingMinutesDraft = async (meetingId, studentId, payload) => {
  await assertOwnsMeeting(meetingId, studentId);

  const { data: existing, error: existingErr } = await supabaseAdmin
    .from("rah_meeting_minutes")
    .select("id, status")
    .eq("meeting_id", meetingId)
    .maybeSingle();

  if (existingErr) throw new Error(existingErr.message);
  if (existing && existing.status !== "draft") {
    throw new Error(
      "Minutes have already been submitted and can no longer be edited.",
    );
  }

  const { members_present, points_discussed, decisions_reached } = payload;

  const { data, error } = await supabaseAdmin
    .from("rah_meeting_minutes")
    .upsert(
      {
        meeting_id: meetingId,
        members_present,
        points_discussed,
        decisions_reached,
        status: "draft",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "meeting_id" },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Locks the draft in as submitted. Requires all three fields to be
// filled and the record to currently be in 'draft'.
export const submitMeetingMinutes = async (meetingId, studentId) => {
  await assertOwnsMeeting(meetingId, studentId);

  const { data: existing, error: existingErr } = await supabaseAdmin
    .from("rah_meeting_minutes")
    .select("id, status, members_present, points_discussed, decisions_reached")
    .eq("meeting_id", meetingId)
    .maybeSingle();

  if (existingErr) throw new Error(existingErr.message);
  if (!existing) throw new Error("Save a draft before submitting.");
  if (existing.status !== "draft") throw new Error("Minutes already submitted.");
  if (
    !existing.members_present?.trim() ||
    !existing.points_discussed?.trim() ||
    !existing.decisions_reached?.trim()
  ) {
    throw new Error("Please fill in all fields before submitting.");
  }

  const { data, error } = await supabaseAdmin
    .from("rah_meeting_minutes")
    .update({ status: "submitted", submitted_at: new Date().toISOString() })
    .eq("id", existing.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};