/**
 * API endpoints pour les badges
 */

import { ApiClient } from './client';
import type { APIOption, APIOptionWithAccessImagesList } from '@/app/types/api';

export interface BadgeOptions {
    grades?: APIOption[];
    commissions?: APIOption[];
    accesses?: APIOptionWithAccessImagesList[];
}

export interface GenerateBadgePayload {
    users: Array<{
        id: string;
        grade?: string;
        commission?: string;
        access?: string;
    }>;
}

export interface GenerateBadgeResponse {
    url: string;
    filename: string;
}

export class BadgesApi {
    constructor(private client: ApiClient) { }

    /**
     * Récupère les options de badges (grades, commissions, accès)
     */
    async getOptions(): Promise<BadgeOptions> {
        return this.client.get<BadgeOptions>('/badges/options');
    }

    /**
     * Crée une nouvelle option de badge
     */
    async createOption(type: 'grade' | 'commission' | 'access', name: string): Promise<APIOption> {
        return this.client.post<APIOption>(`/badges/options/${type}`, { name });
    }

    /**
     * Supprime une option de badge
     */
    async deleteOption(type: 'grade' | 'commission' | 'access', id: string): Promise<void> {
        return this.client.delete<void>(`/badges/options/${type}/${id}`);
    }

    /**
     * Upload une image de badge (recto/verso)
     */
    async uploadAccessPicture(
        accessId: string,
        side: 'front' | 'back',
        file: File
    ): Promise<{ filename: string }> {
        const formData = new FormData();
        formData.append('picture', file);
        return this.client.put<{ filename: string }>(
            `/badges/options/access/${accessId}/picture/${side}`,
            formData
        );
    }

    /**
     * Supprime une image de badge
     */
    async deleteAccessPicture(accessId: string, side: 'front' | 'back'): Promise<void> {
        return this.client.delete<void>(`/badges/options/access/${accessId}/picture/${side}`);
    }

    /**
     * Génère des badges pour une liste d'utilisateurs
     */
    async generate(payload: GenerateBadgePayload): Promise<GenerateBadgeResponse> {
        return this.client.post<GenerateBadgeResponse>('/badges/generate', payload);
    }

    /**
     * Construit l'URL d'une image de badge
     */
    getBadgeImageUrl(filename: string): string {
        return `${this.client['baseUrl']}/uploads/badges/${filename}`;
    }
}
