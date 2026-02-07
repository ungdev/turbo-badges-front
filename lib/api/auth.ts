/**
 * API endpoints pour l'authentification
 */

import { ApiClient } from './client';
import type { LoginResponse, User } from '@/app/types';

export class AuthApi {
    constructor(private client: ApiClient) { }

    /**
     * Refresh le token d'authentification
     */
    async refresh(): Promise<LoginResponse> {
        return this.client.post<LoginResponse>('/auth/refresh', undefined, {
            skipAuth: true,
        });
    }

    /**
     * Connexion locale avec email/password
     */
    async loginLocal(email: string, password: string): Promise<LoginResponse> {
        return this.client.post<LoginResponse>(
            '/auth/local/login',
            { email, password },
            { skipAuth: true }
        );
    }

    /**
     * Déconnexion
     */
    async logout(): Promise<void> {
        return this.client.post<void>('/auth/logout');
    }

    /**
     * Récupère le profil de l'utilisateur connecté
     */
    async getProfile(): Promise<User> {
        return this.client.get<User>('/users/me/profile');
    }

    /**
     * Redirection vers OAuth signup
     */
    redirectToSignup(): void {
        window.location.href = `${this.client['baseUrl']}/auth/oauth/signup`;
    }

    /**
     * Redirection vers OAuth login
     */
    redirectToLogin(): void {
        window.location.href = `${this.client['baseUrl']}/auth/oauth`;
    }
}
