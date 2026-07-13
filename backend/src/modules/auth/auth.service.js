import supabaseAdmin from "../../config/supabaseAdmin.js";
import supabase from "../../config/supabaseClient.js";


// helper → log failed attempt
const logFailedAttempt = async (email, ip = null) => {
  try {
    // check if already exists
    const { data: existing } = await supabaseAdmin
      .from("failed_logins")
      .select("attempt_count")
      .eq("email", email)
      .maybeSingle();

    if (!existing) {
      // first attempt
      await supabaseAdmin.from("failed_logins").insert([
        {
          email,
          attempt_count: 1,
          ip_address: ip,
        },
      ]);
    } else {
      // increment attempt
      await supabaseAdmin
        .from("failed_logins")
        .update({
          attempt_count: existing.attempt_count + 1,
          last_attempt_at: new Date(),
          ip_address: ip,
        })
        .eq("email", email);
    }
  } catch (err) {
    console.error("Failed to log login attempt:", err.message);
  }
};

// helper → reset on success
const resetFailedAttempts = async (email) => {
  try {
    await supabaseAdmin
      .from("failed_logins")
      .delete()
      .eq("email", email);
  } catch (err) {
    console.error("Failed to reset login attempts:", err.message);
  }
};

export const login = async (email, password, ip = null) => {
  // 🔐 Try login (using standard client)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // ❌ FAILED LOGIN
  if (error || !data?.user) {
    await logFailedAttempt(email, ip);
    throw new Error("Invalid email or password");
  }

  const user = data.user;

  // ✅ FETCH PROFILE
  console.log("FETCHING PROFILE FOR ID:", user.id);
  let { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role, name, is_hod, is_coordinator")
    .eq("id", user.id)
    .maybeSingle();

  console.log("PROFILE FETCH DATA:", profile);
  console.log("PROFILE FETCH ERROR:", profileError);

  // If not found by ID, try fetching by email (useful if manually added)
  if (!profile && !profileError) {
    const { data: profileByEmail, error: emailError } = await supabaseAdmin
      .from("profiles")
      .select("role, name, is_hod, is_coordinator, id")
      .eq("email", user.email)
      .maybeSingle();
    
    if (profileByEmail && !emailError) {
      profile = profileByEmail;
      
      // Attempt to auto-correct the ID in the profiles table to match Auth UUID
      await supabaseAdmin
        .from("profiles")
        .update({ id: user.id })
        .eq("email", user.email);
    }
  }

  if (profileError) {
    console.error("SUPABASE PROFILE FETCH ERROR:", profileError);
    throw new Error(`Database error: ${profileError.message}`);
  }

  if (!profile) {
    throw new Error("Profile not found in profiles table");
  }

  // ✅ SUCCESS → RESET FAILED LOGS
  await resetFailedAttempts(email);

  return {
    id: user.id,
    email: user.email,
    role: profile.role,
    name: profile.name,
    is_hod: profile.is_hod,
    is_coordinator: profile.is_coordinator,
    token: data.session.access_token,
  };
};