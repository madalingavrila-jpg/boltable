# boltable / sfood

Bolt Food Sales Dashboard — Next.js UI + Express API. Metrics are loaded from **`data/dashboard.json`** (no Looker/Salesforce credentials on the server).

## Architecture

```
Cursor (Looker MCP + Salesforce MCP)
  → update data/dashboard.json
  → git push
  → Paketo redeploy (https://sfood.boltable.eu)
  → GET /api/dashboard
```

Optional: set `DASHBOARD_SHEET_URL` to a published Google Sheet CSV/JSON URL instead of the repo file.

## Getting started (local)

```bash
npm install --cache ./.npm-cache
cp .env.example .env.local
npm run build:boltable
npm run start:server
```

Open [http://localhost:8080](http://localhost:8080).

API:

- `GET /api/health`
- `GET /api/status`
- `GET /api/dashboard`

## Updating dashboard data (Cursor workflow)

1. In Cursor, use **Looker MCP** and **Salesforce MCP** to query live metrics (see `AGENTS.md`).
2. Write results to `data/dashboard.json` (schema: `data/dashboard.schema.json`).
3. Commit and push — Boltable redeploys automatically.

No login/logout or server-side API credentials required.

## Data file schema (summary)

| Section | Description |
|---------|-------------|
| `metrics.totalRevenue` | 30-day GMV (EUR) + change vs prior 30 days |
| `metrics.activePartners` | Active vendors + change |
| `metrics.activeCities` | Count of active delivery cities |
| `metrics.newLeadsMtd` | Salesforce leads this month |
| `metrics.marketGrowth` | 30-day GMV growth % |
| `weeklyRevenue` | Last 7 days daily GMV |
| `topCities` | Top cities by 7-day revenue + growth |
| `recentActivities` | Recent leads and partner accounts |

## Boltable deploy (https://sfood.boltable.eu)

Paketo runs `npm run build` (static export + Express server) and starts `npm run start:server`.

Required env vars:

```
SFOOD_DEPLOY_TARGET=boltable
SFOOD_CACHE_TTL_MS=60000
PORT=8080
```

Optional:

```
DASHBOARD_SHEET_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
```

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
- `AGENTS.md` — Cursor agent instructions for refreshing data
