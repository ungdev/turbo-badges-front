/**
 * Providers - Composant qui regroupe tous les providers de l'application
 * 
 * Centralise tous les providers (ErrorBoundary, Auth, Notifications, etc.)
 * pour simplifier le layout principal et améliorer l'organisation du code.
 */

'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
import { NotificationProvider } from './NotificationProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { Toaster } from 'sonner';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <NotificationProvider>
                    <Toaster position="top-right" richColors closeButton />
                    {children}
                </NotificationProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}
