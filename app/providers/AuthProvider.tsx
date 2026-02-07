'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/context/AuthContext';
import type { User, UpdateUserInput } from '@/app/types';
import { UpdateUserInputWithIdAndRole } from '@/app/types/user';
import { AuthContextType } from '@/app/context/auth.types';
import { env } from '@/lib/config/env';
import { logger } from '@/lib/logger';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const refreshTimeoutRef = useRef<number | null>(null);
    const refreshLastRef = useRef<number | null>(null);
    const refreshingPromiseRef = useRef<Promise<string | null> | null>(null);
    const router = useRouter();

    const decodeJwt = (jwt: string): { exp?: number } => {
        try {
            const parts = jwt.split('.');
            if (parts.length !== 3) return {};
            const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const json = typeof window !== 'undefined' ? atob(payload) : Buffer.from(payload, 'base64').toString('utf-8');
            return JSON.parse(json);
        } catch {
            return {};
        }
    };

    const scheduleProactiveRefresh = (access: string) => {
        const { exp } = decodeJwt(access);
        if (!exp) return;
        const now = Math.floor(Date.now() / 1000);
        const lead = 60;
        const ms = Math.max(10000, (exp - now - lead) * 1000);
        if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = window.setTimeout(() => {
            void refreshAccess();
        }, ms);
    };

    const refreshAccess = async (): Promise<string | null> => {
        // If a refresh is already in flight, reuse its promise
        if (refreshingPromiseRef.current) return refreshingPromiseRef.current;

        const doRefresh = async (): Promise<string | null> => {
            try {
                const resp = await fetch(`${env.apiUrl}/auth/refresh`, {
                    method: 'POST',
                    credentials: 'include',
                });
                if (!resp.ok) return null;
                const data = await resp.json();
                const access = data.access_token as string;
                setToken(access);
                scheduleProactiveRefresh(access);
                refreshLastRef.current = Date.now();
                return access;
            } catch {
                return null;
            } finally {
                refreshingPromiseRef.current = null;
            }
        };

        const p = doRefresh();
        refreshingPromiseRef.current = p;
        return p;
    };

    useEffect(() => {
        const init = async () => {
            const access = await refreshAccess();
            if (access) await fetchUserProfile(access);
            setIsLoading(false);
        };
        void init();
        return () => {
            if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
        };
    }, []);

    const fetchUserProfile = async (authToken: string) => {
        try {
            const response = await fetch(`${env.apiUrl}/users/me/profile`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                setToken(null);
            }
        } catch (error) {
            logger.error('Erreur lors de la récupération du profil', error, { context: 'AuthProvider' });
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    const signup = () => {
        window.location.href = `${env.apiUrl}/auth/oauth/signup`;
    };

    const login = () => {
        window.location.href = `${env.apiUrl}/auth/oauth`;
    };

    const loginWithLocal = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${env.apiUrl}/auth/local/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                let message = 'Échec de la connexion';
                try {
                    const error = await response.json();
                    if (error.message) message = error.message;
                } catch {
                    // ignore
                }
                throw new Error(message);
            }

            const data = await response.json();
            const access = data.access_token as string;
            setToken(access);
            scheduleProactiveRefresh(access);
            await fetchUserProfile(access);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        fetch(`${env.apiUrl}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        }).finally(() => {
            if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
            setToken(null);
            setUser(null);
        });
    };

    const updateProfile = async (data: UpdateUserInput) => {
        try {
            const response = await authFetch(`${env.apiUrl}/users/me/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Profile update failed');
            }

            const result = await response.json();
            setUser(result.user);
        } catch (error) {
            throw error;
        }
    };

    const updateProfileFromUser = async (data: UpdateUserInputWithIdAndRole): Promise<User> => {
        try {
            const response = await authFetch(`${env.apiUrl}/users/${data.id}/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Profile update failed');
            }

            const result = await response.json();

            return result.user;
        } catch (error) {
            throw error;
        }
    };

    const uploadProfilePicture = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('picture', file);

            const response = await authFetch(`${env.apiUrl}/users/me/picture`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Picture upload failed');
            }

            const result = await response.json();
            setUser(result.user);
        } catch (error) {
            throw error;
        }
    };

    const uploadProfilePictureFromUser = async (file: File, userId: string): Promise<User> => {
        try {
            const formData = new FormData();
            formData.append('picture', file);

            const response = await authFetch(`${env.apiUrl}/users/${userId}/picture`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Picture upload failed');
            }

            const result = await response.json();

            return result.user;
        } catch (error) {
            throw error;
        }
    };

    const deleteProfilePicture = async () => {
        try {

            const response = await authFetch(`${env.apiUrl}/users/me/picture`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Picture delete failed');
            }

            const result = await response.json();
            setUser(result.user);
        } catch (error) {
            throw error;
        }
    };

    const deleteProfilePictureForUser = async (userId: string): Promise<User> => {
        try {

            const response = await authFetch(`${env.apiUrl}/users/${userId}/picture`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Picture delete failed');
            }

            const result = await response.json();

            return result.user;
        } catch (error) {
            throw error;
        }
    };

    const authFetch: AuthContextType['authFetch'] = async (input, init = {}) => {
        const doFetch = async (access: string | null) => {
            const headers = new Headers(init.headers || {});
            if (access) headers.set('Authorization', `Bearer ${access}`);
            return fetch(input, { ...init, headers, credentials: 'include' });
        };
        let access = token;
        let res = await doFetch(access);
        if (res.status === 401) {
            access = await refreshAccess();
            if (!access) {
                logout();
                router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname) + '&reason=unauthenticated');
                return res;
            }
            res = await doFetch(access);
            if (res.status === 401) {
                logout();
                router.push('/auth?redirect=' + encodeURIComponent(window.location.pathname) + '&reason=unauthenticated');
                return res;
            }
        }
        return res;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                loginWithLocal,
                logout,
                signup,
                updateProfile,
                updateProfileFromUser,
                uploadProfilePicture,
                uploadProfilePictureFromUser,
                deleteProfilePicture,
                deleteProfilePictureForUser,
                isLoading,
                authFetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
