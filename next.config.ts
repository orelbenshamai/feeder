import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
