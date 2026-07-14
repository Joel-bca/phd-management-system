import { createClient } from "@supabase/supabase-js";

const getEnv = (...keys) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
};

const createMissingSupabaseClient = (label) => {
  const throwError = (message) => {
    throw new Error(message);
  };

  const queryBuilder = {
    select: () => queryBuilder,
    eq: () => queryBuilder,
    in: () => queryBuilder,
    maybeSingle: async () => {
      throwError(`Supabase ${label} client is not configured. Set SUPABASE_URL and a service role key in Vercel env.`);
    },
    insert: async () => {
      throwError(`Supabase ${label} client is not configured. Set SUPABASE_URL and a service role key in Vercel env.`);
    },
    update: () => queryBuilder,
    delete: () => queryBuilder,
  };

  return {
    auth: {
      signInWithPassword: async () => {
        throwError(`Supabase ${label} client is not configured. Set SUPABASE_URL and a service role key in Vercel env.`);
      },
      getUser: async () => {
        throwError(`Supabase ${label} client is not configured. Set SUPABASE_URL and a service role key in Vercel env.`);
      },
      admin: {
        createUser: async () => {
          throwError(`Supabase ${label} client is not configured. Set SUPABASE_URL and a service role key in Vercel env.`);
        },
        deleteUser: async () => {
          throwError(`Supabase ${label} client is not configured. Set SUPABASE_URL and a service role key in Vercel env.`);
        },
      },
    },
    from: () => queryBuilder,
  };
};

const supabaseUrl = getEnv("SUPABASE_URL", "VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");
const supabaseServiceKey = getEnv(
  "SUPABASE_SUPER_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SERVICE_KEY",
  "SUPABASE_KEY"
);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase environment variables are missing. Login and database routes will fail until they are set in Vercel env.");
}

const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : createMissingSupabaseClient("admin");

export default supabaseAdmin;