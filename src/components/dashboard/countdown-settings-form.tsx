"use client";

import { useState } from "react";
import { saveCountdownSettingsAction } from "@/server/countdown";
import type { CountdownConfig } from "@/lib/validations/countdown";

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function CountdownSettingsForm({
  storeId,
  initialConfig,
  initialStatus,
}: {
  storeId: string;
  initialConfig: CountdownConfig;
  initialStatus: string;
}) {
  const [title, setTitle] = useState(initialConfig.title);
  const [description, setDescription] = useState(initialConfig.description ?? "");
  const [endsAt, setEndsAt] = useState(toLocalInput(initialConfig.endsAt));
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    setMessage(null);
    setLoading(true);
    try {
      const result = await saveCountdownSettingsAction({
        storeId,
        config: {
          title,
          description,
          endsAt: new Date(endsAt).toISOString(),
          startsAt: initialConfig.startsAt ?? null,
        },
        status,
      });
      setMessage(result.ok ? "Countdown settings saved." : result.error);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="font-medium">Campaign title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
        <label className="text-sm">
          <span className="font-medium">End date & time</span>
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium">Banner text</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
        />
      </label>

      <label className="block max-w-xs text-sm">
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

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Saving..." : "Save countdown settings"}
        </button>
        {message && <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
      </div>
    </div>
  );
}