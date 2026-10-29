import { NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { verifyWhatsAppSignature, verifyWhatsAppWebhook } from "@/server/whatsapp/client";

export async function GET(request: Request) {
  const challenge = verifyWhatsAppWebhook(new URL(request.url).searchParams);
  if (!challenge) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return new Response(challenge, { status: 200 });
}

type MetaWebhook = {
  entry?: Array<{
    changes?: Array<{
      value?: {
        statuses?: Array<{
          id?: string;
          status?: string;
          errors?: Array<{ message?: string }>;
        }>;
      };
    }>;
  }>;
};

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!verifyWhatsAppSignature(rawBody, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const supabase = createSupabaseServiceClient();
  if (!supabase) return NextResponse.json({ ok: true });

  const json = JSON.parse(rawBody) as MetaWebhook;
  const statuses = json.entry?.flatMap((entry) =>
    (entry.changes ?? []).flatMap((change) => change.value?.statuses ?? []),
  ) ?? [];

  for (const status of statuses) {
    if (!status.id || !status.status) continue;
    const mapped =
      status.status === "delivered" || status.status === "read" || status.status === "failed"
        ? status.status
        : status.status === "sent"
          ? "sent"
          : null;
    if (!mapped) continue;

    await supabase
      .from("whatsapp_messages")
      .update({
        status: mapped,
        error: status.errors?.[0]?.message ?? null,
      })
      .eq("provider_message_id", status.id);
  }

  return NextResponse.json({ received: true });
}