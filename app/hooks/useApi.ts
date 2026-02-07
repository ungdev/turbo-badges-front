/**
 * Hook React pour utiliser l'API avec authentification
 * 
 * Ce hook fournit une instance de l'API qui gère automatiquement :
 * - L'ajout du token d'authentification
 * - Le refresh automatique du token
 * - La redirection en cas d'échec d'authentification
 * 
 * @example
 * function MyComponent() {
 *   const api = useApi();
 * 
 *   const loadData = async () => {
 *     const users = await api.users.list();
 *     const profile = await api.auth.getProfile();
 *   };
 * 
 *   return <button onClick={loadData}>Charger</button>;
 * }
 */

'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { createAuthenticatedApi, Api } from '@/lib/api';

export function useApi(): Api {
    const { token } = useAuth();
    const router = useRouter();

    // Fonction pour récupérer le token actuel
    const getToken = () => token;

    // Fonction pour refresh le token
    // Note: Cette logique devrait idéalement être dans AuthProvider
    // Pour l'instant on retourne null, l'AuthProvider gère déjà le refresh
    const onRefreshToken = async () => {
        // Le refresh est déjà géré par AuthProvider
        // Cette fonction sera appelée par le client API en cas de 401
        return null;
    };

    // Fonction appelée en cas d'échec d'authentification
    const onUnauthorized = () => {
        router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname) + '&reason=unauthenticated');
    };

    // Mémorise l'instance de l'API
    const api = useMemo(
        () =>
            createAuthenticatedApi({
                getToken,
                onRefreshToken,
                onUnauthorized,
            }),
        [token] // Recrée l'instance quand le token change
    );

    return api;
}
