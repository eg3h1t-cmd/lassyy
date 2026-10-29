// Client-safe Supabase configuration.
// Direct static references to NEXT_PUBLIC_* variables are required so Next.js
// can inline them into the browser bundle. Do not replace these with a dynamic
// process.env lookup or the values will be missing in the browser.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabasePublicConfig() {
  return { url: supabaseUrl, anonKey: supabaseAnonKey };
}

export function hasSupabasePublicConfig(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}