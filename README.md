# sfood

Bolt Food Sales Dashboard — Next.js UI + Express API for live metrics from **Looker** and **Salesforce**.

**Live:** https://sfood.boltable.eu

## Getting started (local)

```bash
npm install
cp .env.example .env.local
# fill LOOKER_* and SALESFORCE_* in .env.local
npm run build
npm start
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

## Boltable deploy

Push to `main` on `boltable/sfood` — Paketo auto-builds and deploys.

Required env vars in Boltable portal (see `.env.example`):

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

SFOOD_CACHE_TTL_MS=60000
PORT=8080
```

Without credentials the dashboard shows placeholders and `/api/status` reports `missing_credentials`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Next.js dev server (UI) |
| `npm run build` | Static export + compile Express server |
| `npm start` | Production server on port 8080 |
| `npm run dev:server` | Run Express only (requires prior build) |
| `npm run lint` | ESLint |

## Design reference

- `DESIGN.md` — Velocity Grid design tokens
- `screens/` — original Stitch HTML exports

## Related repos

- [boltable](https://github.com/madalingavrila-jpg/boltable) — GitHub Pages demo of the same Stitch UI
- [rosales](https://github.com/boltable/rosales) — deploy structure reference
