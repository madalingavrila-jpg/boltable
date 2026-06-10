# boltable / sfood

Bolt Food Sales Dashboard — Next.js UI + Express API for live metrics from **Looker** and **Salesforce**.

## Getting started (local)

```bash
npm install --cache ./.npm-cache
cp .env.example .env.local
# fill LOOKER_* and SALESFORCE_* in .env.local
npm run build:boltable
npm run start:server
```

Open [http://localhost:8080](http://localhost:8080).

API:

- `GET /api/health`
- `GET /api/status`
- `GET /api/dashboard`

## Data sources

| Widget | Source | Query / field |
|--------|--------|---------------|
| Total Revenue | Looker `curated.fact_order_delivery` | `food_provider_price_before_discounts_eur_local`, filter 30 days |
| Active Partners | Looker | `delivery_vendors_with_orders_finished_local`, 30 days |
| Active cities subtitle | Looker `curated.dim_city` | `is_food_delivery_active = Yes` |
| New Leads (MTD) | Salesforce `Lead` | `COUNT() WHERE CreatedDate = THIS_MONTH` |
| Market Growth % | Looker | 30d GMV vs prior 30d |
| Weekly Revenue Chart | Looker | daily GMV, 7 days |
| Top Cities | Looker | GMV by `dim_city.city_name`, 7d vs prior 7d |
| Recent Activities | Salesforce | recent `Lead` + `Account` records |

## Boltable deploy (https://sfood.boltable.eu)

1. Set secrets in the Boltable portal (see `.env.example`).
2. Paketo runs `npm run build` (static export + Express server) and starts `npm run start:server`.
3. Required env vars:

```
LOOKER_BASE_URL=https://bolt.cloud.looker.com
LOOKER_CLIENT_ID=
LOOKER_CLIENT_SECRET=
LOOKER_MODEL=curated
LOOKER_EXPLORE=fact_order_delivery
LOOKER_TIMEZONE=Europe/Bucharest

SALESFORCE_LOGIN_URL=https://login.salesforce.com
SALESFORCE_CLIENT_ID=
SALESFORCE_CLIENT_SECRET=
SALESFORCE_USERNAME=
SALESFORCE_PASSWORD=
SALESFORCE_SECURITY_TOKEN=

SFOOD_DEPLOY_TARGET=boltable
SFOOD_CACHE_TTL_MS=60000
PORT=8080
```

Without credentials the dashboard shows placeholders and `/api/status` reports `missing_credentials`.

## GitHub Pages (static demo)

```bash
npm run build:pages
```

Pushes to `main` deploy via `.github/workflows/deploy-pages.yml` to https://madalingavrila-jpg.github.io/boltable/ (no live API on Pages).

## Scripts

- `npm run dev` — Next.js dev server
- `npm run dev:server` — Express + API (tsx, requires prior `build:boltable`)
- `npm run build:boltable` — production build for Boltable
- `npm run build:pages` — static export with `/boltable` base path
- `npm run start:server` — serve `out/` + `/api/*`

## Design reference

- `DESIGN.md` — Velocity Grid design tokens
- `screens/` — original Stitch HTML exports
