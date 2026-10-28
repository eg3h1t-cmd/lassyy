import { getActiveWheelCampaign } from "@/server/wheel";
import { WheelWidget } from "@/components/demo/wheel-widget";

export async function StoreDemoSection({ store }: { store: { id: string; name: string } }) {
  const campaign = await getActiveWheelCampaign(store.id);
  if (!campaign) return null;
  const config = campaign.config as {
    title: string;
    segments: { id: string; label: string; color: string }[];
  };
  return (
    <section>
      <h2 className="text-lg font-semibold">{store.name}</h2>
      <div className="mt-4 max-w-md">
        <WheelWidget campaignId={campaign.id} title={config.title} segments={config.segments} />
      </div>
    </section>
  );
}