'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Roles } from '../components/Guard';

export function useHasRole(roleName: string): boolean {
    const { user } = useAuth();

    if (!user) return false;

    return user.role.name.toLowerCase() === roleName.toLowerCase();
}

export function useHasAnyRole(roleNames: string[]): boolean {
    const { user } = useAuth();

    if (!user) return false;

    return user.role.name.toLowerCase() === Roles.ADMIN ? true : roleNames.some(
        role => role.toLowerCase() === user.role.name.toLowerCase()
    );
}

export function useRequireRole(
    allowedRoles: string[],
    redirectTo: string = '/'
): { hasPermission: boolean; isLoading: boolean } {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            // Non connecté
            router.push(redirectTo);
            return;
        }

        if (!isLoading && user) {
            const hasPermission = allowedRoles.some(
                role => role.toLowerCase() === user.role.name.toLowerCase()
            );

            if (!hasPermission) {
                // Pas les bonnes permissions
                router.push(redirectTo);
            }
        }
    }, [user, isLoading, allowedRoles, redirectTo, router]);

    if (isLoading) {
        return { hasPermission: false, isLoading: true };
    }

    if (!user) {
        return { hasPermission: false, isLoading: false };
    }

    const hasPermission = allowedRoles.some(
        role => role.toLowerCase() === user.role.name.toLowerCase()
    );

    return { hasPermission, isLoading: false };
}

export function useCurrentRole(): string | null {
    const { user } = useAuth();
    return user?.role.name || null;
}

export function useRequireAuth(
    redirectTo: string = '/'
): { isAuthenticated: boolean; isLoading: boolean } {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            // Non connecté, rediriger
            router.push(redirectTo);
        }
    }, [user, isLoading, redirectTo, router]);

    if (isLoading) {
        return { isAuthenticated: false, isLoading: true };
    }

    const isAuthenticated = !!user;

    return { isAuthenticated, isLoading: false };
}