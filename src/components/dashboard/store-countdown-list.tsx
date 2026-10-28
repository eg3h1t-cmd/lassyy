import { listCountdownCampaigns } from "@/server/countdown";

export async function StoreCountdownList({ store }: { store: { id: string; name: string } }) {
  const campaigns = await listCountdownCampaigns(store.id);
  return (
    <div>
      <h3 className="font-medium">{store.name}</h3>
      {campaigns.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-500">No campaigns.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {campaigns.map((c) => (
            <li key={c.id} className="rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800">
              <span className="font-medium">{c.name}</span>{" "}
              <span className="text-zinc-500">({c.status}) ends {c.ends_at ? new Date(c.ends_at).toLocaleString() : "—"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}