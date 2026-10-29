# Security checklist (pre-launch)

- [ ] All RLS policies tested against live database
- [ ] Tenant-isolation tests pass
- [ ] Service-role key stored only in server env
- [ ] Rate limiting on auth and coupon endpoints
- [ ] CSRF review completed
- [ ] Dependency audit triaged
- [ ] Error messages do not leak secrets or stack traces
- [ ] Input validation on all server actions
- [ ] Admin access verified server-side
- [ ] Privacy and terms reviewed legally