"use client";

import { useEffect, useState } from "react";
import { trackCountdownImpressionAction } from "@/server/countdown";
import { runOncePerSession } from "@/lib/session-once";

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
    runOncePerSession(`countdown-impression:${campaignId}`, () => {
      trackCountdownImpressionAction(campaignId).catch(() => {});
    });
  }, [campaignId]);

  useEffect(() => {
    function update() {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Süresi doldu");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${d}g ${h}sa ${m}dk ${s}sn`);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const expired = remaining === "Süresi doldu";

  return (
    <div className="surface rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-zinc-600">{description}</p>}
      <div className={`mt-4 text-3xl font-mono font-semibold ${expired ? "text-red-400" : "text-zinc-900"}`}>
        {remaining}
      </div>
      {expired && <p className="mt-2 text-sm text-zinc-500">Bu kampanya sona erdi.</p>}
    </div>
  );
}