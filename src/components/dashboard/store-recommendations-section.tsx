import { getRecommendationConfig } from "@/server/recommendations";
import { RecommendationsManager } from "@/components/dashboard/recommendations-manager";

export async function StoreRecommendationsSection({ store }: { store: { id: string; name: string } }) {
  const products = await getRecommendationConfig(store.id);
  return (
    <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      <h2 className="font-semibold">{store.name}</h2>
      <div className="mt-4">
        <RecommendationsManager storeId={store.id} initial={products} />
      </div>
    </section>
  );
}