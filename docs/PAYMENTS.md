# Payments and subscriptions

No payment provider is operational yet. The application models plans, entitlements, and subscription records so a verified provider can be connected without trusting browser-supplied plan data.

## Current state
- `subscriptions` and `payment_events` tables exist (`0007_subscriptions.sql`).
- Plan definitions and limits live in `src/server/entitlements.ts`.
- Store/campaign limit checks live in `src/server/subscriptions.ts`.
- Enforcement is off by default; enable with `SUBSCRIPTIONS_ENFORCED=true`.
- `src/server/payments/iyzico.ts` is a documented boundary, not an active integration.

## iyzico setup
1. Complete merchant onboarding and obtain sandbox credentials.
2. Set server-only env vars:
   - `IYZICO_API_KEY`
   - `IYZICO_SECRET_KEY`
   - `IYZICO_MERCHANT_ID`
   - `IYZICO_BASE_URL` (`https://sandbox-api.iyzipay.com` for testing)
3. Decide between iyzico Checkout Form and Subscription API based on account eligibility.
4. Implement checkout creation and callback/webhook verification in the adapter.
5. Store verified subscription status in `subscriptions`; log callbacks idempotently in `payment_events`.
6. Never trust plan or payment status supplied by the browser.
7. Test against the iyzico sandbox before claiming the integration is live.

## Development
`DEV_SUBSCRIPTION_PLAN` can override the plan locally. `SUBSCRIPTIONS_ENFORCED=false` keeps limits in observe-only mode.
