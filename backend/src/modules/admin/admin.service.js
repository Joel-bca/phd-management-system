import supabaseAdmin from "../../config/supabaseAdmin.js";

// 🔑 Random password generator
const generatePassword = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString();
};

//////////////////////////////////////////////////////
// ADD SUPERVISOR
//////////////////////////////////////////////////////
export const createSupervisorService = async (body) => {
  const { name, email, mobile } = body;

  const password = generatePassword();

  // 1. Create auth user
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) throw new Error(authError.message);

  const userId = authData.user.id;

  // 2. Insert profile
  await supabaseAdmin.from("profiles").insert([
    {
      id: userId,
      name,
      email,
      role: "supervisor",
    },
  ]);

  // 3. Insert supervisor table
  await supabaseAdmin.from("supervisors").insert([
    {
      id: userId,
      name,
      email,
      mobile,
    },
  ]);

  return { message: "Supervisor created", email, password };
};

//////////////////////////////////////////////////////
// ADD STUDENT
//////////////////////////////////////////////////////
export const createStudentService = async (body) => {
  const {
    name,
    email,
    register_number,
    university_email,
    personal_email,
    mobile,
    discipline,
    research_interests,
    proposed_title,
    campus,
    batch_id,
  } = body;

  const password = generatePassword();

  // 1. Create auth
  const { data: authData, error } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (error) throw new Error(error.message);

  const userId = authData.user.id;

  // 2. profile
  await supabaseAdmin.from("profiles").insert([
    {
      id: userId,
      name,
      email,
      role: "student",
    },
  ]);

  // 3. student table
  await supabaseAdmin.from("students").insert([
    {
      id: userId,
      register_number,
      university_email,
      personal_email,
      mobile,
      discipline,
      research_interests,
      proposed_title,
      campus,
      batch_id,
    },
  ]);

  return { message: "Student created", email, password };
};

//////////////////////////////////////////////////////
// ASSIGN SUPERVISOR
//////////////////////////////////////////////////////
export const assignSupervisorService = async ({
  student_id,
  supervisor_id,
}) => {
  // deactivate old
  await supabaseAdmin
    .from("student_supervisor_map")
    .update({ is_active: false, removed_at: new Date() })
    .eq("student_id", student_id)
    .eq("is_active", true);

  // insert new
  await supabaseAdmin.from("student_supervisor_map").insert([
    {
      student_id,
      supervisor_id,
      is_active: true,
    },
  ]);

  return { message: "Supervisor assigned" };
};

//////////////////////////////////////////////////////
// FETCH USERS (FILTER BASED)
//////////////////////////////////////////////////////
export const fetchUsersService = async ({ type }) => {
  if (type === "students") {
    const { data } = await supabaseAdmin
      .from("students")
      .select(`
        *,
        profiles(name, email),
        student_supervisor_map(
          is_active,
          supervisors(name, email)
        )
      `);

    return data;
  }

  if (type === "supervisors") {
    const { data } = await supabaseAdmin
      .from("supervisors")
      .select("*");

    return data;
  }

  throw new Error("Invalid type");
};

//////////////////////////////////////////////////////
// BULK UPLOAD (STUDENTS)
//////////////////////////////////////////////////////
export const bulkStudentService = async (students) => {
  const results = [];

  for (const student of students) {
    try {
      const res = await createStudentService(student);
      results.push({ success: true, ...res });
    } catch (err) {
      results.push({ success: false, error: err.message });
    }
  }

  return results;
};