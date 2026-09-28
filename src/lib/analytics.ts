"use client";

import { env } from "@/lib/env";

type PixelEvent = "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (event: string, params?: Record<string, unknown>) => void };
  }
}

/**
 * Fires a standard event to Meta Pixel + TikTok Pixel. No-ops (console.debug
 * only) until real pixel IDs are set and the base scripts are loaded
 * (see components/PixelScripts, added in Phase 5) — safe to call now so
 * callers don't need to change when pixels go live.
 */
export function trackEvent(event: PixelEvent, params?: Record<string, unknown>) {
  if (!env.pixels.metaPixelId && !env.pixels.tiktokPixelId) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event, params);
    }
    return;
  }
  window.fbq?.("track", event, params);
  window.ttq?.track(event, params);
}
