import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * Returns true only when the current authenticated user can access the tenant
 * and the tenant has an active one-time purchase for the module slug.
 *
 * RLS on tenant_modules/store_members prevents cross-tenant reads. Never accept
 * tenant_id or module ownership from the browser without this check.
 */
export async function hasModuleAccess(tenantId: string, moduleSlug: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from("tenant_modules")
    .select("id, modules!inner(slug)")
    .eq("tenant_id", tenantId)
    .eq("status", "active")
    .eq("modules.slug", moduleSlug)
    .maybeSingle();

  if (error) return false;
  return Boolean(data);
}

/** Service-role check for webhooks/cron. Never call this from browser code. */
export async function hasModuleAccessService(tenantId: string, moduleSlug: string): Promise<boolean> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return false;
  const { data, error } = await supabase
    .from("tenant_modules")
    .select("id, modules!inner(slug)")
    .eq("tenant_id", tenantId)
    .eq("status", "active")
    .eq("modules.slug", moduleSlug)
    .maybeSingle();
  if (error) return false;
  return Boolean(data);
}