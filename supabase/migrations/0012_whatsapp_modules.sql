-- WhatsApp-first module catalog, connections, messages, abandoned carts and shipments.
-- No subscriptions/plans. Each module is a one-time purchase via tenant_modules.

alter table public.modules add column if not exists channel text not null default 'web';

update public.modules set channel = 'whatsapp'
where id in ('wp_sepet_hatirlatma','wp_kampanya_toplu','wp_kargo_takip');

insert into public.modules (id, slug, name, price, description, channel)
values
  ('wp_sepet_hatirlatma', 'wp_sepet_hatirlatma', 'WhatsApp Sepet Hatırlatma', 1250.00, 'Terk edilen sepetler için WhatsApp hatırlatma mesajları.', 'whatsapp'),
  ('wp_kampanya_toplu', 'wp_kampanya_toplu', 'WhatsApp Kampanya Toplu Bildirim', 1250.00, 'Kampanya duyurularını WhatsApp üzerinden toplu gönderin.', 'whatsapp'),
  ('wp_kargo_takip', 'wp_kargo_takip', 'WhatsApp Kargo Takip', 1250.00, 'Kargo durum güncellemelerini WhatsApp ile iletin.', 'whatsapp')
on conflict (id) do update
set slug = excluded.slug,
    name = excluded.name,
    price = excluded.price,
    description = excluded.description,
    channel = excluded.channel;

create table if not exists public.whatsapp_connections (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null unique references public.stores(id) on delete cascade,
  provider text not null default 'meta_cloud' check (provider in ('meta_cloud','twilio','360dialog')),
  phone_number text,
  business_account_id text,
  status text not null default 'disconnected' check (status in ('disconnected','connected','error')),
  connected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists whatsapp_connections_set_updated_at on public.whatsapp_connections;
create trigger whatsapp_connections_set_updated_at
before update on public.whatsapp_connections
for each row execute function public.set_updated_at();

create table if not exists public.whatsapp_messages (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  module_id text not null references public.modules(id) on delete restrict,
  recipient_phone text not null,
  template_key text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued' check (status in ('queued','sending','sent','delivered','read','failed')),
  provider_message_id text,
  error text,
  attempts integer not null default 0,
  last_attempt_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists whatsapp_messages_store_created_idx on public.whatsapp_messages(store_id, created_at desc);
create index if not exists whatsapp_messages_queue_idx on public.whatsapp_messages(status, created_at);

create table if not exists public.abandoned_carts (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  cart_id text not null,
  customer_phone text not null,
  customer_name text,
  cart_value numeric(10,2) not null default 0,
  items jsonb not null default '[]'::jsonb,
  consent boolean not null default false,
  status text not null default 'open' check (status in ('open','reminded','recovered','expired')),
  abandoned_at timestamptz not null default now(),
  reminder_sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (store_id, cart_id)
);

create index if not exists abandoned_carts_pending_idx on public.abandoned_carts(store_id, status, abandoned_at);

create table if not exists public.shipment_events (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  order_id text not null,
  tracking_number text,
  carrier text,
  status text not null,
  recipient_phone text,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists shipment_events_store_idx on public.shipment_events(store_id, created_at desc);

alter table public.whatsapp_connections enable row level security;
alter table public.whatsapp_messages enable row level security;
alter table public.abandoned_carts enable row level security;
alter table public.shipment_events enable row level security;

drop policy if exists whatsapp_connections_select_member on public.whatsapp_connections;
create policy whatsapp_connections_select_member on public.whatsapp_connections
  for select using (public.is_store_member(store_id, auth.uid()));

drop policy if exists whatsapp_connections_write_owner on public.whatsapp_connections;
create policy whatsapp_connections_write_owner on public.whatsapp_connections
  for all using (public.is_store_owner(store_id, auth.uid()))
  with check (public.is_store_owner(store_id, auth.uid()));

drop policy if exists whatsapp_messages_select_member on public.whatsapp_messages;
create policy whatsapp_messages_select_member on public.whatsapp_messages
  for select using (public.is_store_member(store_id, auth.uid()));

drop policy if exists abandoned_carts_select_member on public.abandoned_carts;
create policy abandoned_carts_select_member on public.abandoned_carts
  for select using (public.is_store_member(store_id, auth.uid()));

drop policy if exists shipment_events_select_member on public.shipment_events;
create policy shipment_events_select_member on public.shipment_events
  for select using (public.is_store_member(store_id, auth.uid()));

-- Inserts/updates for messages, carts and shipment events are service-role only
-- (webhooks, cron workers, payment activation). No browser write policies.