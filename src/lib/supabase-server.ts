import { createClient } from '@supabase/supabase-js';

// Next.js server-side Supabase client
// Uses process.env directly (Next.js loads .env automatically)
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY in environment variables.'
    );
  }

  return createClient(url, key);
}
