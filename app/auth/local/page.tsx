'use client';

import { useEffect } from 'react';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useHasRoleOrAdmin } from '@/app/hooks/useRole';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function LocalLoginPage() {
    const { loginWithLocal, isLoading, user } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [alreadyConnected, setAlreadyConnected] = useState(false);

    const hasAgentRoleOrMore = useHasRoleOrAdmin('agent');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await loginWithLocal(email, password);
        } catch (err: any) {
            setError(err?.message || 'Erreur de connexion');
        }
    };

    useEffect(() => {
        if (user) {
            setAlreadyConnected(true);
            if (hasAgentRoleOrMore) {
                router.push('/admin');
                return;
            }
            router.push('/profile');
        }
    }, [user, hasAgentRoleOrMore]);

    if (alreadyConnected) {
        return (
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <h2 className="h4 fw-semibold mb-3">Authentification en cours...</h2>
                    <p className="text-secondary">Vous allez être redirigé dans un instant.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-light">
            <Header rightButton={<span />} />

            <main className="d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            <div className="card shadow-lg border-0 rounded-4">
                                <div className="card-body p-5">
                                    <div className="text-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="bi bi-shield-lock text-warning mb-3" viewBox="0 0 16 16">
                                            <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                                            <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415" />
                                        </svg>
                                        <h1 className="h3 fw-bold text-dark mb-3">Connexion locale</h1>
                                        <div className="alert alert-warning mb-3" role="alert">
                                            <strong><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill me-1" viewBox="0 0 16 16">
                                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                            </svg>
                                                Accès réservé aux administrateurs</strong>
                                            <p className="mb-0 mt-2 small">Cette connexion est exclusivement destinée aux administrateurs de la plateforme. Si vous êtes étudiant ou membre d'une association, veuillez utiliser votre <Link href="/auth" className="alert-link fw-bold">compte SIA</Link>.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                            <input
                                                id="email"
                                                type="email"
                                                className="form-control form-control-lg"
                                                placeholder="admin@example.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="password" className="form-label fw-semibold">Mot de passe</label>
                                            <input
                                                id="password"
                                                type="password"
                                                className="form-control form-control-lg"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        {error && (
                                            <div className="alert alert-danger" role="alert">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill me-2" viewBox="0 0 16 16">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                                                </svg>
                                                {error}
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg w-100 mt-3"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Connexion en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-lock me-2" viewBox="0 0 16 16">
                                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                                    </svg>
                                                    Se connecter
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <Link href="/auth" className="text-primary text-decoration-none">
                                    ← Retour à la connexion SIA
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
