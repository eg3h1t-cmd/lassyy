# Payments and subscriptions (future)

No payment provider is integrated. This version models plan entitlements only.

## Future approach
- Use Stripe or Paddle with verified webhooks.
- Store subscription status server-side from verified webhook events.
- Never trust plan/status from the browser.
- Implement idempotent webhook handlers for retries and duplicate events.
- Map provider price IDs to internal PlanId values.

## Development
`DEV_SUBSCRIPTION_PLAN` env var can override the plan for local testing only.