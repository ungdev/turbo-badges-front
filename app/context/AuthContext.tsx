'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
}

export interface Role {
    id: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: () => void;
    logout: () => void;
    updateProfile: (data: {
        firstName?: string;
        lastName?: string;
    }) => Promise<void>;
    uploadProfilePhoto: (file: File) => Promise<void>;
    isLoading: boolean;
    authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const refreshTimeoutRef = (require('react') as typeof import('react')).useRef<number | null>(null);

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
        const lead = 60; // 1 min before expiry
        const ms = Math.max(0, (exp - now - lead) * 1000);
        if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = window.setTimeout(() => {
            void refreshAccess();
        }, ms);
    };

    const refreshAccess = async (): Promise<string | null> => {
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!resp.ok) return null;
            const data = await resp.json();
            const access = data.access_token as string;
            setToken(access);
            scheduleProactiveRefresh(access);
            return access;
        } catch {
            return null;
        }
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
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
            console.error('Erreur lors de la récupération du profil:', error);
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth`;
    };

    const logout = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        }).finally(() => {
            if (refreshTimeoutRef.current) window.clearTimeout(refreshTimeoutRef.current);
            setToken(null);
            setUser(null);
        });
    };

    const updateProfile = async (data: {
        firstName?: string;
        lastName?: string;
    }) => {
        try {
            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
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

    const uploadProfilePhoto = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('photo', file);

            const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile/photo`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Photo upload failed');
            }

            const result = await response.json();
            setUser(result.user);
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
            if (!access) return res;
            res = await doFetch(access);
        }
        return res;
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateProfile, uploadProfilePhoto, isLoading, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
