import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PLANS, type PlanId } from "@/server/entitlements";

export function subscriptionsEnforced(): boolean {
  return process.env.SUBSCRIPTIONS_ENFORCED === "true";
}

export async function getStorePlan(storeId: string): Promise<PlanId> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("plan_id, status, current_period_end")
    .eq("store_id", storeId)
    .maybeSingle();

  if (!data) return "starter";
  if (data.status !== "active" && data.status !== "trialing") return "starter";
  if (data.current_period_end && new Date(data.current_period_end) < new Date()) return "starter";
  return (data.plan_id as PlanId) ?? "starter";
}

export async function canCreateStore(userId: string): Promise<{ allowed: boolean; plan: PlanId }> {
  const supabase = await createSupabaseServerClient();
  const { data: stores } = await supabase.from("stores").select("id").eq("owner_id", userId);
  const ids = (stores ?? []).map((s) => s.id);
  const { count } = await supabase
    .from("stores")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", userId);

  let plan: PlanId = "starter";
  if (ids.length > 0) {
    const { data: subscriptions } = await supabase
      .from("subscriptions")
      .select("plan_id, status, current_period_end")
      .in("store_id", ids);

    const active = (subscriptions ?? []).find(
      (s) => (s.status === "active" || s.status === "trialing") &&
        (!s.current_period_end || new Date(s.current_period_end) > new Date()),
    );
    if (active) plan = active.plan_id as PlanId;
  }

  return { allowed: (count ?? 0) < PLANS[plan].limits.stores, plan };
}

export async function canCreateCampaign(storeId: string): Promise<{ allowed: boolean; plan: PlanId }> {
  const supabase = await createSupabaseServerClient();
  const plan = await getStorePlan(storeId);
  const { count } = await supabase
    .from("campaigns")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId);

  return { allowed: (count ?? 0) < PLANS[plan].limits.campaignsPerStore, plan };
}