"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getStoreAnalytics(storeId: string) {
  const supabase = await createSupabaseServerClient();
  const { count: impressions } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId)
    .eq("event_type", "widget_impression");
  const { count: spins } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId)
    .eq("event_type", "wheel_spin");
  const { count: coupons } = await supabase
    .from("coupons")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId);
  const { count: redemptions } = await supabase
    .from("coupon_redemptions")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId);
  const { count: recImpressions } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId)
    .eq("event_type", "recommendation_impression");
  const { count: recClicks } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true })
    .eq("store_id", storeId)
    .eq("event_type", "recommendation_click");

  return {
    impressions: impressions ?? 0,
    spins: spins ?? 0,
    coupons: coupons ?? 0,
    redemptions: redemptions ?? 0,
    recommendationImpressions: recImpressions ?? 0,
    recommendationClicks: recClicks ?? 0,
  };
}