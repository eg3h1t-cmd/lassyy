-- Allow authenticated store members to append audit entries for their stores.
drop policy if exists audit_logs_insert_member on public.audit_logs;
create policy audit_logs_insert_member on public.audit_logs
  for insert with check (
    actor_id = auth.uid()
    and (store_id is null or public.is_store_member(store_id, auth.uid()))
  );