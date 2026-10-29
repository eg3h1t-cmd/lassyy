"use client";

import { useState } from "react";
import { setWheelCampaignStatusAction } from "@/server/wheel";

const statusLabels: Record<string, string> = {
  draft: "Taslak",
  active: "Etkin",
  paused: "Duraklatıldı",
  archived: "Arşivlendi",
};

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
      <span className="text-xs text-zinc-500">{statusLabels[status] ?? status}</span>
      <button
        onClick={toggle}
        disabled={loading}
        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-xs font-medium text-zinc-200 transition-colors hover:border-indigo-400/40 hover:bg-white/[0.06] disabled:opacity-50"
      >
        {loading ? "..." : status === "active" ? "Duraklat" : "Etkinleştir"}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </span>
  );
}