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
const apiProtocol = apiUrl.protocol.replace(':', '') as 'http' | 'https';
const apiPath = apiUrl.pathname.endsWith('/') ? apiUrl.pathname.slice(0, -1) : apiUrl.pathname;
const uploadsPath = apiPath ? `${apiPath}/uploads/**` : '/uploads/**';

// Logs pour déboguer la configuration
console.log('=== Configuration Next.js Images ===');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('Protocol:', apiProtocol);
console.log('Hostname:', apiHostname);
console.log('API Path:', apiPath);
console.log('Uploads Path:', uploadsPath);

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
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
        pathname: uploadsPath,  // Utilise le path de l'API depuis env
      },
      // Support des deux protocoles si nécessaire
      ...(apiProtocol === 'https' ? [{
        protocol: 'http' as const,
        hostname: apiHostname,
        pathname: uploadsPath,
      }] : []),
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Désactive l'optimisation en développement pour localhost
    // Car Next.js bloque les IPs privées (127.0.0.1) par sécurité
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

// Log des remotePatterns configurés
console.log('Remote Patterns configurés:');
nextConfig.images?.remotePatterns?.forEach((pattern, index) => {
  console.log(`  [${index}] ${pattern.protocol}://${pattern.hostname}${pattern.pathname || '/**'}`);
});
console.log('====================================\n');

export default nextConfig;
