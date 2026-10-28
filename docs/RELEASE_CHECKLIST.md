# Release-readiness checklist

## Build and quality
- [x] `npm run lint` passes
- [x] `npx tsc --noEmit` passes
- [x] `npm run test` passes
- [x] `npm run build` passes
- [ ] Playwright end-to-end journeys (not yet implemented)
- [ ] Load/performance profiling

## Security
- [x] RLS enabled on all protected tables
- [x] Server-side auth checks on privileged actions
- [x] Zod validation on inputs
- [x] Service-role key server-only
- [ ] Rate limiting on auth, spin, coupon endpoints
- [ ] CSRF review for server actions
- [ ] Tenant-isolation tests against live database
- [ ] Dependency audit (`npm audit`) triage

## Integrations
- [ ] Supabase project provisioned and migrations applied
- [ ] Email verification / password reset configured
- [ ] WooCommerce adapter (future)
- [ ] Shopify adapter (future)
- [ ] Payment provider (future)

## Privacy and legal
- [ ] Privacy policy finalized
- [ ] Terms finalized
- [ ] Consent and unsubscribe flows reviewed
- [ ] Data retention policy configured

## Documentation
- [x] README
- [x] Architecture
- [x] Security notes
- [x] Milestones
- [x] Release checklist