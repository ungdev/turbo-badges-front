import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { BadgeUser, filterAndMapUsers } from '../utils/badgeUser';
import { badgeStorage } from '../utils/badgeStorage';
import { useNotifications } from '../../../context/NotificationContext';
import type { Entry } from '../utils/badgeStorage';
import { env } from '@/lib/config/env';

export const useBadgeUsers = () => {
    const { authFetch } = useAuth();
    const { error, success } = useNotifications();
    const [badgeUsers, setBadgeUsers] = useState<BadgeUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const entries = badgeStorage.loadEntries();

                if (entries.length > 0) {
                    const response = await authFetch(`${env.apiUrl}/users`);
                    if (response.ok) {
                        const allUsers = await response.json();
                        const loadedUsers = filterAndMapUsers(allUsers, entries as any);
                        setBadgeUsers(loadedUsers);
                    } else {
                        error('Erreur lors du chargement des utilisateurs');
                    }
                }
            } catch (err) {
                console.error('Erreur lors du chargement des utilisateurs:', err);
                error('Erreur lors du chargement des utilisateurs');
            } finally {
                setIsLoading(false);
            }
        };

        loadUsers();
    }, [authFetch, error]);

    useEffect(() => {
        if (!isLoading) {
            const entries: Entry[] = badgeUsers.map(u => ({
                id: u.id,
                commission: (u as any).commission,
                grade: (u as any).grade,
                access: (u as any).access,
            }));
            badgeStorage.saveEntries(entries);
        }
    }, [badgeUsers, isLoading]);

    const loadFromUserIds = async (userIds: string[], entries?: Entry[]) => {
        try {
            const response = await authFetch(`${env.apiUrl}/users`);
            if (response.ok) {
                const allUsers = await response.json();
                const loadedUsers = entries && entries.length > 0
                    ? filterAndMapUsers(allUsers, entries as any)
                    : filterAndMapUsers(allUsers, userIds as any);
                setBadgeUsers(loadedUsers);
                return loadedUsers.length;
            } else {
                error('Erreur lors du chargement des utilisateurs');
                return 0;
            }
        } catch (err) {
            console.error('Erreur lors du chargement:', err);
            error('Erreur lors du chargement des utilisateurs');
            return 0;
        }
    };

    return {
        badgeUsers,
        setBadgeUsers,
        isLoading,
        loadFromUserIds
    };
};