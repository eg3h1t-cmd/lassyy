import { NextResponse } from "next/server";
import { processWhatsAppQueue } from "@/server/whatsapp/queue";

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (
    request.headers.get("authorization") === `Bearer ${secret}` ||
    request.headers.get("x-cron-secret") === secret
  );
}

export async function GET(request: Request) {
  return POST(request);
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await processWhatsAppQueue(25);
  return NextResponse.json({ ok: true, ...result });
}