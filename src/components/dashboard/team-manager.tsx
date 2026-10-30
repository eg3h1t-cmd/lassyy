"use client";

import { useState } from "react";
import { addTeamMemberAction, removeTeamMemberAction, type TeamMember } from "@/server/team";

export function TeamManager({ storeId, initial }: { storeId: string; initial: TeamMember[] }) {
  const [members, setMembers] = useState(initial);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function add() {
    setMessage(null);
    setLoading(true);
    const result = await addTeamMemberAction({ storeId, email });
    if (result.ok) {
      setMessage("Ekip üyesi eklendi. Sayfayı yenileyerek listeyi güncelleyin.");
      setEmail("");
    } else {
      setMessage(result.error);
    }
    setLoading(false);
  }

  async function remove(userId: string) {
    const result = await removeTeamMemberAction({ storeId, userId });
    if (result.ok) setMembers((prev) => prev.filter((m) => m.user_id !== userId));
    else setMessage(result.error);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="kullanici@ornek.com"
          className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-500 focus:border-indigo-400/50"
        />
        <button
          onClick={add}
          disabled={loading}
          className="accent-gradient glow-button rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Ekleniyor..." : "Ekip üyesi ekle"}
        </button>
      </div>
      {message && <p className="text-sm text-zinc-600">{message}</p>}

      <ul className="divide-y divide-zinc-200">
        {members.map((member) => (
          <li key={member.user_id} className="flex items-center justify-between py-3 text-sm">
            <div>
              <p className="text-zinc-200">{member.email}</p>
              <p className="text-xs text-zinc-500">{member.role === "owner" ? "Mağaza sahibi" : "Ekip üyesi"}</p>
            </div>
            {member.role !== "owner" && (
              <button onClick={() => remove(member.user_id)} className="text-xs text-red-400 hover:text-red-600">
                Kaldır
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}