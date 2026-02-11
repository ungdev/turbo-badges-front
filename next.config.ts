import type { NextConfig } from "next";

const getApiUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    return new URL(url);
  } catch {
    throw new Error(`URL invalide pour NEXT_PUBLIC_API_URL: ${url}`);
  }
};

const getInternalApiUrl = () => {
  const internalUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    return new URL(internalUrl);
  } catch {
    throw new Error(`URL invalide pour INTERNAL_API_URL: ${internalUrl}`);
  }
};

const apiUrl = getApiUrl();
const apiHostname = apiUrl.hostname;
const apiProtocol = apiUrl.protocol.replace(':', '') as 'http' | 'https';
const apiPath = apiUrl.pathname.endsWith('/') ? apiUrl.pathname.slice(0, -1) : apiUrl.pathname;
const uploadsPath = apiPath ? `${apiPath}/uploads/**` : '/uploads/**';

const internalApiUrl = getInternalApiUrl();
const internalHostname = internalApiUrl.hostname;
const internalProtocol = internalApiUrl.protocol.replace(':', '') as 'http' | 'https';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/uploads/**',  // Localhost sans prefix en dev
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/uploads/**',  // 127.0.0.1 sans prefix en dev
      },

      {
        protocol: apiProtocol,
        hostname: apiHostname,
        pathname: uploadsPath,
      },

      ...(internalHostname !== apiHostname ? [{
        protocol: internalProtocol,
        hostname: internalHostname,
        pathname: uploadsPath,
      }] : []),

      ...(apiProtocol === 'https' ? [{
        protocol: 'http' as const,
        hostname: apiHostname,
        pathname: uploadsPath,
      }] : []),
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    unoptimized: false,
  },
};

export default nextConfig;
