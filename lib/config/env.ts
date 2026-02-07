function getRequiredEnv(key: string, fallback?: string): string {
    const value = process.env[key] || fallback;

    if (!value) {
        throw new Error(
            `Variable d'environnement manquante: ${key}\n` +
            `Veuillez la définir dans votre fichier .env.local`
        );
    }

    return value;
}

function getOptionalEnv(key: string, fallback: string = ''): string {
    return process.env[key] || fallback;
}

function validateUrl(url: string, name: string): string {
    try {
        new URL(url);
        return url;
    } catch {
        throw new Error(
            `URL invalide pour ${name}: ${url}\n` +
            `Veuillez fournir une URL valide (ex: http://localhost:3000)`
        );
    }
}

const NEXT_PUBLIC_API_URL = validateUrl(
    getRequiredEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3000'),
    'NEXT_PUBLIC_API_URL'
);

export const env = {
    apiUrl: NEXT_PUBLIC_API_URL,
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
} as const;

export type Env = typeof env;

// Validation au chargement du module (uniquement si dans le navigateur ou au build)
if (typeof window !== 'undefined' || process.env.NODE_ENV === 'production') {
    // Valide que toutes les variables requises sont présentes
    Object.entries(env).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            console.error(`Configuration invalide pour: ${key}`);
        }
    });
}
