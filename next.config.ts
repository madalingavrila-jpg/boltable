import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/boltable",
  assetPrefix: "/boltable/",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
