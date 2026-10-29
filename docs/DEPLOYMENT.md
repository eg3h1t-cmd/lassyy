# Deployment

## Target
Compatible with Vercel or any Node.js host. Supabase provides database and auth.

## Steps
1. Create a Supabase project.
2. Apply migrations in `supabase/migrations/` in order.
3. Set environment variables from `.env.example`.
4. `npm install && npm run build`.
5. Deploy the Next.js app.
6. Configure Supabase Auth (email verification, password reset, redirect URLs).

## Free-tier limitations
- Supabase free tier has database size, bandwidth, and auth user limits.
- Vercel free tier has build/runtime limits.
- Rate limiting and advanced monitoring may require paid services.

## Secrets
Never commit `.env.local`. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only.