-- Team members (by existing account email) and enterprise API keys.

create or replace function public.add_store_member_by_email(target_store_id uuid, member_email text)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_user_id uuid;
begin
  if not exists (
    select 1 from public.stores
    where id = target_store_id and owner_id = auth.uid()
  ) then
    raise exception 'not_store_owner';
  end if;

  select id into target_user_id
  from auth.users
  where lower(email) = lower(member_email)
  limit 1;

  if target_user_id is null then
    raise exception 'user_not_found';
  end if;

  insert into public.store_members (store_id, user_id, role)
  values (target_store_id, target_user_id, 'staff')
  on conflict (store_id, user_id) do nothing;

  return target_user_id;
end;
$$;

revoke all on function public.add_store_member_by_email(uuid, text) from public;
grant execute on function public.add_store_member_by_email(uuid, text) to authenticated;

create or replace function public.list_store_members(target_store_id uuid)
returns table (user_id uuid, email text, role text, created_at timestamptz)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_store_member(target_store_id, auth.uid()) then
    raise exception 'not_store_member';
  end if;

  return query
    select m.user_id, u.email::text, m.role, m.created_at
    from public.store_members m
    join auth.users u on u.id = m.user_id
    where m.store_id = target_store_id
    order by m.created_at asc;
end;
$$;

revoke all on function public.list_store_members(uuid) from public;
grant execute on function public.list_store_members(uuid) to authenticated;

create or replace function public.remove_store_member(target_store_id uuid, member_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_store_owner(target_store_id, auth.uid()) then
    raise exception 'not_store_owner';
  end if;
  if exists (select 1 from public.stores where id = target_store_id and owner_id = member_user_id) then
    raise exception 'cannot_remove_owner';
  end if;
  delete from public.store_members
  where store_id = target_store_id and user_id = member_user_id;
end;
$$;

revoke all on function public.remove_store_member(uuid, uuid) from public;
grant execute on function public.remove_store_member(uuid, uuid) to authenticated;

create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  key_hash text not null unique,
  key_prefix text not null,
  created_by uuid references public.profiles(id) on delete set null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists api_keys_store_id_idx on public.api_keys(store_id);

alter table public.api_keys enable row level security;

create policy api_keys_select_owner on public.api_keys
  for select using (public.is_store_owner(store_id, auth.uid()));

create policy api_keys_insert_owner on public.api_keys
  for insert with check (public.is_store_owner(store_id, auth.uid()));

create policy api_keys_update_owner on public.api_keys
  for update using (public.is_store_owner(store_id, auth.uid()))
  with check (public.is_store_owner(store_id, auth.uid()));

create policy api_keys_delete_owner on public.api_keys
  for delete using (public.is_store_owner(store_id, auth.uid()));