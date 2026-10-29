"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStorePlan } from "@/server/subscriptions";

export async function getStoreAnalytics(storeId: string, days = 30) {
  const supabase = await createSupabaseServerClient();
  const plan = await getStorePlan(storeId);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const countEvents = async (eventType?: string) => {
    let q = supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("store_id", storeId)
      .gte("created_at", since);
    if (eventType) q = q.eq("event_type", eventType);
    const { count } = await q;
    return count ?? 0;
  };

  const [impressions, spins, recImpressions, recClicks, coupons, redemptions] = await Promise.all([
    countEvents("widget_impression"),
    countEvents("wheel_spin"),
    countEvents("recommendation_impression"),
    countEvents("recommendation_click"),
    supabase
      .from("coupons")
      .select("id", { count: "exact", head: true })
      .eq("store_id", storeId)
      .gte("created_at", since)
      .then((r) => r.count ?? 0),
    supabase
      .from("coupon_redemptions")
      .select("id", { count: "exact", head: true })
      .eq("store_id", storeId)
      .gte("redeemed_at", since)
      .then((r) => r.count ?? 0),
  ]);

  return {
    plan,
    advanced: plan !== "starter",
    impressions,
    spins,
    coupons,
    redemptions,
    recommendationImpressions: recImpressions,
    recommendationClicks: recClicks,
    redemptionRate: coupons > 0 ? Math.round((redemptions / coupons) * 100) : 0,
  };
}