const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

console.log("KEY TYPE CHECK:");

console.log("KEY START:", process.env.SUPABASE_KEY?.slice(0, 20));

module.exports = supabase;``