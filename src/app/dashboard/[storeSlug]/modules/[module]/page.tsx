export const instant = false;

import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { getStoreBySlug } from "@/server/stores";
import { getWheelSettings } from "@/server/wheel";
import { getCountdownSettings } from "@/server/countdown";
import { WheelSettingsForm } from "@/components/dashboard/wheel-settings-form";
import { CountdownSettingsForm } from "@/components/dashboard/countdown-settings-form";
import { StoreAnalyticsSection } from "@/components/dashboard/store-analytics-section";
import { StoreRecommendationsSection } from "@/components/dashboard/store-recommendations-section";

const MODULES = ["wheel", "countdown", "analytics", "recommendations"] as const;
type ModuleKey = (typeof MODULES)[number];

export default async function ModuleSettingsPage({
  params,
}: {
  params: Promise<{ storeSlug: string; module: string }>;
}) {
  await connection();

  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Module settings</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Supabase is not configured.</p>
      </div>
    );
  }

  const { storeSlug, module } = await params;
  if (!MODULES.includes(module as ModuleKey)) notFound();

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const moduleKey = module as ModuleKey;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <Link href="/dashboard/modules" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
          ← Back to modules
        </Link>
        <h1 className="mt-2 text-2xl font-semibold capitalize">{moduleKey} settings</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Store: {store.name} ({store.slug})
        </p>
      </div>

      {moduleKey === "wheel" && <WheelSettingsSection storeId={store.id} />}
      {moduleKey === "countdown" && <CountdownSettingsSection storeId={store.id} />}
      {moduleKey === "analytics" && (
        <StoreAnalyticsSection store={{ id: store.id, name: store.name }} />
      )}
      {moduleKey === "recommendations" && (
        <StoreRecommendationsSection store={{ id: store.id, name: store.name }} />
      )}
    </div>
  );
}

async function WheelSettingsSection({ storeId }: { storeId: string }) {
  const settings = await getWheelSettings(storeId);
  return (
    <WheelSettingsForm
      storeId={storeId}
      initialConfig={settings.config}
      initialStatus={settings.status}
    />
  );
}

async function CountdownSettingsSection({ storeId }: { storeId: string }) {
  const settings = await getCountdownSettings(storeId);
  return (
    <CountdownSettingsForm
      storeId={storeId}
      initialConfig={settings.config}
      initialStatus={settings.status}
    />
  );
}