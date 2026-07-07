import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-src https://pay.hyp.co.il https://icom.yaad.net;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
