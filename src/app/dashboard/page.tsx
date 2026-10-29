export const instant = false;
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseConfig } from "@/lib/env";
import { listMyStores } from "@/server/stores";
import { StoreCreateForm } from "@/components/dashboard/store-create-form";

export default async function DashboardPage() {
  await connection();
  if (!hasSupabaseConfig()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
          Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY to enable authentication and data.
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
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Signed in as {user.email}.
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Create a store</h2>
        <StoreCreateForm />
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Your stores</h2>
        {stores.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            No stores yet. Create one above.
          </p>
        ) : (
          <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <li
                key={store.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="font-semibold">{store.name}</p>
                <p className="mt-1 text-xs text-zinc-500">{store.slug}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

