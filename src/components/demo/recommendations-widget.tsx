"use client";

import { useEffect } from "react";
import { trackRecommendationEvent } from "@/server/recommendations";
import { runOncePerSession } from "@/lib/session-once";
import type { RecommendationProduct } from "@/server/recommendations";

export function RecommendationsWidget({
  storeId,
  products,
}: {
  storeId: string;
  products: RecommendationProduct[];
}) {
  useEffect(() => {
    if (products.length > 0) {
      runOncePerSession(`rec-impression:${storeId}`, () => {
        trackRecommendationEvent({ storeId, eventType: "impression" }).catch(() => {});
      });
    }
  }, [storeId, products.length]);

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-500 dark:border-zinc-700">
        No recommendations configured yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="font-semibold">You may also like</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {products.map((p) => (
          <a
            key={p.id}
            href={p.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackRecommendationEvent({ storeId, eventType: "click", productId: p.id }).catch(() => {})}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt={p.name} className="h-12 w-12 rounded object-cover" />
            ) : (
              <div className="h-12 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{p.name}</p>
              {p.description && <p className="truncate text-xs text-zinc-500">{p.description}</p>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}