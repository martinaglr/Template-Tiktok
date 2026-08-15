# Template-Tiktok

Single-product landing + checkout for cold traffic from TikTok/Meta ads. See
`CLAUDE.md` for the full working brief, architecture, and phased plan.

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in pixel IDs when available
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Cloudflare Workers deploy

This app deploys to Cloudflare Workers via the [OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare).

```bash
npm run preview   # build + run once in the Workers runtime locally
npm run deploy     # build + deploy to Cloudflare
```

Live URL: https://template-tiktok.dgtal-crm.workers.dev
