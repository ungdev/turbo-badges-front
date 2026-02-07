import type { NextConfig } from "next";

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    return new URL(url);
  } catch {
    throw new Error(`URL invalide pour NEXT_PUBLIC_API_URL: ${url}`);
  }
};

const apiUrl = getApiUrl();
const apiHostname = apiUrl.hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: apiHostname,
        pathname: '/uploads/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Désactive l'optimisation en développement pour localhost
    // Car Next.js bloque les IPs privées (127.0.0.1) par sécurité
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
