import { getActiveWheelCampaign } from "@/server/wheel";
import { WheelWidget } from "@/components/demo/wheel-widget";
import { getRecommendationConfig } from "@/server/recommendations";
import { RecommendationsWidget } from "@/components/demo/recommendations-widget";
import { getActiveCountdowns } from "@/server/countdown";
import { CountdownWidget } from "@/components/demo/countdown-widget";
import { hasModuleAccess } from "@/server/module-access";
import { getSizeAssistantConfig } from "@/server/size-assistant";
import { SizeAssistantWidget } from "@/components/demo/size-assistant-widget";

export async function StoreDemoSection({ store }: { store: { id: string; name: string } }) {
  const [wheelAllowed, countdownAllowed, recommendationsAllowed, sizeAllowed] = await Promise.all([
    hasModuleAccess(store.id, "sans_carki"),
    hasModuleAccess(store.id, "geri_sayim_kampanyalari"),
    hasModuleAccess(store.id, "urun_onerileri"),
    hasModuleAccess(store.id, "akilli_beden"),
  ]);

  const wheelCampaign = wheelAllowed ? await getActiveWheelCampaign(store.id) : null;
  const countdowns = countdownAllowed ? await getActiveCountdowns(store.id) : [];
  const products = recommendationsAllowed ? await getRecommendationConfig(store.id) : [];
  const sizeConfig = sizeAllowed ? await getSizeAssistantConfig(store.id) : null;

  const hasAny = wheelCampaign || countdowns.length > 0 || products.length > 0 || sizeConfig;

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-white">{store.name}</h2>

      {!hasAny && (
        <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-zinc-500">
          Bu mağaza için henüz aktif modül yok. Modül mağazasından satın alıp yapılandırın.
        </p>
      )}

      {wheelCampaign && (
        <WheelWidget
          campaignId={wheelCampaign.id}
          title={(wheelCampaign.config as { title: string }).title}
          segments={(wheelCampaign.config as { segments: { id: string; label: string; color: string }[] }).segments}
        />
      )}

      {countdowns.map((c) => (
        <CountdownWidget
          key={c.id}
          campaignId={c.id}
          title={(c.config as { title: string }).title}
          description={(c.config as { description?: string }).description}
          endsAt={c.ends_at as string}
        />
      ))}

      {recommendationsAllowed && <RecommendationsWidget storeId={store.id} products={products} />}

      {sizeConfig && <SizeAssistantWidget config={sizeConfig} />}
    </section>
  );
}