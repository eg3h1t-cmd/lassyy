# Database tenant-isolation tests

These tests must run against an isolated Supabase test project.

## Approach
1. Create two test users and two stores.
2. Sign in as user A; attempt to select/update/delete user B's store, campaigns, coupons, analytics.
3. Verify RLS denies access (empty result or error).
4. Verify user A can manage their own store.

## Running
Set `SUPABASE_TEST_URL` and `SUPABASE_TEST_ANON_KEY` and `SUPABASE_TEST_SERVICE_ROLE_KEY` in the environment, then run the test script (to be implemented with a DB client).

NOTE: Automated harness is not yet wired; this documents the required manual/CI verification.