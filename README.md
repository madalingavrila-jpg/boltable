# sfood

Bolt Food Sales Dashboard — Next.js dashboard for enterprise sales operations, built from the Velocity Grid design system (Stitch Google export).

**Target URL:** https://sfood.boltable.eu

## Features

- Sales Dashboard Overview — KPI cards, revenue chart, activities feed, cities table
- Bolt brand UI — `#006d41` primary, Velocity Grid tokens from Stitch
- Static export served by Express on Boltable (same deploy pattern as [rosales](https://github.com/boltable/rosales))

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000 for UI development.

Production-like run:

```bash
npm run build
npm start
```

Open http://localhost:8080 — Express serves the static export.

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

## Deploy

Push to `boltable/sfood` on GitHub — Paketo auto-builds and deploys on Boltable.

See [AGENTS.md](AGENTS.md) for Boltable setup details.

## Related repos

- [boltable](https://github.com/madalingavrila-jpg/boltable) — GitHub Pages demo of the same Stitch UI (`/boltable` basePath)
- [rosales](https://github.com/boltable/rosales) — deploy structure reference (Express + Paketo on Boltable)
