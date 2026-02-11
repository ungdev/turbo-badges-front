import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    // Désactive l'optimisation Next.js car le domaine résout vers une IP privée
    // Next.js bloque ces images pour des raisons de sécurité (protection SSRF)
    unoptimized: true,
  },
};

export default nextConfig;
