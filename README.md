# PromoNest

PromoNest is a multi-tenant SaaS platform for e-commerce growth: promotional campaigns, marketing widgets, and analytics. This repository contains the initial foundation (Phase 1-2).

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

Migrations live in `supabase/migrations/`. Apply `0001_initial_schema.sql` to a fresh Supabase project via the SQL editor or `supabase db push`.

## Known limitations (current foundation)

- Supabase project is not provisioned; auth and persistence require configuration.
- Marketing modules, demo storefront, and coupon engine are planned for later phases.
- No payment provider is integrated.
- No real e-commerce integrations yet.

## Security

See `docs/SECURITY.md`. Never commit real secrets. Service-role keys must stay server-only.