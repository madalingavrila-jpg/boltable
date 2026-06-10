import type { NextConfig } from "next";

const deployTarget = process.env.SFOOD_DEPLOY_TARGET ?? "pages";
const useGitHubPages = deployTarget === "pages";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(useGitHubPages
    ? {
        basePath: "/boltable",
        assetPrefix: "/boltable/",
      }
    : {}),
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.slack-edge.com",
      },
    ],
  },
};

export default nextConfig;
