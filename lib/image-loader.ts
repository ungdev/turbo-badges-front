/**
 * Custom image loader pour Next.js
 * Redirige les URLs d'images publiques vers le service interne K8s
 * pour éviter que Next.js ne tente d'optimiser des images via des IPs privées
 */

import type { ImageLoaderProps } from 'next/image';

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
    if (typeof window === 'undefined' && process.env.INTERNAL_API_URL) {
        const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (publicApiUrl && src.startsWith(publicApiUrl)) {
            const internalUrl = src.replace(publicApiUrl, process.env.INTERNAL_API_URL);
            console.log(`[Image Loader] Redirecting: ${src} -> ${internalUrl}`);
            return `/_next/image?url=${encodeURIComponent(internalUrl)}&w=${width}&q=${quality || 75}`;
        }
    }

    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
}
