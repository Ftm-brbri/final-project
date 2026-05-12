import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.c2.liara.space",
      },
    ],
    domains: ["maktab-shop.runflare.run"],
  },
};

export default nextConfig;
