import { NextResponse } from "next/server";
import { hashApiKey } from "@/lib/api-key";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ storeId: string }> }) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "API service is not configured." }, { status: 503 });
  }

  const auth = request.headers.get("authorization") ?? "";
  const key = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!key.startsWith("lsk_")) {
    return NextResponse.json({ error: "Missing or invalid API key." }, { status: 401 });
  }

  const { storeId } = await params;

  const { data: apiKey } = await supabase
    .from("api_keys")
    .select("id, store_id, revoked_at")
    .eq("key_hash", hashApiKey(key))
    .eq("store_id", storeId)
    .maybeSingle();

  if (!apiKey || apiKey.revoked_at) {
    return NextResponse.json({ error: "Invalid API key." }, { status: 401 });
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_id, status, current_period_end")
    .eq("store_id", storeId)
    .maybeSingle();

  const enterprise =
    subscription?.plan_id === "enterprise" &&
    (subscription.status === "active" || subscription.status === "trialing") &&
    (!subscription.current_period_end || new Date(subscription.current_period_end) > new Date());

  if (!enterprise) {
    return NextResponse.json({ error: "API access requires the Enterprise plan." }, { status: 403 });
  }

  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", apiKey.id);

  const count = async (eventType?: string) => {
    let query = supabase
      .from("analytics_events")
      .select("id", { count: "exact", head: true })
      .eq("store_id", storeId);
    if (eventType) query = query.eq("event_type", eventType);
    const { count: value } = await query;
    return value ?? 0;
  };

  const [impressions, spins, coupons, redemptions] = await Promise.all([
    count("widget_impression"),
    count("wheel_spin"),
    supabase
      .from("coupons")
      .select("id", { count: "exact", head: true })
      .eq("store_id", storeId)
      .then((r) => r.count ?? 0),
    supabase
      .from("coupon_redemptions")
      .select("id", { count: "exact", head: true })
      .eq("store_id", storeId)
      .then((r) => r.count ?? 0),
  ]);

  return NextResponse.json({
    storeId,
    metrics: { impressions, spins, coupons, redemptions },
    generatedAt: new Date().toISOString(),
  });
}