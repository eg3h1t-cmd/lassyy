import { listCountdownCampaigns } from "@/server/countdown";

const statusLabels: Record<string, string> = {
  draft: "Taslak",
  active: "Etkin",
  paused: "Duraklatıldı",
  archived: "Arşivlendi",
};

export async function StoreCountdownList({ store }: { store: { id: string; name: string } }) {
  const campaigns = await listCountdownCampaigns(store.id);
  return (
    <div>
      <h3 className="font-medium text-zinc-900">{store.name}</h3>
      {campaigns.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">Kampanya yok.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {campaigns.map((c) => (
            <li key={c.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
              <span className="font-medium text-zinc-900">{c.name}</span>{" "}
              <span className="text-zinc-500">
                ({statusLabels[c.status] ?? c.status}) — bitiş:{" "}
                {c.ends_at ? new Date(c.ends_at).toLocaleString("tr-TR") : "—"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}