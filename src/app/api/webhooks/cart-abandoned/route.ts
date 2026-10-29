import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  storeId: z.string().uuid(),
  cartId: z.string().min(1),
  phone: z.string().min(5),
  customerName: z.string().optional(),
  cartValue: z.number().nonnegative().default(0),
  items: z.array(z.unknown()).default([]),
  consent: z.boolean().default(false),
});

export async function POST(request: Request) {
  const secret = request.headers.get("x-webhook-secret");
  if (!process.env.CART_WEBHOOK_SECRET || secret !== process.env.CART_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Service not configured" }, { status: 503 });

  const { error } = await supabase.from("abandoned_carts").upsert(
    {
      store_id: parsed.data.storeId,
      cart_id: parsed.data.cartId,
      customer_phone: parsed.data.phone,
      customer_name: parsed.data.customerName ?? null,
      cart_value: parsed.data.cartValue,
      items: parsed.data.items,
      consent: parsed.data.consent,
      status: "open",
      abandoned_at: new Date().toISOString(),
    },
    { onConflict: "store_id,cart_id" },
  );

  if (error) return NextResponse.json({ error: "Could not store cart" }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 202 });
}