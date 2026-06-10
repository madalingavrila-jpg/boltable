# AGENTS.md — sfood

Bolt Food Sales Dashboard on **Boltable** (`https://sfood.boltable.eu`).

## Stack

- **Runtime:** Node.js 22+ · Express 5 · TypeScript
- **Frontend:** Next.js 15 static export (Stitch Velocity Grid UI) — React components in `app/` + `components/`
- **Deploy:** Paketo Node buildpack — `npm run build` → `next build` + `tsc`, `npm start` → port **8080**
- **No `project.toml`** — Node template (not nginx static)
- **No GitHub Pages workflow** — Boltable auto-deploys on push to `main`

## Architecture

```
Next.js (app/, components/)  ──build──►  out/  ──serve──►  Express (src/server.ts)
                                                              GET /health
                                                              static files from out/
```

## Local dev

```bash
npm install
npm run dev
# http://localhost:3000 — Next.js dev server (UI)
```

Production-like local run:

```bash
npm run build
npm start
# http://localhost:8080 — Express serves static export
```

## Boltable deploy

### Prerequisites

1. NetBird VPN connected
2. GitHub org `boltable` access
3. `gh auth login`

### Create repo & push

```bash
git init
git add .
git commit -m "Initial sfood sales dashboard"
gh repo create boltable/sfood --private --source=. --remote=origin --push
```

Or push to `madalingavrila-jpg/sfood` and link the repo in portal.boltable.eu.

Live URL after Boltable registration: **https://sfood.boltable.eu**

## Conventions

- Stitch UI — Bolt green `#006d41` in `tailwind.config.ts`
- Do not add `basePath` / GitHub Pages export config — Boltable serves at repo subdomain root
- Keep boltable (madalingavrila-jpg/boltable) as separate GitHub Pages demo

## Key files

| Path | Role |
|---|---|
| `src/server.ts` | Express app, serves `out/` |
| `src/config.ts` | Port, host, static dir |
| `next.config.ts` | Static export (`output: "export"`) |
| `app/`, `components/` | Stitch dashboard UI |
| `DESIGN.md` | Velocity Grid design tokens |
