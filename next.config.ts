import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the portfolio to be deployed anywhere
  output: "standalone",
  // Suppress noisy hydration warnings in dev
  reactStrictMode: true,
};

export default nextConfig;
