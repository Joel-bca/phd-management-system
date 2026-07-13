import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SUPER_KEY
);

async function check() {
  console.log("Fetching profiles...");
  const { data, error } = await supabase.from('profiles').select('*').limit(3);
  console.log("Data:", data);
  console.log("Error:", error);
}

check();
