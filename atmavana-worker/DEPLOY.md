# AtmaVana — Deployment Guide

## What's Already Done

- D1 database (`atmavana-db`) is live with all 8 tables + indexes
- KV namespace (`atmavana-sessions`) is live
- Worker code is ready: API, webhooks, storefronts, admin dashboard
- wrangler.toml is configured with your D1 and KV bindings

## Step 1: Install Wrangler

```bash
npm install -g wrangler
wrangler login
```

## Step 2: Deploy the Worker

```bash
cd atmavana-worker
npm install
npx wrangler deploy
```

This deploys the worker and binds it to your D1 database and KV namespace.

## Step 3: Set Up DNS Routes

In your Cloudflare dashboard for atmavana.com:
1. Go to Workers Routes
2. Add route: `atmavana.com/*` → `atmavana` worker
3. Add route: `*.atmavana.com/*` → `atmavana` worker

Or Wrangler will handle this automatically via the routes in wrangler.toml.

## Step 4: Set Secrets

Each secret needs to be set individually:

```bash
# Generate a JWT secret (use any random 64-char string)
npx wrangler secret put JWT_SECRET

# Set your initial admin password
npx wrangler secret put ADMIN_PASSWORD
```

### Payment & KYC secrets (set these after you create accounts):

```bash
# Stripe (sign up at stripe.com, enable Connect)
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET

# NOWPayments (sign up at nowpayments.io)
npx wrangler secret put NOWPAYMENTS_API_KEY
npx wrangler secret put NOWPAYMENTS_IPN_SECRET

# Sumsub (sign up at sumsub.com)
npx wrangler secret put SUMSUB_APP_TOKEN
npx wrangler secret put SUMSUB_SECRET_KEY
```

## Step 5: Create Your Admin Account

Once deployed, create an admin user via the API:

```bash
curl -X POST https://atmavana.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@atmavana.com", "password": "YOUR_ADMIN_PASSWORD"}'
```

## Step 6: Sign Up for Payment Providers

### Stripe Connect (fiat payments)
1. Go to stripe.com and create an account
2. In Dashboard → Connect → Get Started, enable Express accounts
3. Copy your Secret Key (sk_live_...) and set it as a secret
4. Set up a webhook endpoint: https://atmavana.com/webhooks/stripe
   - Events to listen for: payment_intent.succeeded, payment_intent.failed, account.updated
   - Copy the Webhook Signing Secret (whsec_...) and set it as a secret

### NOWPayments (stablecoin payments)
1. Go to nowpayments.io and create an account
2. Get your API Key from the dashboard
3. Set IPN callback URL to: https://atmavana.com/webhooks/nowpayments
4. Get your IPN Secret from settings
5. Set both as secrets

### Sumsub (KYC verification)
1. Go to sumsub.com and create an account
2. Create an application in the dashboard
3. Configure a "basic-kyc-level" verification flow (ID + Selfie)
4. Set webhook URL to: https://atmavana.com/webhooks/sumsub
5. Get your App Token and Secret Key from API settings
6. Set both as secrets

## URLs After Deployment

| URL | What It Shows |
|-----|--------------|
| atmavana.com | Landing page |
| atmavana.com/marketplace | Browse all healers |
| atmavana.com/healer/sarah | Sarah's storefront (by slug) |
| sarah.atmavana.com | Sarah's storefront (subdomain) |
| atmavana.com/admin | Admin dashboard |
| atmavana.com/dashboard | Healer dashboard |
| atmavana.com/login | Client login |
| atmavana.com/register | Client registration |
| atmavana.com/booking/:id | Book a service |
| atmavana.com/checkout/:id | Payment page |

## Project Structure

```
atmavana-worker/
├── src/
│   ├── worker.js      # Main worker: routing, API, webhooks, auth
│   └── templates.js   # All HTML templates (landing, storefronts, admin, etc.)
├── wrangler.toml      # Cloudflare config (D1, KV, routes, env vars)
├── package.json       # Dependencies
└── DEPLOY.md          # This file
```

## Local Development

```bash
npx wrangler dev
```

This starts a local server at http://localhost:8787 with access to your D1 database.
