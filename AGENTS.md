# AGENTS.md — sfood data refresh

This app does **not** call Looker or Salesforce at runtime. You (the Cursor agent) fetch live data via MCP and write `data/dashboard.json`.

## Workflow

1. Query Looker + Salesforce with MCP tools (credentials live in Cursor, not on Boltable).
2. Map results to `data/dashboard.json` using `data/dashboard.schema.json`.
3. Set `updatedAt` to the current ISO timestamp.
4. Commit `data/dashboard.json` and push — Paketo redeploys https://sfood.boltable.eu.

## Looker queries (model: `curated`)

### Total revenue (30 days)

```
looker-query
  model: curated
  explore: fact_order_delivery
  fields: [fact_order_delivery.food_provider_price_before_discounts_eur_local]
  filters: { fact_order_delivery.order_created_date_local_date: "30 days" }
  tz: Europe/Bucharest
```

Prior 30 days: filter `"31 days ago for 30 days"`.

### Active partners (30 days)

```
fields: [fact_order_delivery.delivery_vendors_with_orders_finished_local]
filters: { fact_order_delivery.order_created_date_local_date: "30 days" }
```

Prior period: `"31 days ago for 30 days"`.

### Active cities

```
model: curated
explore: dim_city
fields: [dim_city.city_name]
filters: { dim_city.is_food_delivery_active: "Yes" }
limit: 5000
```

Count rows → `metrics.activeCities`.

### Weekly revenue (7 days)

```
fields:
  - fact_order_delivery.order_created_date_local_date
  - fact_order_delivery.food_provider_price_before_discounts_eur_local
filters: { fact_order_delivery.order_created_date_local_date: "7 days" }
sorts: [fact_order_delivery.order_created_date_local_date asc]
```

Map each row to `{ day, date, value }`.

### Top cities (7 days vs prior 7 days)

Current week:

```
fields:
  - dim_city.city_name
  - dim_city.country_name
  - fact_order_delivery.food_provider_price_before_discounts_eur_local
  - fact_order_delivery.average_food_provider_price_before_discounts_eur_local
filters: { fact_order_delivery.order_created_date_local_date: "7 days" }
sorts: [fact_order_delivery.food_provider_price_before_discounts_eur_local desc]
limit: 10
```

Prior week per city:

```
fields: [dim_city.city_name, fact_order_delivery.food_provider_price_before_discounts_eur_local]
filters: { fact_order_delivery.order_created_date_local_date: "14 days ago for 7 days" }
```

Growth % = `(current - previous) / previous * 100`.

## Salesforce queries

### New leads MTD

```sql
SELECT COUNT() FROM Lead WHERE CreatedDate = THIS_MONTH
```

Prior month:

```sql
SELECT COUNT() FROM Lead WHERE CreatedDate = LAST_MONTH
```

### Recent activities

```sql
SELECT Id, Name, Company, City, Status, CreatedDate
FROM Lead ORDER BY CreatedDate DESC LIMIT 6
```

```sql
SELECT Id, Name, BillingCity, CreatedDate
FROM Account WHERE CreatedDate = LAST_N_DAYS:7
ORDER BY CreatedDate DESC LIMIT 4
```

Map to `recentActivities`:

- Converted lead → `{ type: "lead", icon: "verified", title: "\"Company\" converted to partner." }`
- New lead → `{ type: "lead", icon: "group_add", title: "New lead \"Company\" received." }`
- Account → `{ type: "account", icon: "storefront", title: "\"Name\" onboarded as restaurant partner." }`

## JSON output

Write `data/dashboard.json` with structure documented in `data/dashboard.schema.json`.

Compute:

- `metrics.totalRevenue.changePercent` from current vs `previousValue`
- `metrics.activePartners.changePercent` likewise
- `metrics.newLeadsMtd.changePercent` vs last month count
- `metrics.marketGrowth.value` = revenue change %

## Verify locally

```bash
npm run build:boltable
npm run start:server
curl http://localhost:8080/api/dashboard | jq '.metrics[0].value'
```

## Optional Google Sheet

Instead of committing JSON, set `DASHBOARD_SHEET_URL` to a published CSV URL on Boltable. The server reads that URL at runtime (metrics-only CSV row supported; full dashboard still prefers JSON in repo).

## Do not

- Add login/logout or auth flows to the app.
- Require `LOOKER_*` or `SALESFORCE_*` env vars on Boltable.
- Change the TopBar profile (Bianca Medrea header stays as-is).
