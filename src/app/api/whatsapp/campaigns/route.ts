import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasModuleAccess } from "@/server/module-access";
import { enqueueWhatsAppMessage } from "@/server/whatsapp/queue";

const bodySchema = z.object({
  storeId: z.string().uuid(),
  templateName: z.string().min(1),
  languageCode: z.string().default("tr"),
  consentConfirmed: z.literal(true),
  recipients: z
    .array(
      z.object({
        phone: z.string().min(5),
        name: z.string().optional(),
      }),
    )
    .min(1)
    .max(500),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!(await hasModuleAccess(parsed.data.storeId, "wp_kampanya_toplu"))) {
    return NextResponse.json({ error: "Module not active" }, { status: 403 });
  }

  let queued = 0;
  for (const recipient of parsed.data.recipients) {
    const result = await enqueueWhatsAppMessage({
      storeId: parsed.data.storeId,
      moduleId: "wp_kampanya_toplu",
      phone: recipient.phone,
      templateKey: "kampanya_toplu",
      payload: {
        templateName: parsed.data.templateName,
        languageCode: parsed.data.languageCode,
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: recipient.name ?? "Değerli müşterimiz" }],
          },
        ],
      },
    });
    if (result.ok) queued += 1;
  }

  return NextResponse.json({ ok: true, queued, total: parsed.data.recipients.length });
}