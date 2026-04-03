import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "behold.pictures",
      },
      {
        protocol: "https",
        hostname: "**.behold.pictures",
      },
    ],
  },
};

export default nextConfig;
