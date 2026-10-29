-- Fix infinite recursion between stores and store_members RLS policies.
--
-- Problem:
--   stores_select_member queried store_members, whose policy queried stores again.
--
-- Solution:
--   Use SECURITY DEFINER helper functions that bypass RLS for the membership
--   check. Policies then call these helpers instead of cross-querying tables
--   whose policies reference each other.
--
-- Apply this migration after 0001, 0002, and 0003.

create or replace function public.is_store_member(target_store_id uuid, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.store_members m
    where m.store_id = target_store_id
      and m.user_id = target_user_id
  );
$$;

create or replace function public.is_store_owner(target_store_id uuid, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.stores s
    where s.id = target_store_id
      and s.owner_id = target_user_id
  );
$$;

revoke all on function public.is_store_member(uuid, uuid) from public;
revoke all on function public.is_store_owner(uuid, uuid) from public;
grant execute on function public.is_store_member(uuid, uuid) to authenticated, anon;
grant execute on function public.is_store_owner(uuid, uuid) to authenticated, anon;

-- stores
drop policy if exists stores_select_member on public.stores;
drop policy if exists stores_insert_owner on public.stores;
drop policy if exists stores_update_owner on public.stores;
drop policy if exists stores_delete_owner on public.stores;

create policy stores_select_member on public.stores
  for select using (
    owner_id = auth.uid()
    or public.is_store_member(id, auth.uid())
  );

create policy stores_insert_owner on public.stores
  for insert with check (owner_id = auth.uid());

create policy stores_update_owner on public.stores
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy stores_delete_owner on public.stores
  for delete using (owner_id = auth.uid());

-- store_members
drop policy if exists store_members_select on public.store_members;
drop policy if exists store_members_insert_owner on public.store_members;
drop policy if exists store_members_delete_owner on public.store_members;

create policy store_members_select on public.store_members
  for select using (
    user_id = auth.uid()
    or public.is_store_owner(store_id, auth.uid())
  );

create policy store_members_insert_owner on public.store_members
  for insert with check (public.is_store_owner(store_id, auth.uid()));

create policy store_members_delete_owner on public.store_members
  for delete using (public.is_store_owner(store_id, auth.uid()));

-- store_modules
drop policy if exists store_modules_select_member on public.store_modules;
drop policy if exists store_modules_write_owner on public.store_modules;

create policy store_modules_select_member on public.store_modules
  for select using (public.is_store_member(store_id, auth.uid()));

create policy store_modules_write_owner on public.store_modules
  for all using (public.is_store_owner(store_id, auth.uid()))
  with check (public.is_store_owner(store_id, auth.uid()));

-- campaigns
drop policy if exists campaigns_select_member on public.campaigns;
drop policy if exists campaigns_write_owner on public.campaigns;

create policy campaigns_select_member on public.campaigns
  for select using (public.is_store_member(store_id, auth.uid()));

create policy campaigns_write_owner on public.campaigns
  for all using (public.is_store_owner(store_id, auth.uid()))
  with check (public.is_store_owner(store_id, auth.uid()));

-- coupons
drop policy if exists coupons_select_member on public.coupons;
drop policy if exists coupons_write_owner on public.coupons;

create policy coupons_select_member on public.coupons
  for select using (public.is_store_member(store_id, auth.uid()));

create policy coupons_write_owner on public.coupons
  for all using (public.is_store_owner(store_id, auth.uid()))
  with check (public.is_store_owner(store_id, auth.uid()));

-- coupon_redemptions
drop policy if exists coupon_redemptions_select_member on public.coupon_redemptions;

create policy coupon_redemptions_select_member on public.coupon_redemptions
  for select using (public.is_store_member(store_id, auth.uid()));

-- analytics_events
drop policy if exists analytics_events_select_member on public.analytics_events;

create policy analytics_events_select_member on public.analytics_events
  for select using (public.is_store_member(store_id, auth.uid()));

-- audit_logs
drop policy if exists audit_logs_select_member on public.audit_logs;

create policy audit_logs_select_member on public.audit_logs
  for select using (
    (store_id is null and actor_id = auth.uid())
    or public.is_store_member(store_id, auth.uid())
  );