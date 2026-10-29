# Operations, backup, and recovery

## Migrations
- Apply migrations in order via Supabase SQL editor or `supabase db push`.
- Never edit applied migrations; add new ones.

## Backups
- Use Supabase automated backups (plan-dependent).
- Export critical tables periodically.

## Monitoring
- Use host platform logs and Supabase logs.
- Add error tracking (e.g., Sentry) before production.

## Recovery
- Restore from Supabase backup or re-apply migrations to a fresh project.
- Re-deploy application after restoring data.