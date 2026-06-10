# boltable

Bolt Food Sales Dashboard — a Next.js dashboard for enterprise sales operations, built from the Velocity Grid design system (Stitch Google export).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/boltable](http://localhost:3000/boltable) to view the Sales Dashboard Overview.

## Live demo

https://madalingavrila-jpg.github.io/boltable/

## Scripts

- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — run ESLint

## Design reference

- `DESIGN.md` — Velocity Grid design tokens
- `screens/` — original Stitch HTML exports

## Deploy

### GitHub Pages (current)

Pushes to `main` deploy automatically via `.github/workflows/deploy-pages.yml`.

- Live URL: https://madalingavrila-jpg.github.io/boltable/
- Redeploy: push to `main`, or run the workflow manually from the Actions tab.

### Vercel (recommended for Next.js)

1. Run `npx vercel login` and authenticate.
2. From the project root: `npx vercel --prod`
3. Or import https://github.com/madalingavrila-jpg/boltable in the [Vercel dashboard](https://vercel.com/new) and connect the repo.

For GitHub Pages, the app uses static export with `basePath: /boltable`. Remove `basePath` / `assetPrefix` and `output: "export"` in `next.config.ts` before deploying to Vercel for a root-domain setup.
