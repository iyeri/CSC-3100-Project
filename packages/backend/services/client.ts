// client.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types.ts";
import dotenv from "dotenv";

// Setup dotenv to access .env variables.
dotenv.config();

// Helper function to require an environment variable. Prevents VSCode squiggles...
function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const url = requireEnv("SUPABASE_URL");
const publishableKey = requireEnv("SUPABASE_PUBLISHABLE_KEY");
const secretKey = requireEnv("SUPABASE_SECRET_KEY");

const serverAuthOptions = {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
};

// Create an anonymous client.
// This is used only for explicitly public/anonymous requests.
export const anonymousSupabase = createClient<Database>(
  url,
  publishableKey,
  { auth: serverAuthOptions },
);

// Create a new client for each incoming authenticated request.
export function createAuthenticatedSupabase(accessToken: string) {
  return createClient<Database>(url, publishableKey, {
    auth: serverAuthOptions,
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

// Never export this to the frontend!! This bypasses Supabase's RLS.
export const adminSupabase = createClient<Database>(
  url,
  secretKey,
  { auth: serverAuthOptions },
);