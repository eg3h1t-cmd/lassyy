"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWhatsAppConfig } from "@/server/whatsapp/client";

export type WhatsAppModule = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
};

export async function getWhatsAppOverview(storeId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: modules } = await supabase
    .from("modules")
    .select("id, slug, name, description, price")
    .eq("channel", "whatsapp")
    .order("price", { ascending: true });

  const { data: purchases } = await supabase
    .from("tenant_modules")
    .select("module_id, status, purchased_at")
    .eq("tenant_id", storeId);

  const { data: connection } = await supabase
    .from("whatsapp_connections")
    .select("provider, phone_number, business_account_id, status, connected_at")
    .eq("store_id", storeId)
    .maybeSingle();

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const statuses = ["queued", "sent", "delivered", "read", "failed"] as const;

  const counts = await Promise.all(
    statuses.map(async (status) => {
      const { count } = await supabase
        .from("whatsapp_messages")
        .select("id", { count: "exact", head: true })
        .eq("store_id", storeId)
        .eq("status", status)
        .gte("created_at", since);
      return [status, count ?? 0] as const;
    }),
  );

  const { data: recent } = await supabase
    .from("whatsapp_messages")
    .select("id, recipient_phone, template_key, status, created_at, error")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    modules: (modules ?? []) as WhatsAppModule[],
    purchases: purchases ?? [],
    connection: connection ?? null,
    apiConfigured: getWhatsAppConfig().success,
    counts: Object.fromEntries(counts) as Record<(typeof statuses)[number], number>,
    recent: recent ?? [],
  };
}