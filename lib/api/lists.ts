/**
 * API endpoints pour les listes (legacy)
 */

import { ApiClient } from './client';

export interface List {
    id: string;
    name: string;
}

export class ListsApi {
    constructor(private client: ApiClient) { }

    /**
     * Récupère toutes les listes
     */
    async getAll(): Promise<List[]> {
        return this.client.get<List[]>('/lists');
    }
}
