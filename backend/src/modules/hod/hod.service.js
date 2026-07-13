import supabaseAdmin from "../../config/supabaseAdmin.js";
import { createUserClient } from "../../utils/supabaseUser.js";
import { sendCredentials } from "../../utils/mailer.js";
import crypto from "crypto";

const generatePassword = () => crypto.randomInt(1000000, 9999999).toString();

// --------------------------------------------------
// CREATE SUPERVISOR
// --------------------------------------------------
export const createSupervisor = async (body) => {
  const { name, email, mobile } = body;
  const password = generatePassword();

  // 1. Create auth user
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) throw new Error(`Auth Error: ${authError.message}`);
  const userId = authData.user.id;

  try {
    // 2. Insert profile (Use upsert to prevent trigger conflicts)
    const { error: pErr } = await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        name,
        email,
        role: "supervisor",
      },
      { onConflict: "id" },
    );

    if (pErr) throw new Error(`Profile Error: ${pErr.message}`);

    // 3. Insert into supervisors table - THIS IS THE PART FAILNG
    const { error: sErr } = await supabaseAdmin.from("supervisors").insert({
      id: userId,
      name,
      email,
      mobile: mobile || null,
    });

    if (sErr) throw new Error(`Supervisor Table Error: ${sErr.message}`);

    // 4. Send credentials
    // We pass 'email' twice because for supervisors, Login and Delivery are the same
    await sendCredentials(email, name, password, "supervisor", email);

    return { userId, password, email };
  } catch (dbError) {
    // If the error happened AFTER auth, we cleanup
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw new Error(dbError.message);
  }
};

// --------------------------------------------------
// CREATE STUDENT
// --------------------------------------------------
export const createStudent = async (body) => {
  const password = generatePassword();
  const loginEmail = body.university_email;

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email: loginEmail,
      password,
      email_confirm: true,
    });

  if (userError) throw new Error(`Auth Error: ${userError.message}`);
  const userId = userData.user.id;

  try {
    await supabaseAdmin.from("profiles").upsert(
      {
        id: userId,
        name: body.name,
        email: loginEmail,
        role: "student",
      },
      { onConflict: "id" },
    );

    await supabaseAdmin.from("students").insert({
      id: userId,
      register_number: body.register_number,
      university_email: body.university_email,
      personal_email: body.personal_email,
      discipline: body.discipline,
      batch_id: body.batch_id || null,
      student_name: body.name,
      campus: body.campus,
    });

    // Send to PERSONAL email so they can log in with UNI email
    sendCredentials(
      body.personal_email,
      body.name,
      password,
      "student",
      body.university_email,
    );

    return { userId, password };
  } catch (dbError) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    throw new Error(`DB Error: ${dbError.message}`);
  }
};

// --------------------------------------------------
// BULK OPERATIONS
// --------------------------------------------------
export const bulkCreateStudents = async (students) => {
  const results = [];
  for (const student of students) {
    try {
      const res = await createStudent(student);
      results.push({ success: true, email: student.personal_email, data: res });
    } catch (err) {
      results.push({
        success: false,
        email: student.personal_email,
        error: err.message,
      });
    }
  }
  return results;
};

export const bulkCreateSupervisors = async (supervisors) => {
  const results = [];
  for (const sup of supervisors) {
    try {
      const res = await createSupervisor(sup);
      results.push({ success: true, email: sup.email, data: res });
    } catch (err) {
      results.push({ success: false, email: sup.email, error: err.message });
    }
  }
  return results;
};

// --------------------------------------------------
// ASSIGNMENT & FETCHING
// --------------------------------------------------
export const assignSupervisor = async (token, body) => {
  const supabase = createUserClient(token);
  await supabase
    .from("student_supervisor_map")
    .update({ is_active: false, removed_at: new Date() })
    .eq("student_id", body.student_id)
    .eq("is_active", true);

  const { data, error } = await supabase
    .from("student_supervisor_map")
    .insert({ ...body, is_active: true })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export const fetchUsers = async (token, role) => {
  const supabase = createUserClient(token);
  if (role === "student") {
    const { data, error } = await supabase
      .from("students")
      .select(
        "*, profiles(name, email), batches(name), student_supervisor_map(is_active, supervisors(name)), rah_meetings(*)",
      );
    if (error) throw new Error(error.message);
    return data;
  }
  const { data, error } = await supabase.from("supervisors").select("*");
  if (error) throw new Error(error.message);
  return data;
};

// --------------------------------------------------
// BATCH MANAGEMENT
// --------------------------------------------------
export const createBatch = async (body) => {
  const { data, error } = await supabaseAdmin
    .from("batches")
    .insert(body)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const fetchBatches = async () => {
  const { data, error } = await supabaseAdmin
    .from("batches")
    .select("*")
    .order("year", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

export const getSystemConfig = async () => {
  const { data, error } = await supabaseAdmin.from("system_config").select("*");

  if (error) throw new Error(error.message);

  // Convert array to a clean object: { version: '1.0', motd: '...' }
  return data.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
};

export const fetchMeetingHistory = async () => {
  // 🛡️ ADMIN_OVERRIDE: Use supabaseAdmin to bypass RLS for HOD audit transparency
  const { data: meetings, error } = await supabaseAdmin
    .from("rah_meetings")
    .select("*")
    .order("meeting_date", { ascending: false });

  if (error) throw new Error(error.message);

  if (meetings && meetings.length > 0) {
    const studentIds = [...new Set(meetings.map((m) => m.student_id))];
    const supervisorIds = [...new Set(meetings.map((m) => m.supervisor_id))];

    // Resolve identities across registries
    const [{ data: scholars }, { data: supervisors }] = await Promise.all([
      supabaseAdmin
        .from("students")
        .select("id, student_name, register_number")
        .in("id", studentIds),
      supabaseAdmin.from("supervisors").select("id, name").in("id", supervisorIds),
    ]);

    return meetings.map((meeting) => ({
      ...meeting,
      scholar: scholars?.find((s) => s.id === meeting.student_id),
      supervisor: supervisors?.find((sup) => sup.id === meeting.supervisor_id),
    }));
  }

  return meetings;
};
