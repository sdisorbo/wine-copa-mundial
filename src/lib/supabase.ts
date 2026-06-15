import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when Supabase credentials are present. */
export const supabaseEnabled = Boolean(url && anonKey);

/**
 * Shared browser client. Null until env vars are set, so the app builds and
 * renders (showing a "voting not configured" notice) without credentials.
 */
export const supabase: SupabaseClient | null = supabaseEnabled
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: false },
    })
  : null;
