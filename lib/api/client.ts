/**
 * Client API centralisé
 * 
 * Wrapper autour de fetch avec gestion automatique :
 * - Authentification (Bearer token)
 * - Refresh token automatique
 * - Gestion des erreurs
 * - Base URL configurée
 * - Type-safety
 */

import { env } from '@/lib/config/env';
import { logger } from '@/lib/logger';

/**
 * Options pour les requêtes API
 */
export interface ApiRequestOptions extends RequestInit {
    token?: string | null;
    skipAuth?: boolean;
}

/**
 * Réponse d'erreur de l'API
 */
export interface ApiErrorResponse {
    message: string;
    statusCode?: number;
    error?: string;
}

/**
 * Custom error class pour les erreurs API
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public response?: ApiErrorResponse
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Classe principale du client API
 */
export class ApiClient {
    private baseUrl: string;
    private getToken?: () => string | null;
    private onRefreshToken?: () => Promise<string | null>;
    private onUnauthorized?: () => void;

    constructor(config: {
        baseUrl?: string;
        getToken?: () => string | null;
        onRefreshToken?: () => Promise<string | null>;
        onUnauthorized?: () => void;
    } = {}) {
        this.baseUrl = config.baseUrl || env.apiUrl;
        this.getToken = config.getToken;
        this.onRefreshToken = config.onRefreshToken;
        this.onUnauthorized = config.onUnauthorized;
    }

    /**
     * Construit l'URL complète
     */
    private buildUrl(endpoint: string): string {
        // Si l'endpoint commence par http, l'utiliser tel quel
        if (endpoint.startsWith('http')) {
            return endpoint;
        }

        // Sinon, construire avec la baseUrl
        const base = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;
        const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${base}${path}`;
    }

    /**
     * Effectue une requête HTTP
     */
    private async request<T>(
        endpoint: string,
        options: ApiRequestOptions = {}
    ): Promise<T> {
        const { token, skipAuth, ...fetchOptions } = options;

        // Construction des headers
        const headers = new Headers(fetchOptions.headers);

        // Ajout du token si disponible et non skip
        if (!skipAuth) {
            const authToken = token !== undefined ? token : this.getToken?.();
            if (authToken) {
                headers.set('Authorization', `Bearer ${authToken}`);
            }
        }

        // Ajout du Content-Type par défaut si body présent et pas déjà défini
        if (
            fetchOptions.body &&
            !headers.has('Content-Type') &&
            !(fetchOptions.body instanceof FormData)
        ) {
            headers.set('Content-Type', 'application/json');
        }

        const url = this.buildUrl(endpoint);

        logger.debug(`API Request: ${fetchOptions.method || 'GET'} ${url}`, {
            context: 'ApiClient',
        });

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers,
                credentials: 'include', // Important pour les cookies de refresh token
            });

            // Si 401 et qu'on a une fonction de refresh, essayer de refresh
            if (response.status === 401 && !skipAuth && this.onRefreshToken) {
                logger.debug('Token expired, attempting refresh', {
                    context: 'ApiClient',
                });

                const newToken = await this.onRefreshToken();

                if (newToken) {
                    // Retry avec le nouveau token
                    headers.set('Authorization', `Bearer ${newToken}`);
                    const retryResponse = await fetch(url, {
                        ...fetchOptions,
                        headers,
                        credentials: 'include',
                    });

                    return this.handleResponse<T>(retryResponse);
                } else {
                    // Refresh a échoué
                    this.onUnauthorized?.();
                    throw new ApiError('Unauthorized', 401);
                }
            }

            return this.handleResponse<T>(response);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }

            logger.error('API Request failed', error, {
                context: 'ApiClient',
                metadata: { url, method: fetchOptions.method },
            });

            throw new ApiError(
                'Network error',
                0,
                { message: error instanceof Error ? error.message : 'Unknown error' }
            );
        }
    }

    /**
     * Traite la réponse HTTP
     */
    private async handleResponse<T>(response: Response): Promise<T> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        // Si la réponse est OK
        if (response.ok) {
            // Si pas de contenu (204)
            if (response.status === 204) {
                return undefined as T;
            }

            // Si JSON, parser
            if (isJson) {
                return response.json();
            }

            // Sinon retourner le text
            return response.text() as T;
        }

        // Réponse d'erreur
        let errorData: ApiErrorResponse | null = null;

        if (isJson) {
            try {
                errorData = await response.json();
            } catch {
                // Ignore parsing error
            }
        }

        const message = errorData?.message || response.statusText || 'Request failed';

        logger.error(`API Error: ${response.status} ${message}`, null, {
            context: 'ApiClient',
            metadata: { url: response.url, status: response.status },
        });

        throw new ApiError(message, response.status, errorData || undefined);
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        data?: unknown,
        options?: ApiRequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        data?: unknown,
        options?: ApiRequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        data?: unknown,
        options?: ApiRequestOptions
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

/**
 * Instance par défaut du client API (sans auth)
 * Pour les endpoints publics
 */
export const apiClient = new ApiClient();

/**
 * Crée un client API avec authentification
 * À utiliser dans les composants/hooks avec accès au contexte d'auth
 */
export function createAuthenticatedApiClient(config: {
    getToken: () => string | null;
    onRefreshToken: () => Promise<string | null>;
    onUnauthorized?: () => void;
}): ApiClient {
    return new ApiClient({
        baseUrl: env.apiUrl,
        ...config,
    });
}
