-- Subscription and payment-event tables for future iyzico/Stripe integration.
-- Writes are service-role only. Browser clients can read their store subscription.

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null unique references public.stores(id) on delete cascade,
  provider text not null default 'iyzico' check (provider in ('iyzico','stripe','manual')),
  provider_subscription_id text,
  plan_id text not null default 'starter' check (plan_id in ('starter','growth','enterprise')),
  status text not null default 'incomplete' check (status in ('active','trialing','past_due','canceled','incomplete')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_store_id_idx on public.subscriptions(store_id);

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'iyzico' check (provider in ('iyzico','stripe','manual')),
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (provider, provider_event_id)
);

create index if not exists payment_events_provider_idx on public.payment_events(provider, created_at desc);

alter table public.subscriptions enable row level security;
alter table public.payment_events enable row level security;

-- Store members may read their subscription; all writes go through verified server logic.
create policy subscriptions_select_member on public.subscriptions
  for select using (public.is_store_member(store_id, auth.uid()));

-- payment_events deliberately has no browser policies; service role bypasses RLS.