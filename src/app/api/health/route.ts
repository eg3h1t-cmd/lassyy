import { NextResponse } from "next/server";
import { hasSupabaseConfig } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "lassyy",
    supabaseConfigured: hasSupabaseConfig(),
    timestamp: new Date().toISOString(),
  });
}