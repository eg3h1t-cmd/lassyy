"use client";

import { useEffect, useState } from "react";
import { spinWheelAction, trackWheelImpressionAction } from "@/server/wheel";
import { runOncePerSession } from "@/lib/session-once";

type Segment = { id: string; label: string; color: string };

export function WheelWidget({
  campaignId,
  title,
  segments,
}: {
  campaignId: string;
  title: string;
  segments: Segment[];
}) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{
    label: string;
    couponCode: string | null;
    expiresAt: string | null;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runOncePerSession(`wheel-impression:${campaignId}`, () => {
      trackWheelImpressionAction(campaignId).catch(() => {});
    });
  }, [campaignId]);

  const slice = 360 / segments.length;

  async function spin() {
    if (spinning) return;
    setSpinning(true);
    setError(null);
    setResult(null);
    try {
      const res = await spinWheelAction(campaignId);
      if (!res.ok) {
        setError(res.error);
        setSpinning(false);
        return;
      }
      const idx = segments.findIndex((s) => s.id === res.segmentId);
      const targetIndex = idx >= 0 ? idx : 0;
      const extraSpins = 5 * 360;
      const targetRotation = extraSpins + (360 - targetIndex * slice - slice / 2);
      setRotation((prev) => prev + targetRotation);
      setTimeout(() => {
        setResult({
          label: res.label,
          couponCode: res.couponCode,
          expiresAt: res.expiresAt,
        });
        setSpinning(false);
      }, 4200);
    } catch {
      setError("Çark çevrilemedi. Lütfen tekrar deneyin.");
      setSpinning(false);
    }
  }

  const gradient = segments
    .map((s, i) => `${s.color} ${i * slice}deg ${(i + 1) * slice}deg`)
    .join(", ");

  return (
    <div className="surface rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
      <div className="mt-4 flex flex-col items-center gap-4">
        <div
          className="relative h-64 w-64 rounded-full border-4 border-zinc-200 shadow-[0_0_60px_-20px_rgba(129,140,248,0.6)] transition-transform duration-[4200ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)`, background: `conic-gradient(${gradient})` }}
        >
          {segments.map((s, i) => (
            <span
              key={s.id}
              className="absolute left-1/2 top-1/2 text-xs font-medium text-zinc-900 drop-shadow"
              style={{
                transform: `rotate(${i * slice + slice / 2}deg) translate(0, -90px) rotate(-${i * slice + slice / 2}deg)`,
                transformOrigin: "center",
              }}
            >
              {s.label}
            </span>
          ))}
        </div>
        <div className="h-0 w-0 border-l-8 border-r-8 border-t-12 border-l-transparent border-r-transparent border-t-white" />
        <button
          onClick={spin}
          disabled={spinning}
          className="accent-gradient glow-button rounded-xl px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {spinning ? "Dönüyor..." : "Çevir"}
        </button>
      </div>
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      {result && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm">
          <p className="font-medium text-emerald-700">Sonuç: {result.label}</p>
          {result.couponCode && (
            <>
              <p className="mt-1 text-zinc-200">
                Kupon kodu: <span className="font-mono font-semibold text-zinc-900">{result.couponCode}</span>
              </p>
              {result.expiresAt && (
                <p className="mt-1 text-xs text-zinc-500">
                  Son kullanma: {new Date(result.expiresAt).toLocaleString("tr-TR")}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}