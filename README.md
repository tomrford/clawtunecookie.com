# clawtunecookie.com

Minimal Cloudflare Worker using Hono.

At `/` it explains the joke (for humans too). At `/source` it issues a `303` to the GitHub repo. At `/cookie` it uses `x402` to charge a tiny amount before returning one random fortune cookie from `fortunes.json`.

## Scripts

```bash
npm run dev
npm run typecheck
npm test
npm run check
npm run deploy
```

## Repo layout

`src/app.ts` wires routes.

`src/payment.ts` isolates the x402 middleware setup.

`fortunes.json` is the canonical fortune source file, so the paid content stays auditable in the repo.
