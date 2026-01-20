'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export enum Roles {
    ADMIN = 'admin',
    AGENT = 'agent',
    USER = 'user'
}

interface ProtectedPageProps {
    children: ReactNode;
    allowedRoles?: string[] | Roles[];
    redirectTo?: string;
    fallback?: ReactNode;
}

/**
 * Guard - Protection des pages avec ou sans vérification de rôle
 * 
 * @param children - Contenu à protéger
 * @param allowedRoles - Rôles autorisés (optionnel). Si non fourni = juste connexion requise
 * @param redirectTo - URL de redirection si accès refusé (défaut: '/')
 * @param fallback - Composant à afficher au lieu de rediriger
 * 
 * @example
 * // Juste vérifier la connexion
 * <Guard>
 *   <Dashboard />
 * </Guard>
 * 
 * @example
 * // Vérifier un rôle spécifique
 * <Guard allowedRoles={[Roles.ADMIN]}>
 *   <AdminPanel />
 * </Guard>
 * 
 * @example
 * // Vérifier plusieurs rôles
 * <Guard allowedRoles={[Roles.ADMIN, Roles.AGENT]}>
 *   <ModerationPanel />
 * </Guard>
 * 
 * @example
 * // Avec fallback au lieu de redirection
 * <Guard 
 *   allowedRoles={[Roles.ADMIN]}
 *   fallback={<AccessDenied />}
 * >
 *   <AdminPanel />
 * </Guard>
 */
export function Guard({
    children,
    allowedRoles,
    redirectTo = '/',
    fallback
}: ProtectedPageProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (!user) {
            if (!fallback) {
                router.push(redirectTo);
            }
            return;
        }

        if (allowedRoles && allowedRoles.length > 0) {

            allowedRoles.push(Roles.ADMIN);

            const hasPermission = allowedRoles.some(
                role => role.toLowerCase() === user.role.name.toLowerCase()
            );

            if (!hasPermission) {
                if (!fallback) {
                    router.push(redirectTo);
                }
            }
        }
    }, [user, isLoading, allowedRoles, redirectTo, fallback, router]);

    if (isLoading) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="fs-5 text-secondary">Vérification...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        if (fallback) {
            return <>{fallback}</>;
        }
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                <p className="fs-5 text-secondary">Redirection...</p>
            </div>
        );
    }

    if (allowedRoles && allowedRoles.length > 0) {

        allowedRoles.push(Roles.ADMIN);

        const hasPermission = allowedRoles.some(
            role => role.toLowerCase() === user.role.name.toLowerCase()
        );

        if (!hasPermission) {
            if (fallback) {
                return <>{fallback}</>;
            }
            return (
                <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
                    <p className="fs-5 text-secondary">Redirection...</p>
                </div>
            );
        }
    }

    return <>{children}</>;
}
