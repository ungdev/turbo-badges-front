/**
 * API endpoints pour les utilisateurs
 */

import { ApiClient } from './client';
import type { User, UpdateUserInput, UserResponse } from '@/app/types';
import type { UserProfile } from '@/app/types/user';

export class UsersApi {
    constructor(private client: ApiClient) { }

    /**
     * Liste tous les utilisateurs
     */
    async list(): Promise<UserProfile[]> {
        return this.client.get<UserProfile[]>('/users');
    }

    /**
     * Récupère un utilisateur par ID
     */
    async getById(id: string): Promise<User> {
        return this.client.get<User>(`/users/${id}`);
    }

    /**
     * Met à jour le profil de l'utilisateur connecté
     */
    async updateMyProfile(data: UpdateUserInput): Promise<UserResponse> {
        return this.client.put<UserResponse>('/users/me/profile', data);
    }

    /**
     * Met à jour le profil d'un utilisateur (admin)
     */
    async updateProfile(
        userId: string,
        data: UpdateUserInput & { role?: { id: string; name: string } }
    ): Promise<UserResponse> {
        return this.client.put<UserResponse>(`/users/${userId}/profile`, data);
    }

    /**
     * Upload la photo de profil de l'utilisateur connecté
     */
    async uploadMyPicture(file: File): Promise<UserResponse> {
        const formData = new FormData();
        formData.append('picture', file);
        return this.client.put<UserResponse>('/users/me/picture', formData);
    }

    /**
     * Upload la photo de profil d'un utilisateur (admin)
     */
    async uploadPicture(userId: string, file: File): Promise<UserResponse> {
        const formData = new FormData();
        formData.append('picture', file);
        return this.client.put<UserResponse>(`/users/${userId}/picture`, formData);
    }

    /**
     * Supprime la photo de profil de l'utilisateur connecté
     */
    async deleteMyPicture(): Promise<UserResponse> {
        return this.client.delete<UserResponse>('/users/me/picture');
    }

    /**
     * Supprime la photo de profil d'un utilisateur (admin)
     */
    async deletePicture(userId: string): Promise<UserResponse> {
        return this.client.delete<UserResponse>(`/users/${userId}/picture`);
    }

    /**
     * Construit l'URL d'une photo de profil
     */
    getPictureUrl(filename: string, version?: number): string {
        const v = version || Date.now();
        return `${this.client['baseUrl']}/uploads/pictures/${filename}?v=${v}`;
    }
}
