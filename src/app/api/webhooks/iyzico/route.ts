import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  storeId: z.string().uuid(),
  moduleId: z.string().min(1),
  status: z.enum(["success", "paid", "failed", "canceled"]),
  paymentReference: z.string().optional(),
});

export async function POST(request: Request) {
  const secret = request.headers.get("x-iyzico-webhook-secret");
  if (!process.env.IYZICO_WEBHOOK_SECRET || secret !== process.env.IYZICO_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ error: "Service not configured" }, { status: 503 });

  const { storeId, moduleId, status } = parsed.data;

  if (status === "failed" || status === "canceled") {
    // Keep pending; do not activate. Optionally mark refunded later.
    return NextResponse.json({ ok: true, activated: false });
  }

  // Activate: upsert tenant_modules as active.
  const { error } = await supabase.from("tenant_modules").upsert(
    {
      tenant_id: storeId,
      module_id: moduleId,
      status: "active",
      purchased_at: new Date().toISOString(),
    },
    { onConflict: "tenant_id,module_id" },
  );

  if (error) {
    return NextResponse.json({ error: "Could not activate module" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, activated: true });
}