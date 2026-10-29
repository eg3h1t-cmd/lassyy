"use client";

import { useState } from "react";
import { setWheelCampaignStatusAction } from "@/server/wheel";

export function CampaignStatusButton({
  campaignId,
  currentStatus,
}: {
  campaignId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    const next = status === "active" ? "paused" : "active";
    setLoading(true);
    setError(null);
    const result = await setWheelCampaignStatusAction({ campaignId, status: next });
    if (result.ok) setStatus(next);
    else setError(result.error);
    setLoading(false);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-zinc-500">{status}</span>
      <button
        onClick={toggle}
        disabled={loading}
        className="rounded-md border border-zinc-300 px-2 py-1 text-xs font-medium hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        {loading ? "..." : status === "active" ? "Pause" : "Activate"}
      </button>
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </span>
  );
}