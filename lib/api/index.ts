/**
 * Point d'entrée centralisé pour toutes les API
 * 
 * Fournit une interface unifiée pour accéder à tous les endpoints de l'API
 * 
 * @example
 * // Sans authentification (endpoints publics)
 * import { api } from '@/lib/api';
 * const users = await api.users.list();
 * 
 * @example
 * // Avec authentification (utiliser useApi hook dans les composants)
 * const api = useApi();
 * const profile = await api.auth.getProfile();
 */

import { ApiClient, createAuthenticatedApiClient } from './client';
import { AuthApi } from './auth';
import { UsersApi } from './users';
import { BadgesApi } from './badges';
import { ListsApi } from './lists';

/**
 * Classe principale qui regroupe toutes les API
 */
export class Api {
    public auth: AuthApi;
    public users: UsersApi;
    public badges: BadgesApi;
    public lists: ListsApi;

    constructor(private client: ApiClient) {
        this.auth = new AuthApi(client);
        this.users = new UsersApi(client);
        this.badges = new BadgesApi(client);
        this.lists = new ListsApi(client);
    }

    /**
     * Accès direct au client pour cas spéciaux
     */
    get raw(): ApiClient {
        return this.client;
    }
}

/**
 * Instance API par défaut (sans authentification)
 * À utiliser uniquement pour les endpoints publics
 */
export const api = new Api(new ApiClient());

/**
 * Crée une instance API authentifiée
 * À utiliser dans les hooks/composants avec accès au contexte d'auth
 */
export function createAuthenticatedApi(config: {
    getToken: () => string | null;
    onRefreshToken: () => Promise<string | null>;
    onUnauthorized?: () => void;
}): Api {
    const client = createAuthenticatedApiClient(config);
    return new Api(client);
}

// Ré-export des types et classes utiles
export { ApiClient, ApiError } from './client';
export type { ApiRequestOptions, ApiErrorResponse } from './client';
