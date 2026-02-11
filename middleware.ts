import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Intercepter uniquement les requêtes d'optimisation d'images
    if (request.nextUrl.pathname === '/_next/image') {
        const imageUrl = request.nextUrl.searchParams.get('url');

        // Si on a une URL interne configurée et que l'image vient de l'API publique
        if (imageUrl && process.env.INTERNAL_API_URL && process.env.NEXT_PUBLIC_API_URL) {
            if (imageUrl.startsWith(process.env.NEXT_PUBLIC_API_URL)) {
                // Remplacer l'URL publique par l'URL du service K8s interne
                const internalUrl = imageUrl.replace(
                    process.env.NEXT_PUBLIC_API_URL,
                    process.env.INTERNAL_API_URL
                );

                // Créer une nouvelle URL avec l'URL interne
                const newUrl = new URL(request.url);
                newUrl.searchParams.set('url', internalUrl);

                return NextResponse.rewrite(newUrl);
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/_next/image',
};
