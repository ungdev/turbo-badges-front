
export const env = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
} as const;

export type Env = typeof env;
