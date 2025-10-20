import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  serverExternalPackages: ["@prisma/client"],

  images: {
    domains: [
      "img.clerk.com", // Clerk user images
      "www.svgrepo.com", // ✅ for external SVG logos (Google / Apple)
    ],
  },

  poweredByHeader: false,
  compress: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
