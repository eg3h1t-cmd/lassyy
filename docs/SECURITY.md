# Security notes

## Implemented (foundation)

- Environment validation with Zod (`src/lib/env.ts`).
- Supabase SSR clients split by context (browser/server/middleware).
- Middleware session refresh.
- RLS policies for all protected tables.
- No service-role key in browser code.

## Required before production

- Provision Supabase project and apply migrations.
- Enable email verification and password reset in Supabase Auth.
- Add rate limiting for auth and coupon endpoints.
- Add CSRF protection for state-changing server actions where needed.
- Add audit logging for privileged admin actions.
- Run dependency audits and keep packages updated.
- Complete tenant-isolation tests against a real database.

## Risks / assumptions

- Without a real Supabase project, auth and persistence cannot be verified.
- RLS policies are written but not yet executed/tested.
- Platform admin role is not yet modeled in the database; admin access must be verified through trusted server logic and a future `platform_admins` table.