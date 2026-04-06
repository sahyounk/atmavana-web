# Atma Vana — Global Wellness Marketplace

## Overview
Invitation-only platform connecting vetted healers, meditation teachers, and spiritual guides with clients worldwide. Handles booking, payments (Stripe Connect + NOWPayments crypto), KYC (Sumsub), HD video sessions, healer storefronts, and admin dashboard. Tagline: "Where Healing Finds You".

## Tech Stack
- **Runtime:** Cloudflare Workers (vanilla JS ESM)
- **Database:** Cloudflare D1 (`atmavana-db`, 8 tables)
- **Sessions:** Cloudflare KV (`SESSIONS`)
- **Payments:** Stripe Connect (fiat) + NOWPayments (350+ cryptos)
- **KYC/AML:** Sumsub
- **Auth:** JWT
- **Domain:** atmavana.net

## Project Structure
```
atmavana-worker/            # Main deployable worker
  src/
    worker.js               # Routing, API, payments, webhooks, auth
    templates.js            # All HTML templates (landing, marketplace, storefronts, booking, checkout, admin, healer dashboard)
    i18n.js                 # Internationalisation
  wrangler.toml
  package.json
  DEPLOY.md                 # Step-by-step deployment guide

website/index.html          # Separate static landing page
```

## Cloudflare Bindings
- `DB` — D1 database (ID: `6fdcf568-9d3b-4e62-afe0-8fc0e0ff913d`)
- `SESSIONS` — KV namespace (ID: `95b23c69db264047891038de182a3a4e`)

## Environment Variables
- `PLATFORM_NAME` = "AtmaVana"
- `PLATFORM_DOMAIN` = "atmavana.net"
- `COMMISSION_FIXED_USD` = "5"
- `HEALER_SUB_STANDARD_USD` = "15"
- `HEALER_SUB_PRO_USD` = "35"

## Secrets Required
```bash
wrangler secret put JWT_SECRET
wrangler secret put ADMIN_PASSWORD
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put NOWPAYMENTS_API_KEY
wrangler secret put NOWPAYMENTS_IPN_SECRET
wrangler secret put SUMSUB_APP_TOKEN
wrangler secret put SUMSUB_SECRET_KEY
```

## Deployment
```bash
cd atmavana-worker
npm install
npx wrangler deploy
```

## Key URLs
| Path | Page |
|------|------|
| / | Landing page |
| /marketplace | Browse healers |
| /healer/:slug | Healer storefront |
| /admin | Admin dashboard |
| /dashboard | Healer dashboard |
| /booking/:id | Book a service |
| /checkout/:id | Payment page |

## Webhook Endpoints
- `POST /webhooks/stripe` — Stripe payment events
- `POST /webhooks/nowpayments` — NOWPayments IPN
- `POST /webhooks/sumsub` — KYC verification callbacks
