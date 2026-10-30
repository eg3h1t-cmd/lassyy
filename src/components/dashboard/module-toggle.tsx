"use client";

import { useState } from "react";
import { setModuleEnabledAction } from "@/server/modules";

export function ModuleToggle({
  storeId,
  moduleId,
  initialEnabled,
}: {
  storeId: string;
  moduleId: string;
  initialEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const next = !enabled;
    const result = await setModuleEnabledAction({ storeId, moduleId, enabled: next });
    if (result.ok) setEnabled(next);
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        enabled
          ? "bg-emerald-400/10 text-emerald-700 ring-1 ring-emerald-400/20"
          : "bg-white/5 text-zinc-600 ring-1 ring-white/10"
      }`}
    >
      {loading ? "..." : enabled ? "Etkin" : "Devre Dışı"}
    </button>
  );
}