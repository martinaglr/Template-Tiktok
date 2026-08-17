# CLAUDE.md — Template-Tiktok (Single-Product Landing Page)

> Working brief for Claude Code. Read this fully before writing any code.
> This is a **prototype for a client demo (deadline: tomorrow)**, but it is
> **also the foundation of the real product**. Do NOT build throwaway code.
> Every "mock" piece tonight must sit behind an interface so the real
> implementation slots in later with **no rewrite of the pages or flow**.

---

## 1. Goal & Context

The client sells a **single physical product** to **cold traffic from TikTok
and Meta ads**. The ad shows a CTA ("Comprar aquí"); the user lands on this
page and should reach payment in **very few clicks**.

We are building **Option A**: a fast, focused single-product landing +
checkout. It must be architected so it can later grow into **Option B** (a
full e-commerce store) without starting over.

**This repo is the seed of the production app.** Prototype ≠ disposable.

### Locked decisions (do not re-litigate)

| Area            | Decision                                                        |
|-----------------|-----------------------------------------------------------------|
| Framework       | **Next.js (App Router, TypeScript)**                            |
| Styling         | **Tailwind CSS**, mobile-first                                  |
| Hosting         | **Cloudflare Workers** (`@opennextjs/cloudflare` adapter)<sup>†</sup>|
| Payments (now)  | **Mock provider** — simulate the redirect, no real money        |
| Payments (later)| **Flow** (flow.cl) — real impl slots behind same interface      |
| Content (now)   | **Placeholders** — hardcoded product config + images in /public |
| Content (later) | **Payload CMS** for product data                                |
| Media (later)   | **Backblaze B2** for images                                     |
| Buy flow        | Product page → **shipping form** → order summary → pay          |
| Language/Money  | **Spanish (Chile) / CLP** (`$12.990`), Chile regiones + comunas |
| Delivery        | **Live URL** on Cloudflare Workers the client opens on their phone |

<sup>†</sup> Originally specified as Cloudflare Pages + `@cloudflare/next-on-pages`. That
adapter is deprecated/unmaintained (no updates since 2024, incompatible with
Next.js 15+), so this was swapped for the current Cloudflare-recommended path
(confirmed 2026-08-15) — `@opennextjs/cloudflare`, deploying to Cloudflare
Workers. Outcome is the same: a free-tier live URL, git-based deploys. Update
this note if you re-verify and the guidance has changed again.

---

## 2. Golden Rules (architecture)

The whole point: **tonight's mock == tomorrow's real thing, same shape.**

1. **Abstraction boundaries are mandatory.** Three seams must exist from day
   one, each an interface with a mock/static implementation now:
   - `PaymentProvider` — `MockPaymentProvider` now → `FlowPaymentProvider` later.
   - `ProductRepository` — `StaticProductRepository` now → `PayloadProductRepository` later.
   - `MediaSource` — local `/public` now → `BackblazeMediaSource` later.
   Pages, components, and API routes talk **only** to these interfaces, never
   to a concrete implementation directly. Wire them up in one place
   (`lib/container.ts` or similar) so swapping is a one-line change.

2. **Typed domain models are the contract.** Define `Product`, `Order`,
   `Customer`, `ShippingAddress`, `Money`, `PaymentResult` once in `types/`.
   Everything speaks these types. Money is stored in **integer CLP** (no
   floats); format for display only.

3. **Server logic in API routes / server actions**, not in the client. The
   mock payment still goes through a real `POST /api/orders` route so the
   client→server contract is real and Flow later drops in server-side.

4. **Mobile-first, fast.** Ad traffic is ~100% mobile. Optimize LCP: hero
   image sized/`next/image`, minimal JS, no layout shift. Target a clean
   Lighthouse mobile score.

5. **Ad-tech hooks from the start.** Meta Pixel + TikTok Pixel placeholders
   and standard events (`ViewContent`, `AddToCart`/`InitiateCheckout`,
   `Purchase`) must be present (behind env-gated IDs). This is non-negotiable
   for a product sold via paid ads.

6. **Env-driven config.** No secrets or IDs hardcoded. Typed `lib/env.ts`
   validates required vars. Ship `.env.example`.

7. Keep it lean tonight, but **never** in a way that forces a rewrite later.
   Deferring ≠ hacking. If unsure, favor the interface.

---

## 3. Target Structure

```
/
├─ CLAUDE.md
├─ .env.example
├─ next.config.mjs
├─ tailwind.config.ts
├─ public/
│  └─ product/            # placeholder product images
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx       # <html lang="es">, pixel scripts, fonts
│  │  ├─ page.tsx         # LANDING (clean product page)
│  │  ├─ checkout/
│  │  │  └─ page.tsx      # shipping form + order summary
│  │  ├─ pago/
│  │  │  ├─ [orderId]/page.tsx   # mock payment screen (simulated Flow)
│  │  │  ├─ exito/page.tsx       # success return
│  │  │  └─ error/page.tsx       # failure return
│  │  └─ api/
│  │     ├─ orders/route.ts      # POST create order -> provider.createOrder()
│  │     └─ pago/confirm/route.ts# payment confirm/return handler (webhook-shaped)
│  ├─ components/         # Hero, Gallery, PriceBlock, Benefits, Reviews,
│  │                      #   StickyCTA, ShippingForm, OrderSummary, PixelScripts
│  ├─ lib/
│  │  ├─ container.ts     # wires interfaces -> current implementations
│  │  ├─ env.ts           # typed env validation
│  │  ├─ money.ts         # CLP formatting/parsing
│  │  ├─ analytics.ts     # pixel event helpers (Meta + TikTok)
│  │  ├─ products/
│  │  │  ├─ types.ts      # ProductRepository interface
│  │  │  ├─ static.ts     # StaticProductRepository (reads product.config.ts)
│  │  │  └─ product.config.ts  # the placeholder product
│  │  ├─ payments/
│  │  │  ├─ types.ts      # PaymentProvider interface + PaymentResult
│  │  │  ├─ mock.ts       # MockPaymentProvider
│  │  │  └─ flow.ts       # FlowPaymentProvider (STUB: signatures + TODOs)
│  │  ├─ orders/
│  │  │  ├─ types.ts      # Order model + OrderRepository interface
│  │  │  └─ cookie.ts     # ephemeral store for the demo (httpOnly cookie)<sup>‡</sup>
│  │  └─ media/
│  │     ├─ types.ts      # MediaSource interface
│  │     └─ local.ts      # LocalMediaSource (/public)
│  └─ types/              # shared domain types
└─ ...
```

Adjust names sensibly if needed, but **keep the seams**.

<sup>‡</sup> `orders/memory.ts` (a module-scope `Map`) was replaced with
`orders/cookie.ts` during Phase 4: Next.js bundles route handlers and page
components as separate module graphs, so a plain in-memory `Map` written in
`POST /api/orders` was invisible to `/pago/[orderId]`'s page render — even in
single-process `next dev`, confirmed by reproducing with curl. The order now
rides in an httpOnly cookie instead. Same `OrderRepository` interface, still
ephemeral/demo-only, still swapped for D1 later.

---

## 4. Interfaces to define (shape now, implement over phases)

```ts
// payments/types.ts
export interface PaymentProvider {
  /** Create a payment for an order; returns where to send the user. */
  createOrder(input: {
    orderId: string;
    amount: number;      // integer CLP
    subject: string;
    email: string;
    returnUrl: string;   // where provider sends user back
  }): Promise<{ redirectUrl: string; providerRef: string }>;

  /** Verify/parse a return or webhook payload into a result. */
  verifyPayment(payload: unknown): Promise<PaymentResult>;
}

export type PaymentResult = {
  orderId: string;
  status: "paid" | "pending" | "rejected";
  providerRef: string;
};
```

- **MockPaymentProvider**: `createOrder` returns `redirectUrl` =
  `/pago/{orderId}` (our own simulated screen with "Pagar" / "Cancelar"
  buttons). `verifyPayment` returns `paid`. Mirrors Flow's create→redirect→
  return→confirm shape so `flow.ts` is a true drop-in.
- **FlowPaymentProvider** (stub tonight, real later): document Flow's real
  flow in comments — `POST /payment/create` with HMAC-SHA256 signed params →
  redirect to `url + "?token="` → user pays → Flow calls our `confirm` URL
  (server-to-server) and redirects user to return URL → we `POST
  /payment/getStatus` to confirm. Leave `TODO` markers; do not call real Flow.

Define `ProductRepository`, `OrderRepository`, and `MediaSource` the same way:
interface + working simple impl now, documented swap target later.

---

## 5. Page specs

**Landing `/` (clean product page, Spanish, mobile-first):**
sticky header w/ product name; hero image; product title + short hook; price
block (CLP, optional "antes $X" strikethrough); primary CTA **"Comprar aquí"**;
3–4 benefit bullets; image gallery (3–5 placeholders); short reviews/social-proof
strip (placeholder ⭐ + names); trust row (envío, garantía, pago seguro);
**sticky bottom "Comprar aquí" bar** on mobile. Fire `ViewContent` on load.
CTA → `/checkout`.

**Checkout `/checkout`:**
Order summary (product, qty=1 default, total CLP) + **shipping form**:
`nombre`, `email`, `teléfono`, `dirección`, `región` (select of Chile's 16
regiones), `comuna` (select dependent on región), optional notas. Client-side
validation. "Pagar" → `POST /api/orders` → redirect to returned `redirectUrl`.
Fire `InitiateCheckout`.

**`/pago/[orderId]` (mock payment screen):**
Simulated payment UI clearly labeled as a demo. "Pagar" → confirm → `/pago/exito`;
"Cancelar" → `/pago/error`. (This screen disappears when real Flow is wired.)

**`/pago/exito`:** thank-you + order ref. Fire `Purchase`.
**`/pago/error`:** friendly retry.

**`POST /api/orders`:** validate body → build `Order` → save via
`OrderRepository` → `paymentProvider.createOrder(...)` → return `{ redirectUrl }`.

**`/api/pago/confirm`:** webhook-shaped handler that calls
`paymentProvider.verifyPayment` and updates order status. (Mock now, Flow later.)

---

## 6. Phased plan

### Phase 0 — Scaffold & deploy skeleton  *(do first, verify live)*
- `create-next-app` (TS, App Router, Tailwind, ESLint, `src/`).
- Add `@opennextjs/cloudflare`; configure `open-next.config.ts` + `wrangler.jsonc`
  where required; add build/deploy scripts.
- Init GitHub repo; **deploy a placeholder page to Cloudflare Workers and
  confirm the live URL loads** before building further.
- Add `.env.example`, `lib/env.ts`, base `<html lang="es">` layout.
- **Checkpoint:** live URL renders "Hello" on mobile.

### Phase 1 — Domain models & seams
- Define all types (`Product`, `Order`, `Customer`, `ShippingAddress`, `Money`,
  `PaymentResult`).
- Define all four interfaces; implement `StaticProductRepository` (+ placeholder
  `product.config.ts`), `MockPaymentProvider`, `OrderRepository` (memory),
  `LocalMediaSource`. Stub `FlowPaymentProvider` with documented TODOs.
- `lib/container.ts` wiring; `lib/money.ts`; Chile regiones/comunas dataset.

### Phase 2 — Landing page UI
- Build the clean product page + all components, responsive, sticky CTA.
- `next/image` for hero/gallery; placeholder images in `/public/product`.
- **Checkpoint:** landing looks good on a phone; CTA routes to /checkout.

### Phase 3 — Checkout & shipping form
- Order summary + validated shipping form (región→comuna dependency).
- Wire "Pagar" → `POST /api/orders`.

### Phase 4 — Payment handoff (mock)
- `/api/orders`, mock redirect to `/pago/[orderId]`, `exito`/`error` pages,
  `/api/pago/confirm`, order status transitions.
- **Checkpoint:** full click-through works end to end on the live URL.

### Phase 5 — Ad-tech & polish
- Meta Pixel + TikTok Pixel (env-gated IDs) with `ViewContent`,
  `InitiateCheckout`, `Purchase` events via `lib/analytics.ts`.
- OG/Twitter meta + favicon (link previews for ads/shares), title/description.
- Loading/empty/error states, basic a11y, mobile QA pass.

### Phase 6 — Deploy final & handoff
- Deploy to Cloudflare Pages; QA on a real phone.
- Short `README` handoff: how to run, env vars, and **exactly what swaps in
  for the real product** (see below).

### Future phases (DOCUMENT, do not build tonight)
- **Flow integration:** implement `FlowPaymentProvider` (create/sign/redirect/
  confirm/getStatus), sandbox then live; env keys.
- **Persistence:** real `OrderRepository` (Cloudflare D1 or Payload).
- **Payload CMS:** `PayloadProductRepository`; product/price/images editable.
- **Backblaze B2:** `BackblazeMediaSource`; migrate images off `/public`.
- **E-commerce expansion (Option B):** multi-product catalog, cart, categories
  — enabled precisely because Product/Order/Payment are already abstracted.

---

## 7. Definition of done (for tomorrow)
- Live Cloudflare Pages URL, mobile-first, Spanish/CLP.
- Full click-through: landing → "Comprar aquí" → checkout+shipping → mock pay →
  success. No real charges.
- Code organized behind the four interfaces; Flow/Payload/Backblaze are
  clearly-marked swap points, not rewrites.
- Pixels present (safe with empty IDs). `.env.example` complete.

## 8. Cost notes
- Cloudflare Pages free tier covers the demo. No paid services tonight.
- Keep dependencies minimal (Next + Tailwind + a small validation lib is enough;
  avoid heavy UI kits).

## 9. Guardrails
- Do **not** call real Flow, take real payments, or commit secrets.
- Do **not** collapse the interfaces "to save time" — they are the deliverable's
  whole point.
- Ask before adding a database or any paid service.
- Verify each Phase checkpoint on the **live URL**, not just locally.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
