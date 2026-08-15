/**
 * Typed, validated access to environment variables.
 * All ad-tech IDs are optional so pixels stay dormant until configured
 * (see components/PixelScripts, added in Phase 5).
 */
export type Env = {
  metaPixelId: string | undefined;
  tiktokPixelId: string | undefined;
  siteUrl: string;
};

function readEnv(): Env {
  return {
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined,
    tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || undefined,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  };
}

export const env = readEnv();
