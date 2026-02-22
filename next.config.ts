import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium"],
  },
};

export default nextConfig;
