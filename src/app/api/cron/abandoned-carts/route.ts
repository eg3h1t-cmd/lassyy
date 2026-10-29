import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { hasModuleAccessService } from "@/server/module-access";
import { enqueueWhatsAppMessage } from "@/server/whatsapp/queue";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${secret}` || request.headers.get("x-cron-secret") === secret;
}

export async function GET(request: Request) {
  return POST(request);
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Service not configured" }, { status: 503 });

  const delayMinutes = Number(process.env.ABANDONED_CART_DELAY_MINUTES ?? 60);
  const threshold = new Date(Date.now() - delayMinutes * 60 * 1000).toISOString();

  const { data: carts } = await supabase
    .from("abandoned_carts")
    .select("id, store_id, customer_phone, cart_id, cart_value")
    .eq("status", "open")
    .eq("consent", true)
    .is("reminder_sent_at", null)
    .lte("abandoned_at", threshold)
    .limit(50);

  let queued = 0;
  for (const cart of carts ?? []) {
    const active = await hasModuleAccessService(cart.store_id, "wp_sepet_hatirlatma");
    if (!active) continue;

    const result = await enqueueWhatsAppMessage({
      storeId: cart.store_id,
      moduleId: "wp_sepet_hatirlatma",
      phone: cart.customer_phone,
      templateKey: "sepet_hatirlatma",
      payload: {
        templateName: process.env.WHATSAPP_TEMPLATE_CART ?? "sepet_hatirlatma",
        languageCode: "tr",
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: cart.cart_id },
              { type: "text", text: String(cart.cart_value) },
            ],
          },
        ],
      },
    });

    if (result.ok) {
      queued += 1;
      await supabase
        .from("abandoned_carts")
        .update({ status: "reminded", reminder_sent_at: new Date().toISOString() })
        .eq("id", cart.id);
    }
  }

  return NextResponse.json({ ok: true, queued, checked: carts?.length ?? 0 });
}