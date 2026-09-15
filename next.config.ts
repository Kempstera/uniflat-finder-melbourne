import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages serves static assets, so the app is exported to ./out
  // instead of deploying the .next build cache (which is not servable).
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
