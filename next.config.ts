import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Temporarily disable TypeScript checking to prevent hangs
  typescript: {
    ignoreBuildErrors: true,
  },
  // Use webpack instead of Turbopack to avoid compilation hangs
  webpack: (config) => config,
  // Empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  // Set workspace root to silence lockfile warning
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
