export const instant = false;

import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { getStoreBySlug } from "@/server/stores";
import { getStorePlan } from "@/server/subscriptions";
import { listTeamMembers } from "@/server/team";
import { TeamManager } from "@/components/dashboard/team-manager";

export default async function TeamPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Ekip</h1>
        <p className="mt-4 text-sm text-zinc-400">Supabase yapılandırılmamış.</p>
      </div>
    );
  }

  const { storeSlug } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const plan = await getStorePlan(store.id);
  const allowed = plan === "enterprise";
  const members = allowed ? await listTeamMembers(store.id) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/dashboard/${store.slug}/modules/wheel`} className="text-sm text-zinc-400 hover:text-white">
        ← Modüllere dön
      </Link>
      <h1 className="mt-2 text-2xl font-semibold text-white">Ekip yönetimi</h1>
      <p className="mt-1 text-sm text-zinc-400">{store.name}</p>

      {allowed ? (
        <div className="surface mt-8 rounded-2xl p-5">
          <TeamManager storeId={store.id} initial={members} />
        </div>
      ) : (
        <div className="surface mt-8 rounded-2xl p-6">
          <h2 className="font-semibold text-white">Çoklu takım üyeleri Kurumsal plana dahildir</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Ekip üyesi eklemek için planınızı yükseltin. Şimdilik bizimle iletişime geçebilirsiniz.
          </p>
          <a
            href="mailto:eg3h1t@gmail.com?subject=lassyy%20Kurumsal%20plan"
            className="accent-gradient glow-button mt-4 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white"
          >
            İletişime geç
          </a>
        </div>
      )}
    </div>
  );
}