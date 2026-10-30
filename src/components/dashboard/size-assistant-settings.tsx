"use client";

import { useState } from "react";
import { saveSizeAssistantConfigAction } from "@/server/size-assistant";
import type { SizeAssistantConfig, SizeRule } from "@/lib/validations/size-assistant";

export function SizeAssistantSettings({
  storeId,
  initialConfig,
}: {
  storeId: string;
  initialConfig: SizeAssistantConfig;
}) {
  const [title, setTitle] = useState(initialConfig.title);
  const [description, setDescription] = useState(initialConfig.description ?? "");
  const [sizes, setSizes] = useState<SizeRule[]>(initialConfig.sizes);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(index: number, patch: Partial<SizeRule>) {
    setSizes((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  async function save() {
    setMessage(null);
    setLoading(true);
    const result = await saveSizeAssistantConfigAction({
      storeId,
      config: { title, description, sizes },
    });
    setMessage(result.ok ? "Beden asistanı ayarları kaydedildi." : result.error);
    setLoading(false);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-medium text-zinc-200">Başlık</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none focus:border-indigo-400/50"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium text-zinc-200">Açıklama</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none focus:border-indigo-400/50"
          />
        </label>
      </div>

      <div className="space-y-3">
        {sizes.map((size, index) => (
          <div key={index} className="rounded-xl border border-zinc-200 bg-zinc-50 p-3">
            <div className="grid gap-3 sm:grid-cols-5">
              <label className="text-xs text-zinc-600">
                Beden
                <input
                  value={size.label}
                  onChange={(e) => update(index, { label: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm text-zinc-900 outline-none focus:border-indigo-400/50"
                />
              </label>
              <label className="text-xs text-zinc-600">
                Min boy (cm)
                <input
                  type="number"
                  value={size.minHeight}
                  onChange={(e) => update(index, { minHeight: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm text-zinc-900 outline-none focus:border-indigo-400/50"
                />
              </label>
              <label className="text-xs text-zinc-600">
                Max boy (cm)
                <input
                  type="number"
                  value={size.maxHeight}
                  onChange={(e) => update(index, { maxHeight: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm text-zinc-900 outline-none focus:border-indigo-400/50"
                />
              </label>
              <label className="text-xs text-zinc-600">
                Min kilo (kg)
                <input
                  type="number"
                  value={size.minWeight}
                  onChange={(e) => update(index, { minWeight: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm text-zinc-900 outline-none focus:border-indigo-400/50"
                />
              </label>
              <label className="text-xs text-zinc-600">
                Max kilo (kg)
                <input
                  type="number"
                  value={size.maxWeight}
                  onChange={(e) => update(index, { maxWeight: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1.5 text-sm text-zinc-900 outline-none focus:border-indigo-400/50"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={loading}
          className="accent-gradient glow-button rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Kaydediliyor..." : "Ayarları kaydet"}
        </button>
        {message && <p className="text-sm text-zinc-600">{message}</p>}
      </div>
    </div>
  );
}