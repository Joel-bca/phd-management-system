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
      throwError(`Supabase ${label} client is not configured. Set SUPABASE_URL and an anon/service key in Vercel env.`);
    },
    insert: async () => {
      throwError(`Supabase ${label} client is not configured. Set SUPABASE_URL and an anon/service key in Vercel env.`);
    },
    update: () => queryBuilder,
    delete: () => queryBuilder,
  };

  return {
    auth: {
      signInWithPassword: async () => {
        throwError(`Supabase ${label} client is not configured. Set SUPABASE_URL and an anon/service key in Vercel env.`);
      },
    },
    from: () => queryBuilder,
  };
};

const supabaseUrl = getEnv("SUPABASE_URL", "VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnv(
  "SUPABASE_KEY",
  "SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SUPER_KEY",
  "SUPABASE_SERVICE_ROLE_KEY"
);

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : createMissingSupabaseClient("client");

export default supabase;
