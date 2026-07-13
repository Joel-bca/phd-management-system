import { createClient } from "@supabase/supabase-js";

export const createUserClient = (token) => {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
};