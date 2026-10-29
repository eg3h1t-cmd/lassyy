import { listWheelCampaigns } from "@/server/wheel";
import { CampaignStatusButton } from "@/components/dashboard/campaign-status-button";

export async function StoreCampaignList({ store }: { store: { id: string; name: string } }) {
  const campaigns = await listWheelCampaigns(store.id);
  return (
    <div>
      <h3 className="font-medium text-white">{store.name}</h3>
      {campaigns.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">Kampanya yok.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {campaigns.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-sm"
            >
              <span className="font-medium">{c.name}</span>
              <CampaignStatusButton campaignId={c.id} currentStatus={c.status} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}