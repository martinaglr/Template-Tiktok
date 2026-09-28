/**
 * Typed, validated access to environment variables.
 * Every var is optional at the type level — `container.ts` picks a real
 * implementation only when its group is fully populated, and falls back to
 * a mock/console implementation otherwise so local dev needs zero
 * credentials. `requireProdEnv()` is what turns "missing" into a loud
 * startup failure once a real implementation is actually selected.
 */
export type Env = {
  siteUrl: string;
  pixels: {
    metaPixelId: string | undefined;
    tiktokPixelId: string | undefined;
    metaCapiAccessToken: string | undefined;
    tiktokEventsAccessToken: string | undefined;
  };
  flow: {
    apiKey: string | undefined;
    secretKey: string | undefined;
    apiBase: string | undefined;
  };
  email: {
    resendApiKey: string | undefined;
    from: string | undefined;
    merchantNotify: string | undefined;
  };
};

function readEnv(): Env {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    pixels: {
      metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined,
      tiktokPixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || undefined,
      metaCapiAccessToken: process.env.META_CAPI_ACCESS_TOKEN || undefined,
      tiktokEventsAccessToken: process.env.TIKTOK_EVENTS_ACCESS_TOKEN || undefined,
    },
    flow: {
      apiKey: process.env.FLOW_API_KEY || undefined,
      secretKey: process.env.FLOW_SECRET_KEY || undefined,
      apiBase: process.env.FLOW_API_BASE || undefined,
    },
    email: {
      resendApiKey: process.env.RESEND_API_KEY || undefined,
      from: process.env.EMAIL_FROM || undefined,
      merchantNotify: process.env.EMAIL_MERCHANT_NOTIFY || undefined,
    },
  };
}

export const env = readEnv();

/**
 * Call from `container.ts` right before wiring a real (non-mock)
 * implementation. Stays silent outside production so local dev and preview
 * builds never need credentials. Example:
 *
 *   if (env.flow.apiKey && env.flow.secretKey) {
 *     requireProdEnv("FlowPaymentProvider", { FLOW_API_KEY: env.flow.apiKey,
 *       FLOW_SECRET_KEY: env.flow.secretKey, FLOW_API_BASE: env.flow.apiBase });
 *     paymentProvider = new FlowPaymentProvider(env.flow);
 *   }
 */
export function requireProdEnv(
  implementationName: string,
  vars: Record<string, string | undefined>,
): void {
  if (process.env.NODE_ENV !== "production") return;

  const missing = Object.entries(vars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `${implementationName} is selected but missing required env var(s) in production: ${missing.join(", ")}`,
    );
  }
}
