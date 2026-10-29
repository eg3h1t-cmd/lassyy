# WhatsApp modules

Three independent, one-time-purchase modules:

- `wp_sepet_hatirlatma` — abandoned cart reminder
- `wp_kampanya_toplu` — bulk campaign notifications
- `wp_kargo_takip` — shipping status notifications

No subscriptions or plans. Access is checked with `hasModuleAccess` / `hasModuleAccessService` against `tenant_modules`.

## Required configuration

Server-only env:

```env
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_API_VERSION=v21.0
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_APP_SECRET=
WHATSAPP_TEMPLATE_CART=sepet_hatirlatma
WHATSAPP_TEMPLATE_SHIPPING=kargo_takip
WHATSAPP_TEMPLATE_CAMPAIGN=kampanya_toplu
SHIPPING_WEBHOOK_SECRET=
CART_WEBHOOK_SECRET=
CRON_SECRET=
ABANDONED_CART_DELAY_MINUTES=60
```

Create and get approval for WhatsApp message templates in Meta Business Manager before expecting delivery.

## Endpoints

- `POST /api/webhooks/shipping` — carrier event → queue shipping message
  - Header: `x-webhook-secret: $SHIPPING_WEBHOOK_SECRET`
- `POST /api/webhooks/cart-abandoned` — store abandons cart → store event
  - Header: `x-webhook-secret: $CART_WEBHOOK_SECRET`
- `GET/POST /api/cron/abandoned-carts` — queue reminders after delay
  - Header: `Authorization: Bearer $CRON_SECRET`
- `POST /api/whatsapp/campaigns` — authenticated batch campaign queue
- `GET/POST /api/cron/whatsapp-queue` — send queued messages
- `GET/POST /api/webhooks/whatsapp` — Meta verification and delivery status updates

## Dashboard

`/dashboard/[store-slug]/whatsapp` shows the three modules, connection/API status, message counts and recent messages.

## Limitations

- Actual delivery requires a Meta WhatsApp Business account, approved templates and a service-role key for the queue worker.
- The queue is processed by a cron job; configure a scheduler (e.g. Vercel Cron) for production.
- Consent/opt-in is required for marketing messages; the campaign endpoint requires `consentConfirmed: true`.
