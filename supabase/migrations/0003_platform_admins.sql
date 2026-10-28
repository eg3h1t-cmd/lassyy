create table if not exists public.platform_admins (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.platform_admins enable row level security;

create policy platform_admins_select_self on public.platform_admins
  for select using (auth.uid() = user_id);