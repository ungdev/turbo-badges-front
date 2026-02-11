/**
 * Custom image loader pour Next.js
 * Redirige les URLs d'images publiques vers le service interne K8s
 * pour éviter que Next.js ne tente d'optimiser des images via des IPs privées
 */

import type { ImageLoaderProps } from 'next/image';

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
    console.log('\n🔄 === IMAGE LOADER ===');
    console.log('Input src:', src);
    console.log('Width:', width);
    console.log('Quality:', quality || 75);
    console.log('Window:', typeof window === 'undefined' ? 'SERVER' : 'CLIENT');
    console.log('INTERNAL_API_URL:', process.env.INTERNAL_API_URL || '(non défini)');
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);

    if (typeof window === 'undefined' && process.env.INTERNAL_API_URL) {
        const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (publicApiUrl && src.startsWith(publicApiUrl)) {
            const internalUrl = src.replace(publicApiUrl, process.env.INTERNAL_API_URL);
            const finalUrl = `/_next/image?url=${encodeURIComponent(internalUrl)}&w=${width}&q=${quality || 75}`;
            console.log('✅ REDIRECT: URL publique détectée');
            console.log('   Public URL:', src);
            console.log('   Internal URL:', internalUrl);
            console.log('   Final URL:', finalUrl);
            console.log('======================\n');
            return finalUrl;
        } else {
            console.log('⚠️  NO REDIRECT: URL ne match pas avec publicApiUrl');
            console.log('   publicApiUrl:', publicApiUrl);
            console.log('   src.startsWith(publicApiUrl):', publicApiUrl ? src.startsWith(publicApiUrl) : 'N/A');
        }
    } else {
        console.log('⚠️  NO REDIRECT: Conditions non remplies');
        console.log('   - Côté serveur:', typeof window === 'undefined');
        console.log('   - INTERNAL_API_URL défini:', !!process.env.INTERNAL_API_URL);
    }

    const defaultUrl = `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
    console.log('📤 DEFAULT: Retourne URL sans modification');
    console.log('   Final URL:', defaultUrl);
    console.log('======================\n');
    return defaultUrl;
}
