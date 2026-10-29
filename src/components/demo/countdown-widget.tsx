"use client";

import { useEffect, useState } from "react";
import { trackCountdownImpressionAction } from "@/server/countdown";

export function CountdownWidget({
  campaignId,
  title,
  description,
  endsAt,
}: {
  campaignId: string;
  title: string;
  description?: string;
  endsAt: string;
}) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    trackCountdownImpressionAction(campaignId).catch(() => {});
  }, [campaignId]);

  useEffect(() => {
    function update() {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Expired");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${d}d ${h}h ${m}m ${s}s`);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const expired = remaining === "Expired";

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>}
      <div className={`mt-4 text-3xl font-mono font-semibold ${expired ? "text-red-600 dark:text-red-400" : ""}`}>
        {remaining}
      </div>
      {expired && <p className="mt-2 text-sm text-zinc-500">This campaign has ended.</p>}
    </div>
  );
}