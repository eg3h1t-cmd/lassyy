export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { StoreCreateForm } from "@/components/dashboard/store-create-form";

export default async function DashboardPage() {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Genel Bakış</h1>
        <p className="mt-4 text-sm text-zinc-400">
          Supabase yapılandırılmamış. Kimlik doğrulama ve veri için NEXT_PUBLIC_SUPABASE_URL
          ve NEXT_PUBLIC_SUPABASE_ANON_KEY değerlerini ayarlayın.
        </p>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const stores = await listMyStores();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-white">Genel Bakış</h1>
      <p className="mt-2 text-sm text-zinc-400">Giriş yapıldı: {user.email}</p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-white">Mağaza oluştur</h2>
        <StoreCreateForm />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">Mağazalarınız</h2>
        {stores.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">Henüz mağaza yok. Yukarıdan bir mağaza oluşturun.</p>
        ) : (
          <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <li key={store.id} className="surface surface-hover rounded-2xl p-5">
                <p className="font-semibold text-white">{store.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{store.slug}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium">
                  <Link
                    href={`/dashboard/${store.slug}/modules/wheel`}
                    className="text-indigo-300 transition-colors hover:text-indigo-200"
                  >
                    Modülleri yapılandır →
                  </Link>
                  <Link
                    href={`/dashboard/${store.slug}/plan`}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    Plan ve kullanım
                  </Link>
                  <Link
                    href={`/dashboard/${store.slug}/team`}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    Ekip
                  </Link>
                  <Link
                    href={`/dashboard/${store.slug}/api`}
                    className="text-zinc-400 transition-colors hover:text-white"
                  >
                    API
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}