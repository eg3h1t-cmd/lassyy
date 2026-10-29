"use client";

import { useState } from "react";
import type { SizeAssistantConfig } from "@/lib/validations/size-assistant";

export function SizeAssistantWidget({ config }: { config: SizeAssistantConfig }) {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<string | null>(null);

  function recommend() {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w) return;
    const match = config.sizes.find(
      (s) => h >= s.minHeight && h <= s.maxHeight && w >= s.minWeight && w <= s.maxWeight,
    );
    setResult(match?.label ?? "Size en yakın beden için bize ulaşın.");
  }

  return (
    <div className="surface rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white">{config.title}</h3>
      {config.description && <p className="mt-1 text-sm text-zinc-400">{config.description}</p>}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-zinc-400">
          Boy (cm)
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/50"
            placeholder="175"
          />
        </label>
        <label className="text-xs text-zinc-400">
          Kilo (kg)
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-indigo-400/50"
            placeholder="70"
          />
        </label>
      </div>
      <button
        onClick={recommend}
        className="accent-gradient glow-button mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-white"
      >
        Bedenimi öner
      </button>
      {result && (
        <p className="mt-3 rounded-xl border border-indigo-400/20 bg-indigo-400/[0.06] p-3 text-sm text-indigo-100">
          Önerilen beden: <span className="font-semibold text-white">{result}</span>
        </p>
      )}
    </div>
  );
}