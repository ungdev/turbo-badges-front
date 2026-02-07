'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { useNotifications } from '../context/NotificationContext';
import { logger } from '@/lib/logger';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HomePage() {
    const { login, signup } = useAuth();
    const { warning } = useNotifications();

    const shownRef = useRef(false);

    useEffect(() => {
        const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
        const reason = searchParams?.get("reason");
        logger.debug(`Auth reason: ${reason}`, { context: 'AuthPage' });
        if (reason === 'unauthenticated' && !shownRef.current) {
            shownRef.current = true;
            logger.debug("Showing unauthenticated warning", { context: 'AuthPage' });
            warning("Vous avez été déconnecté.");
        }
    }, [warning]);

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
                                        <h1 className="display-5 fw-bold text-primary mb-3">Bienvenue</h1>
                                        <p className="text-muted">Connectez-vous pour accéder à votre espace</p>
                                    </div>

                                    <div className="d-grid gap-3">
                                        <button onClick={login} className="btn btn-primary btn-lg py-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-box-arrow-in-right me-2" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z" />
                                                <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                                            </svg>
                                            Connexion SIA
                                        </button>

                                        <button onClick={signup} className="btn btn-outline-primary btn-lg py-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-plus me-2" viewBox="0 0 16 16">
                                                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5" />
                                            </svg>
                                            Créer mon compte SIA
                                        </button>

                                        <div className="text-center mt-3">
                                            <Link
                                                href="/auth/local"
                                                className="text-muted text-decoration-none"
                                            >
                                                <small>Connexion locale pour les administrateurs</small>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <Link href="/" className="text-primary text-decoration-none">
                                    ← Retour à l'accueil
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

