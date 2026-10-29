-- Ala-carte module store: one-time module purchases per store (no subscriptions).
-- Existing `modules` table is extended with slug/price; new catalog rows are seeded.

alter table public.modules add column if not exists slug text;
alter table public.modules add column if not exists price numeric(10,2) not null default 0;

update public.modules set slug = id where slug is null;

alter table public.modules alter column slug set not null;

create unique index if not exists modules_slug_key on public.modules(slug);

-- Allow underscores in module ids (e.g. sans_carki).
alter table public.modules drop constraint if exists modules_id_check;
alter table public.modules add constraint modules_id_check
  check (id ~ '^[a-z0-9_-]{3,60}$');

insert into public.modules (id, slug, name, price, description)
values
  ('sans_carki', 'sans_carki', 'Şans Çarkı', 1750.00, 'Sunucu taraflı kupon korumalı ödül çarkı.'),
  ('wp_sepet_hatirlatma', 'wp_sepet_hatirlatma', 'WhatsApp Sepet Hatırlatma', 1250.00, 'Terk edilen sepetler için WhatsApp hatırlatma mesajları.'),
  ('wp_kampanya_toplu', 'wp_kampanya_toplu', 'WhatsApp Kampanya Toplu Bildirim', 1250.00, 'Kampanya duyurularını WhatsApp üzerinden toplu gönderin.'),
  ('wp_kargo_takip', 'wp_kargo_takip', 'WhatsApp Kargo Takip', 1250.00, 'Kargo durum güncellemelerini WhatsApp ile iletin.'),
  ('akilli_beden', 'akilli_beden', 'Akıllı Beden Asistanı', 2250.00, 'Müşterilere doğru bedeni öneren akıllı asistan.')
on conflict (id) do update
set slug = excluded.slug,
    name = excluded.name,
    price = excluded.price,
    description = excluded.description;

create table if not exists public.tenant_modules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.stores(id) on delete cascade,
  module_id text not null references public.modules(id) on delete restrict,
  status text not null default 'pending' check (status in ('pending','active','refunded')),
  purchased_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, module_id)
);

create index if not exists tenant_modules_tenant_id_idx on public.tenant_modules(tenant_id);
create index if not exists tenant_modules_module_id_idx on public.tenant_modules(module_id);

drop trigger if exists tenant_modules_set_updated_at on public.tenant_modules;
create trigger tenant_modules_set_updated_at
before update on public.tenant_modules
for each row execute function public.set_updated_at();

alter table public.tenant_modules enable row level security;

-- Members can see what the store owns.
drop policy if exists tenant_modules_select_member on public.tenant_modules;
create policy tenant_modules_select_member on public.tenant_modules
  for select using (public.is_store_member(tenant_id, auth.uid()));

-- Owners can create a pending purchase intent. Activation is service-role only
-- (payment webhook / manual admin action), never trusted from the browser.
drop policy if exists tenant_modules_insert_pending_owner on public.tenant_modules;
create policy tenant_modules_insert_pending_owner on public.tenant_modules
  for insert with check (
    status = 'pending'
    and public.is_store_owner(tenant_id, auth.uid())
  );
