# Architecture

## Overview

lassyy is a modular monolith built on Next.js (App Router). It uses Supabase for PostgreSQL, Auth, and Row Level Security (RLS). Tenant isolation is enforced both in the database (RLS) and in server-side authorization.

## Directory structure

- `src/app` — routes, layouts, pages (server components by default)
- `src/components` — reusable UI and feature components
- `src/lib` — utilities, env validation, Supabase clients
- `src/server` — server-only domain logic (to be expanded)
- `supabase/migrations` — version-controlled SQL schema
- `docs` — architecture, security, milestones

## Multi-tenancy

- `stores` owned by a profile (`owner_id`).
- `store_members` grants staff access.
- RLS policies restrict reads/writes to store owners and members.
- Service-role key is used only in trusted server contexts.

## Modules

Modules are independent features identified by stable string IDs. Each has configuration stored in `store_modules.config` (JSONB) plus dedicated tables where needed (campaigns, coupons, analytics_events).

## Security boundaries

- Browser never receives service-role key.
- All privileged actions go through server routes/actions with session verification.
- Input validated with Zod.
- RLS enabled on every protected table.