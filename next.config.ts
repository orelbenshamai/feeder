import type { NextConfig } from "next";
import path from "path";

/** Slim stand-in for next/dist/build/polyfills/polyfill-module (see src/lib/modern-polyfill.js). */
const modernPolyfill = path.join(__dirname, "src/lib/modern-polyfill.js");

const nextConfig: NextConfig = {
  // Inline CSS into HTML — removes render-blocking stylesheet round-trips.
  // Good fit for Tailwind (small atomic CSS) + first-visit LCP/FCP.
  experimental: {
    inlineCss: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [128, 256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  // Next injects legacy polyfills regardless of browserslist; alias them out.
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": "./src/lib/modern-polyfill.js",
      "next/dist/build/polyfills/polyfill-module": "./src/lib/modern-polyfill.js",
    },
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "../build/polyfills/polyfill-module": modernPolyfill,
      "next/dist/build/polyfills/polyfill-module": modernPolyfill,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src https://pay.hyp.co.il https://icom.yaad.net https://player.vimeo.com https://www.youtube.com https://www.youtube-nocookie.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
