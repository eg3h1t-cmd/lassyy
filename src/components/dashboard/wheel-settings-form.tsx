"use client";

import { useState } from "react";
import { saveWheelSettingsAction } from "@/server/wheel";
import type { WheelConfig, WheelSegment } from "@/lib/validations/wheel";

const blankSegment = (): WheelSegment => ({
  id: crypto.randomUUID(),
  label: "New prize",
  color: "#6366f1",
  prizeType: "none",
  weight: 10,
});

export function WheelSettingsForm({
  storeId,
  initialConfig,
  initialStatus,
}: {
  storeId: string;
  initialConfig: WheelConfig;
  initialStatus: string;
}) {
  const [title, setTitle] = useState(initialConfig.title);
  const [description, setDescription] = useState(initialConfig.description ?? "");
  const [segments, setSegments] = useState<WheelSegment[]>(initialConfig.segments);
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateSegment(id: string, patch: Partial<WheelSegment>) {
    setSegments((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function removeSegment(id: string) {
    setSegments((prev) => (prev.length <= 2 ? prev : prev.filter((s) => s.id !== id)));
  }

  async function save() {
    setMessage(null);
    setLoading(true);
    try {
      const result = await saveWheelSettingsAction({
        storeId,
        config: { title, description, segments, spinDurationMs: initialConfig.spinDurationMs ?? 4000 },
        status,
      });
      setMessage(result.ok ? "Wheel settings saved." : result.error);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-medium">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium">Description / promotional copy</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Wheel segments</h3>
          <button
            type="button"
            onClick={() => setSegments((prev) => [...prev, blankSegment()])}
            className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Add segment
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {segments.map((segment) => (
            <div key={segment.id} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                <label className="text-xs sm:col-span-2">
                  Label
                  <input
                    value={segment.label}
                    onChange={(e) => updateSegment(segment.id, { label: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </label>
                <label className="text-xs">
                  Color
                  <input
                    type="color"
                    value={segment.color}
                    onChange={(e) => updateSegment(segment.id, { color: e.target.value })}
                    className="mt-1 h-9 w-full rounded-lg border border-zinc-300 dark:border-zinc-700"
                  />
                </label>
                <label className="text-xs">
                  Prize
                  <select
                    value={segment.prizeType}
                    onChange={(e) => updateSegment(segment.id, { prizeType: e.target.value as WheelSegment["prizeType"] })}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    <option value="coupon">Coupon</option>
                    <option value="none">No prize</option>
                  </select>
                </label>
                <label className="text-xs">
                  Weight
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={segment.weight}
                    onChange={(e) => updateSegment(segment.id, { weight: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeSegment(segment.id)}
                  className="self-end rounded-lg border border-red-200 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                >
                  Remove
                </button>
              </div>

              {segment.prizeType === "coupon" && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs">
                    Discount type
                    <select
                      value={segment.discountType ?? "percentage"}
                      onChange={(e) => updateSegment(segment.id, { discountType: e.target.value as WheelSegment["discountType"] })}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed amount</option>
                    </select>
                  </label>
                  <label className="text-xs">
                    Discount value
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={segment.discountValue ?? 0}
                      onChange={(e) => updateSegment(segment.id, { discountValue: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border border-zinc-300 px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Saving..." : "Save wheel settings"}
        </button>
        {message && <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
      </div>
    </div>
  );
}