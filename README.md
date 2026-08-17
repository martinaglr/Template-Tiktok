# Template-Tiktok

Single-product landing + checkout for cold traffic from TikTok/Meta ads. See
`CLAUDE.md` for the full working brief, architecture, and phased plan.

**Live demo:** https://template-tiktok.dgtal-crm.workers.dev

Full click-through: landing → "Comprar aquí" → checkout + shipping form →
mock payment → success. No real charges — payments are simulated.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in pixel IDs when available
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Env vars

See `.env.example` for the full list. Two things worth knowing:

- All `NEXT_PUBLIC_*` vars (site URL, pixel IDs) are **baked in at build
  time**, not read at runtime. Set them before running `npm run deploy`, not
  as a Cloudflare secret afterwards — a `wrangler secret put` won't reach
  them.
- Pixel IDs are optional. With them empty, `PixelScripts`
  (`components/pixel-scripts.tsx`) renders nothing and `lib/analytics.ts`
  just logs events to the console in dev — safe to ship without them.

## Deploying

This app deploys to Cloudflare Workers via the
[OpenNext Cloudflare adapter](https://opennext.js.org/cloudflare) (see the
hosting footnote in `CLAUDE.md` for why, not Cloudflare Pages +
`@cloudflare/next-on-pages` as originally scoped).

```bash
npm run preview   # build + run once against the real Workers runtime, locally
npm run deploy    # build + deploy to Cloudflare
```

## What swaps in for the real product

Everything mock/placeholder sits behind one of four interfaces, wired up in
**`lib/container.ts`** — that's the only file you touch to swap an
implementation:

| Seam | Now | Swap to | Needs |
|---|---|---|---|
| `PaymentProvider` | `MockPaymentProvider` | `FlowPaymentProvider` (`lib/payments/flow.ts`, stubbed with TODOs) | `FLOW_API_KEY` / `FLOW_SECRET_KEY`, implement create/sign/redirect/confirm/getStatus per the comments in that file |
| `ProductRepository` | `StaticProductRepository` (reads `lib/products/product.config.ts`) | `PayloadProductRepository` | a Payload CMS instance + product schema |
| `OrderRepository` | `CookieOrderRepository` (order rides in an httpOnly cookie — demo-only, see note below) | a D1-backed repository | a Cloudflare D1 database + binding in `wrangler.jsonc` |
| `MediaSource` | `LocalMediaSource` (serves from `/public`) | `BackblazeMediaSource` | a Backblaze B2 bucket + credentials |

None of the pages, components, or API routes import a concrete
implementation directly — they only ever go through these interfaces, so
none of that code needs to change when a swap happens.

**Why `CookieOrderRepository` and not a plain in-memory store:** the obvious
first move (a module-scope `Map`) doesn't actually work — Next.js bundles
route handlers and page components as separate module graphs, so an order
written in `POST /api/orders` was invisible to `/pago/[orderId]`'s page
render, reproduced even in single-process `next dev`. The order now travels
in an httpOnly cookie instead. Same interface either way, so moving to D1
later is a contained change.

## Known follow-ups before running real ads

- **OG image is a placeholder SVG.** Social crawlers (Facebook/Twitter)
  don't reliably render SVG `og:image`. Swap `product.images[0]` for a real
  product photo (any raster format) in `lib/products/product.config.ts`
  once available.
- **`next/image` optimization is off** (`images.unoptimized: true` in
  `next.config.ts`) — Cloudflare's image optimization needs a paid Images
  binding or a custom loader. Fine for placeholder art; worth revisiting
  once real photos are in place.
- **Mobile QA was done by code review, not a real device** — the dev
  sandbox this was built in can't shrink its browser viewport below
  ~1400px. Everything is built mobile-first (Tailwind defaults are the
  mobile styles, `sm:` overrides are larger-screen-only), but give the live
  URL a real run-through on a phone before spending ad budget on it.
