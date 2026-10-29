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
import { SizeAssistantSettings } from "@/components/dashboard/size-assistant-settings";
import { hasModuleAccess } from "@/server/module-access";
import { getSizeAssistantConfig } from "@/server/size-assistant";

const MODULES = ["wheel", "countdown", "analytics", "recommendations", "akilli_beden"] as const;
type ModuleKey = (typeof MODULES)[number];

const moduleTitles: Record<ModuleKey, string> = {
  wheel: "Çarkıfelek İndirimi Ayarları",
  countdown: "Geri Sayım Kampanyası Ayarları",
  analytics: "Analitik",
  recommendations: "Ürün Önerileri",
  akilli_beden: "Akıllı Beden Asistanı Ayarları",
};

const accessSlugs: Record<ModuleKey, string> = {
  wheel: "sans_carki",
  countdown: "geri_sayim_kampanyalari",
  analytics: "analitik",
  recommendations: "urun_onerileri",
  akilli_beden: "akilli_beden",
};

export default async function ModuleSettingsPage({
  params,
}: {
  params: Promise<{ storeSlug: string; module: string }>;
}) {
  await connection();

  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Modül ayarları</h1>
        <p className="mt-4 text-sm text-zinc-400">Supabase yapılandırılmamış.</p>
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
  const allowed = await hasModuleAccess(store.id, accessSlugs[moduleKey]);

  if (!allowed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <Link href={`/dashboard/${store.slug}/store`} className="text-sm text-zinc-400 hover:text-white">
          ← Modül mağazası
        </Link>
        <div className="surface mt-4 rounded-2xl p-6">
          <h1 className="text-2xl font-semibold text-white">Bu modül henüz aktif değil</h1>
          <p className="mt-2 text-sm text-zinc-400">
            {moduleTitles[moduleKey]} modülünü kullanmak için satın almanız ve ödemenin onaylanması gerekiyor.
          </p>
          <Link
            href={`/dashboard/${store.slug}/store`}
            className="accent-gradient glow-button mt-5 inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white"
          >
            Modül mağazasına git
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <Link href="/dashboard/modules" className="text-sm text-zinc-400 transition-colors hover:text-white">
          ← Modüllere dön
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-white">{moduleTitles[moduleKey]}</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Mağaza: {store.name} ({store.slug})
        </p>
      </div>

      {moduleKey === "wheel" && <WheelSettingsSection storeId={store.id} />}
      {moduleKey === "countdown" && <CountdownSettingsSection storeId={store.id} />}
      {moduleKey === "analytics" && (
        <StoreAnalyticsSection store={{ id: store.id, name: store.name, slug: store.slug }} />
      )}
      {moduleKey === "recommendations" && (
        <StoreRecommendationsSection store={{ id: store.id, name: store.name }} />
      )}
      {moduleKey === "akilli_beden" && <SizeAssistantSection storeId={store.id} />}
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

async function SizeAssistantSection({ storeId }: { storeId: string }) {
  const config = await getSizeAssistantConfig(storeId);
  return <SizeAssistantSettings storeId={storeId} initialConfig={config} />;
}