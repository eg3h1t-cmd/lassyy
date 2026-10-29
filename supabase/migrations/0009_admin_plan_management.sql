-- Platform-admin store plan management (manual subscriptions until iyzico is live).

create or replace function public.admin_list_stores()
returns table (
  id uuid,
  name text,
  slug text,
  owner_email text,
  plan_id text,
  status text
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not exists (select 1 from public.platform_admins where user_id = auth.uid()) then
    raise exception 'not_platform_admin';
  end if;

  return query
    select
      s.id,
      s.name,
      s.slug,
      u.email::text,
      coalesce(sub.plan_id, 'starter'),
      coalesce(sub.status, 'incomplete')
    from public.stores s
    join auth.users u on u.id = s.owner_id
    left join public.subscriptions sub on sub.store_id = s.id
    order by s.created_at desc;
end;
$$;

revoke all on function public.admin_list_stores() from public;
grant execute on function public.admin_list_stores() to authenticated;

create or replace function public.admin_set_store_plan(
  target_store_id uuid,
  target_plan text,
  target_status text default 'active'
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not exists (select 1 from public.platform_admins where user_id = auth.uid()) then
    raise exception 'not_platform_admin';
  end if;

  if target_plan not in ('starter', 'growth', 'enterprise') then
    raise exception 'invalid_plan';
  end if;

  insert into public.subscriptions (store_id, provider, plan_id, status, current_period_end)
  values (target_store_id, 'manual', target_plan, target_status, now() + interval '1 year')
  on conflict (store_id) do update
    set plan_id = excluded.plan_id,
        status = excluded.status,
        provider = 'manual',
        current_period_end = excluded.current_period_end,
        updated_at = now();
end;
$$;

revoke all on function public.admin_set_store_plan(uuid, text, text) from public;
grant execute on function public.admin_set_store_plan(uuid, text, text) to authenticated;