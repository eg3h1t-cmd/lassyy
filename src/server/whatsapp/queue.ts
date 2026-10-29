import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { sendWhatsAppTemplate } from "@/server/whatsapp/client";

export async function enqueueWhatsAppMessage(input: {
  storeId: string;
  moduleId: string;
  phone: string;
  templateKey: string;
  payload?: Record<string, unknown>;
}) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { ok: false as const, error: "service_role_not_configured" };

  const { data, error } = await supabase
    .from("whatsapp_messages")
    .insert({
      store_id: input.storeId,
      module_id: input.moduleId,
      recipient_phone: input.phone,
      template_key: input.templateKey,
      payload: input.payload ?? {},
      status: "queued",
    })
    .select("id")
    .single();

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, messageId: data.id };
}

export async function processWhatsAppQueue(limit = 25) {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return { processed: 0, sent: 0, failed: 0 };

  const { data: messages } = await supabase
    .from("whatsapp_messages")
    .select("id, store_id, recipient_phone, template_key, payload, attempts")
    .eq("status", "queued")
    .order("created_at", { ascending: true })
    .limit(limit);

  let sent = 0;
  let failed = 0;

  for (const message of messages ?? []) {
    const payload = (message.payload ?? {}) as {
      templateName?: string;
      languageCode?: string;
      components?: unknown[];
    };

    const result = await sendWhatsAppTemplate({
      to: message.recipient_phone,
      templateName: payload.templateName ?? message.template_key,
      languageCode: payload.languageCode ?? "tr",
      components: payload.components,
    });

    if (result.ok) {
      sent += 1;
      await supabase
        .from("whatsapp_messages")
        .update({
          status: "sent",
          provider_message_id: result.messageId,
          sent_at: new Date().toISOString(),
          last_attempt_at: new Date().toISOString(),
          attempts: (message.attempts ?? 0) + 1,
          error: null,
        })
        .eq("id", message.id);
    } else {
      failed += 1;
      const attempts = (message.attempts ?? 0) + 1;
      await supabase
        .from("whatsapp_messages")
        .update({
          status: attempts >= 3 ? "failed" : "queued",
          attempts,
          last_attempt_at: new Date().toISOString(),
          error: result.error,
        })
        .eq("id", message.id);
    }
  }

  return { processed: messages?.length ?? 0, sent, failed };
}