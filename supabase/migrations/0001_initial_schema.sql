-- Initial schema for PromoNest multi-tenant SaaS platform
-- Apply with: supabase db push (or psql) against a fresh Supabase project.

create extension if not exists "pgcrypto";

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- stores
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9-]{3,60}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stores_owner_id_idx on public.stores(owner_id);

create trigger stores_set_updated_at
before update on public.stores
for each row execute function public.set_updated_at();

-- store_members
create table if not exists public.store_members (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner','staff')),
  created_at timestamptz not null default now(),
  unique (store_id, user_id)
);

create index if not exists store_members_store_id_idx on public.store_members(store_id);
create index if not exists store_members_user_id_idx on public.store_members(user_id);

-- modules (platform-level definitions)
create table if not exists public.modules (
  id text primary key check (id ~ '^[a-z0-9-]{3,60}$'),
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

-- store_modules
create table if not exists public.store_modules (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  module_id text not null references public.modules(id) on delete cascade,
  enabled boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, module_id)
);

create index if not exists store_modules_store_id_idx on public.store_modules(store_id);

create trigger store_modules_set_updated_at
before update on public.store_modules
for each row execute function public.set_updated_at();

-- campaigns
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  module_id text references public.modules(id) on delete set null,
  name text not null check (char_length(name) between 1 and 120),
  status text not null default 'draft' check (status in ('draft','active','paused','archived','expired')),
  starts_at timestamptz,
  ends_at timestamptz,
  config jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create index if not exists campaigns_store_id_idx on public.campaigns(store_id);
create index if not exists campaigns_status_idx on public.campaigns(status);

create trigger campaigns_set_updated_at
before update on public.campaigns
for each row execute function public.set_updated_at();

-- coupons
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric not null check (discount_value >= 0),
  status text not null default 'active' check (status in ('active','redeemed','expired','revoked')),
  expires_at timestamptz,
  usage_limit integer not null default 1 check (usage_limit >= 1),
  usage_count integer not null default 0 check (usage_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists coupons_store_id_idx on public.coupons(store_id);
create index if not exists coupons_campaign_id_idx on public.coupons(campaign_id);

create trigger coupons_set_updated_at
before update on public.coupons
for each row execute function public.set_updated_at();

-- coupon_redemptions
create table if not exists public.coupon_redemptions (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references public.coupons(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete cascade,
  customer_email text,
  redeemed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists coupon_redemptions_coupon_id_idx on public.coupon_redemptions(coupon_id);
create index if not exists coupon_redemptions_store_id_idx on public.coupon_redemptions(store_id);

-- analytics_events
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  module_id text references public.modules(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  event_type text not null check (char_length(event_type) between 1 and 80),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_store_id_created_at_idx
  on public.analytics_events(store_id, created_at desc);

-- audit_logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  store_id uuid references public.stores(id) on delete cascade,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_store_id_idx on public.audit_logs(store_id);
create index if not exists audit_logs_actor_id_idx on public.audit_logs(actor_id);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.stores enable row level security;
alter table public.store_members enable row level security;
alter table public.modules enable row level security;
alter table public.store_modules enable row level security;
alter table public.campaigns enable row level security;
alter table public.coupons enable row level security;
alter table public.coupon_redemptions enable row level security;
alter table public.analytics_events enable row level security;
alter table public.audit_logs enable row level security;

-- profiles policies
create policy profiles_select_own on public.profiles
  for select using (auth.uid() = id);
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- helper: is store member
-- stores policies
create policy stores_select_member on public.stores
  for select using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.store_members m
      where m.store_id = stores.id and m.user_id = auth.uid()
    )
  );
create policy stores_insert_owner on public.stores
  for insert with check (owner_id = auth.uid());
create policy stores_update_owner on public.stores
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy stores_delete_owner on public.stores
  for delete using (owner_id = auth.uid());

-- store_members policies
create policy store_members_select on public.store_members
  for select using (
    user_id = auth.uid()
    or exists (select 1 from public.stores s where s.id = store_members.store_id and s.owner_id = auth.uid())
  );
create policy store_members_insert_owner on public.store_members
  for insert with check (
    exists (select 1 from public.stores s where s.id = store_members.store_id and s.owner_id = auth.uid())
  );
create policy store_members_delete_owner on public.store_members
  for delete using (
    exists (select 1 from public.stores s where s.id = store_members.store_id and s.owner_id = auth.uid())
  );

-- modules policies (public read)
create policy modules_select_all on public.modules
  for select using (true);

-- store_modules policies
create policy store_modules_select_member on public.store_modules
  for select using (
    exists (
      select 1 from public.stores s
      where s.id = store_modules.store_id and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.store_members m where m.store_id = s.id and m.user_id = auth.uid())
      )
    )
  );
create policy store_modules_write_owner on public.store_modules
  for all using (
    exists (select 1 from public.stores s where s.id = store_modules.store_id and s.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.stores s where s.id = store_modules.store_id and s.owner_id = auth.uid())
  );

-- campaigns policies
create policy campaigns_select_member on public.campaigns
  for select using (
    exists (
      select 1 from public.stores s
      where s.id = campaigns.store_id and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.store_members m where m.store_id = s.id and m.user_id = auth.uid())
      )
    )
  );
create policy campaigns_write_owner on public.campaigns
  for all using (
    exists (select 1 from public.stores s where s.id = campaigns.store_id and s.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.stores s where s.id = campaigns.store_id and s.owner_id = auth.uid())
  );

-- coupons policies
create policy coupons_select_member on public.coupons
  for select using (
    exists (
      select 1 from public.stores s
      where s.id = coupons.store_id and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.store_members m where m.store_id = s.id and m.user_id = auth.uid())
      )
    )
  );
create policy coupons_write_owner on public.coupons
  for all using (
    exists (select 1 from public.stores s where s.id = coupons.store_id and s.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.stores s where s.id = coupons.store_id and s.owner_id = auth.uid())
  );

-- coupon_redemptions policies
create policy coupon_redemptions_select_member on public.coupon_redemptions
  for select using (
    exists (
      select 1 from public.stores s
      where s.id = coupon_redemptions.store_id and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.store_members m where m.store_id = s.id and m.user_id = auth.uid())
      )
    )
  );

-- analytics_events policies
create policy analytics_events_select_member on public.analytics_events
  for select using (
    exists (
      select 1 from public.stores s
      where s.id = analytics_events.store_id and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.store_members m where m.store_id = s.id and m.user_id = auth.uid())
      )
    )
  );

-- audit_logs policies
create policy audit_logs_select_member on public.audit_logs
  for select using (
    store_id is null and actor_id = auth.uid()
    or exists (
      select 1 from public.stores s
      where s.id = audit_logs.store_id and (
        s.owner_id = auth.uid()
        or exists (select 1 from public.store_members m where m.store_id = s.id and m.user_id = auth.uid())
      )
    )
  );

-- Seed module definitions
insert into public.modules (id, name, description) values
  ('discount-spin-wheel', 'Discount Spin Wheel', 'Configurable promotional wheel with server-issued coupons.'),
  ('product-recommendations', 'Product Recommendations', 'Manual complementary product recommendations.'),
  ('countdown-campaigns', 'Countdown Campaigns', 'Time-bound promotional campaigns with live countdowns.'),
  ('analytics', 'Analytics', 'Store-scoped engagement and coupon metrics.')
on conflict (id) do nothing;