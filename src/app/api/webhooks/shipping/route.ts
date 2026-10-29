import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { hasModuleAccessService } from "@/server/module-access";
import { enqueueWhatsAppMessage } from "@/server/whatsapp/queue";

const bodySchema = z.object({
  storeId: z.string().uuid(),
  orderId: z.string().min(1),
  status: z.string().min(1),
  phone: z.string().min(5),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
});

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (!process.env.SHIPPING_WEBHOOK_SECRET || secret !== process.env.SHIPPING_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Service not configured" }, { status: 503 });

  const { storeId, orderId, status, phone, trackingNumber, carrier } = parsed.data;

  if (!(await hasModuleAccessService(storeId, "wp_kargo_takip"))) {
    return NextResponse.json({ error: "Module not active" }, { status: 403 });
  }

  const { error: eventError } = await supabase.from("shipment_events").insert({
    store_id: storeId,
    order_id: orderId,
    tracking_number: trackingNumber ?? null,
    carrier: carrier ?? null,
    status,
    recipient_phone: phone,
    payload: json as Record<string, unknown>,
    processed_at: new Date().toISOString(),
  });

  if (eventError) return NextResponse.json({ error: "Could not store event" }, { status: 500 });

  const queued = await enqueueWhatsAppMessage({
    storeId,
    moduleId: "wp_kargo_takip",
    phone,
    templateKey: "kargo_takip",
    payload: {
      templateName: process.env.WHATSAPP_TEMPLATE_SHIPPING ?? "kargo_takip",
      languageCode: "tr",
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: orderId },
            { type: "text", text: status },
            { type: "text", text: trackingNumber ?? "-" },
          ],
        },
      ],
    },
  });

  if (!queued.ok) return NextResponse.json({ error: "Could not queue message" }, { status: 500 });
  return NextResponse.json({ ok: true, queued: true }, { status: 202 });
}