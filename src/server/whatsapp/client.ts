import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const configSchema = z.object({
  accessToken: z.string().min(1),
  phoneNumberId: z.string().min(1),
  apiVersion: z.string().default("v21.0"),
});

export function getWhatsAppConfig() {
  return configSchema.safeParse({
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    apiVersion: process.env.WHATSAPP_API_VERSION ?? "v21.0",
  });
}

const templateSchema = z.object({
  to: z.string().min(5),
  templateName: z.string().min(1),
  languageCode: z.string().default("tr"),
  components: z.array(z.unknown()).optional(),
});

export type TemplateMessageInput = z.infer<typeof templateSchema>;

export async function sendWhatsAppTemplate(input: TemplateMessageInput) {
  const parsed = templateSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "invalid_input" };

  const config = getWhatsAppConfig();
  if (!config.success) return { ok: false as const, error: "whatsapp_not_configured" };

  const { accessToken, phoneNumberId, apiVersion } = config.data;
  const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: parsed.data.to,
        type: "template",
        template: {
          name: parsed.data.templateName,
          language: { code: parsed.data.languageCode },
          components: parsed.data.components ?? [],
        },
      }),
      cache: "no-store",
    });

    const json = (await res.json()) as {
      messages?: Array<{ id?: string }>;
      error?: { message?: string };
    };

    if (!res.ok) {
      return { ok: false as const, error: json.error?.message ?? `whatsapp_http_${res.status}` };
    }

    return { ok: true as const, messageId: json.messages?.[0]?.id ?? null };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "whatsapp_request_failed" };
  }
}

export function verifyWhatsAppSignature(rawBody: string, signature: string | null) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret || !signature?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(signature.slice(7)));
  } catch {
    return false;
  }
}

export function verifyWhatsAppWebhook(query: URLSearchParams) {
  const mode = query.get("hub.mode");
  const token = query.get("hub.verify_token");
  const challenge = query.get("hub.challenge");
  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return challenge;
  }
  return null;
}