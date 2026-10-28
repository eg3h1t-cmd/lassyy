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
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
          : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
      }`}
    >
      {loading ? "..." : enabled ? "Enabled" : "Disabled"}
    </button>
  );
}