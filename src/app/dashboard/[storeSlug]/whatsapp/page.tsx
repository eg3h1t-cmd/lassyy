export const instant = false;

import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { getStoreBySlug } from "@/server/stores";
import { getWhatsAppOverview } from "@/server/whatsapp/dashboard";
import { WhatsAppDashboardPanel } from "@/components/dashboard/whatsapp-dashboard-panel";

export default async function WhatsAppPage({ params }: { params: Promise<{ storeSlug: string }> }) {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">WhatsApp</h1>
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

  const overview = await getWhatsAppOverview(store.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link href="/dashboard" className="text-sm text-zinc-400 transition-colors hover:text-white">
        ← Genel bakışa dön
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">WhatsApp Bildirimleri</h1>
          <p className="mt-1 text-sm text-zinc-400">{store.name}</p>
        </div>
      </div>

      <div className="mt-8">
        <WhatsAppDashboardPanel
          storeSlug={store.slug}
          modules={overview.modules}
          purchases={overview.purchases}
          connection={overview.connection}
          apiConfigured={overview.apiConfigured}
          counts={overview.counts}
          recent={overview.recent}
        />
      </div>
    </div>
  );
}