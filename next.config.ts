import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  images: {
    // OpenNext's Cloudflare adapter needs a Cloudflare Images binding (paid)
    // or a custom loader to optimize images server-side; skip that for now
    // and serve assets as-is. Revisit once real product photos land.
    unoptimized: true,
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
