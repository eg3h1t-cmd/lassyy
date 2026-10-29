import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/public-config";

export function createSupabaseBrowserClient() {
  const { url, anonKey } = getSupabasePublicConfig();
  if (!url || !anonKey) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }
  return createBrowserClient(url, anonKey);
}