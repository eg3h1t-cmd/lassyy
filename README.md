# lassyy

lassyy is a multi-tenant SaaS platform for e-commerce growth: promotional campaigns, marketing widgets, and analytics. This repository contains the initial foundation (Phase 1-2).

## Stack

- Next.js (App Router) + React + TypeScript (strict)
- Tailwind CSS
- Supabase (PostgreSQL, Auth, RLS) — optional for local foundation
- Vitest for tests

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

Fill in Supabase values if you have a project. The app runs without them in a limited mode.

3. Run the dev server:

```bash
npm run dev
```

4. Open http://localhost:3000

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm run test` — Vitest

## Database

Migrations live in `supabase/migrations/`. Apply in order via the SQL editor or `supabase db push`:

1. `0001_initial_schema.sql`
2. `0002_profile_trigger.sql`
3. `0003_platform_admins.sql`
4. `0004_fix_rls_recursion.sql`
5. `0005_event_insert_policies.sql`
6. `0006_audit_insert_policy.sql`
7. `0007_subscriptions.sql`
8. `0008_team_and_api_keys.sql`
9. `0009_admin_plan_management.sql`

`0004` fixes infinite recursion between `stores` and `store_members` policies by using `SECURITY DEFINER` helper functions. `0005` allows store members to record analytics events and redemptions. `0006` enables audit log inserts.

## Health check

`GET /api/health` returns `{ status: "ok", app: "lassyy", supabaseConfigured, timestamp }`.

## Rate limiting

The spin endpoint uses in-memory rate limiting by default. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for shared production rate limiting.

## Tests

```bash
npm run test
npm run lint
npx tsc --noEmit
npm run build
npx playwright test
```

Authenticated E2E tests run when `E2E_EMAIL` and `E2E_PASSWORD` are set.

## Known limitations (current foundation)

- Supabase project is not provisioned; auth and persistence require configuration.
- Marketing modules, demo storefront, and coupon engine are planned for later phases.
- No payment provider is integrated.
- No real e-commerce integrations yet.

## Security

See `docs/SECURITY.md`. Never commit real secrets. Service-role keys must stay server-only.