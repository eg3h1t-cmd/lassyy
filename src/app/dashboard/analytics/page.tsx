export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { StoreAnalyticsSection } from "@/components/dashboard/store-analytics-section";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Analitik</h1>
        <p className="mt-4 text-sm text-zinc-400">Supabase yapılandırılmamış.</p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const stores = await listMyStores();
  const { days: daysParam } = await searchParams;
  const days = [7, 30, 90].includes(Number(daysParam)) ? Number(daysParam) : 30;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Analitik</h1>
          <p className="mt-2 text-sm text-zinc-400">Metrikler kayıtlı olaylardan hesaplanır.</p>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm">
          {[7, 30, 90].map((d) => (
            <Link
              key={d}
              href={`/dashboard/analytics?days=${d}`}
              className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                days === d ? "bg-white text-zinc-900" : "text-zinc-400 hover:text-white"
              }`}
            >
              {d} gün
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {stores.length === 0 && (
          <p className="text-sm text-zinc-400">Önce bir mağaza oluşturun.</p>
        )}
        {stores.map((store) => (
          <StoreAnalyticsSection key={store.id} store={store} days={days} />
        ))}
      </div>
    </div>
  );
}