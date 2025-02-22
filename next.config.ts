import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowMiddlewareResponseBody: true,
  },
};

export default nextConfig;
