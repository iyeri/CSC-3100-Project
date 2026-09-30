// client.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types.ts";
import dotenv from "dotenv";

// Setup dotenv to access .env variables.
dotenv.config();

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY,
);
