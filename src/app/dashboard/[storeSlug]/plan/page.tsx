export const instant = false;

import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { getStoreBySlug } from "@/server/stores";
import { getStoreUsage } from "@/server/subscriptions";
import { PLAN_LABELS } from "@/server/entitlements";

export default async function PlanPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Plan</h1>
        <p className="mt-4 text-sm text-zinc-400">Supabase yapılandırılmamış.</p>
      </div>
    );
  }

  const { storeSlug } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const usage = await getStoreUsage(store.id);
  const unlimited = 1_000_000;

  const bars = [
    { label: "Projeler", used: usage.stores, limit: usage.limits.stores },
    { label: "Kampanyalar", used: usage.campaigns, limit: usage.limits.campaignsPerStore },
    { label: "Aylık etkileşim", used: usage.interactions, limit: usage.limits.monthlyWidgetEvents },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link href={`/dashboard/${store.slug}/modules/wheel`} className="text-sm text-zinc-400 hover:text-white">
        ← Modüllere dön
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-white">Plan ve kullanım</h1>
      <p className="mt-1 text-sm text-zinc-400">
        {store.name} — aktif plan: <span className="font-semibold text-indigo-300">{PLAN_LABELS[usage.plan]}</span>
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {bars.map((bar) => {
          const max = bar.limit >= unlimited ? bar.used || 1 : bar.limit;
          const pct = Math.min(100, Math.round((bar.used / max) * 100));
          return (
            <div key={bar.label} className="surface rounded-2xl p-5">
              <p className="text-xs text-zinc-500">{bar.label}</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {bar.used}
                <span className="text-sm font-normal text-zinc-500">
                  {" / "}
                  {bar.limit >= unlimited ? "sınırsız" : bar.limit}
                </span>
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                  style={{ width: `${bar.limit >= unlimited ? 8 : pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="surface mt-6 rounded-2xl p-5">
        <h2 className="font-semibold text-white">Planınızı yükseltin</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Ödeme altyapısı hazırlanıyor. Şimdilik plan yükseltmek için bizimle iletişime geçin.
        </p>
        <a
          href="mailto:eg3h1t@gmail.com?subject=lassyy%20plan%20y%C3%BCkseltme"
          className="accent-gradient glow-button mt-4 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white"
        >
          İletişime geç
        </a>
      </div>
    </div>
  );
}