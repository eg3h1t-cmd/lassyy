-- Allow authenticated store members to record analytics events and coupon
-- redemptions from trusted server actions. Service-role requests bypass RLS.

drop policy if exists analytics_events_insert_member on public.analytics_events;
create policy analytics_events_insert_member on public.analytics_events
  for insert with check (public.is_store_member(store_id, auth.uid()));

drop policy if exists coupon_redemptions_insert_member on public.coupon_redemptions;
create policy coupon_redemptions_insert_member on public.coupon_redemptions
  for insert with check (public.is_store_member(store_id, auth.uid()));