import { getActiveWheelCampaign } from "@/server/wheel";
import { WheelWidget } from "@/components/demo/wheel-widget";
import { getRecommendationConfig } from "@/server/recommendations";
import { RecommendationsWidget } from "@/components/demo/recommendations-widget";
import { getActiveCountdowns } from "@/server/countdown";
import { CountdownWidget } from "@/components/demo/countdown-widget";

export async function StoreDemoSection({ store }: { store: { id: string; name: string } }) {
  const wheelCampaign = await getActiveWheelCampaign(store.id);
  const countdowns = await getActiveCountdowns(store.id);
  const products = await getRecommendationConfig(store.id);

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold">{store.name}</h2>

      {wheelCampaign ? (
        <WheelWidget
          campaignId={wheelCampaign.id}
          title={(wheelCampaign.config as { title: string }).title}
          segments={(wheelCampaign.config as { segments: { id: string; label: string; color: string }[] }).segments}
        />
      ) : (
        <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
          No active spin wheel campaign. Create or activate one in the dashboard.
        </p>
      )}

      {countdowns.map((c) => (
        <CountdownWidget
          key={c.id}
          title={(c.config as { title: string }).title}
          description={(c.config as { description?: string }).description}
          endsAt={c.ends_at as string}
        />
      ))}

      <RecommendationsWidget storeId={store.id} products={products} />
    </section>
  );
}
