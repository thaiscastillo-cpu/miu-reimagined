import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // App 100% por usuario (cookies + RLS): todo se renderiza en cada request.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
