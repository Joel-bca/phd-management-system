import { createUserClient } from "../../utils/supabaseUser.js";

export const getMyStudents = async (token, supervisorId) => {
  const supabase = createUserClient(token);

  // We query the mapping table and join with student and profile info
  const { data, error } = await supabase
    .from("student_supervisor_map")
    .select(
      `
      is_active,
      students (
        id,
        register_number,
        research_interests,
        proposed_title,
        university_email,
        mobile,
        batches (name),
        profiles (
          name,
          email
        ),
        rah_meetings (*)
      )
    `,
    )
    .eq("supervisor_id", supervisorId)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  // Clean up the nested structure for the frontend
  return data.map((item) => ({
    ...item.students,
    profiles: item.students.profiles,
  }));
};
