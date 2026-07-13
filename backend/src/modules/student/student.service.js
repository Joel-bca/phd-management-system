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
