import { createClient } from "@supabase/supabase-js";
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SUPER_KEY) {
  console.error("CRITICAL: Supabase environment variables are missing!");
}

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SUPER_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default supabaseAdmin;