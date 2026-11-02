// client.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types.ts";
import dotenv from "dotenv";

// Setup dotenv to access .env variables.
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables.");
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseKey,
);
