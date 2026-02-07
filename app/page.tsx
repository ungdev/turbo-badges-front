'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import { useHasRoleOrAdmin } from './hooks/useRole';

export default function HomePage() {
    const { login, user } = useAuth();
    const router = useRouter();
    const isAgentOrAdmin = useHasRoleOrAdmin('agent');

    const getRightButton = () => {
        if (!user) {
            return undefined;
        }

        if (isAgentOrAdmin) {
            return (
                <Link href="/admin" className="btn btn-primary">
                    Interface d'administration
                </Link>
            );
        }

        return (
            <Link href="/profile" className="btn btn-primary">
                Mon profil
            </Link>
        );
    };

    return (
        <div className="min-vh-100 bg-light">
            <Header rightButton={getRightButton()} />

            <main>
                <section className="py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <div className="container text-center py-5">
                        <h2 className="display-4 fw-bold mb-4 text-white">Gérez vos badges en toute simplicité</h2>
                        <p className="lead mb-4 fs-4 text-white">
                            TurboBadges est la solution complète pour la gestion des badges d'identification
                            de vos évènements.
                            <br />
                            Rapide, efficace et facile à utiliser.
                        </p>
                    </div>
                </section>

                <section className="py-5 bg-white">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-4 mb-lg-0">
                                <div className="text-center p-5 bg-primary bg-opacity-10 rounded-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" className="bi bi-person-badge text-primary mb-3" viewBox="0 0 16 16">
                                        <path d="M6.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                        <path d="M4.5 0A2.5 2.5 0 0 0 2 2.5V14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2.5A2.5 2.5 0 0 0 11.5 0zM3 2.5A1.5 1.5 0 0 1 4.5 1h7A1.5 1.5 0 0 1 13 2.5v10.795a4.2 4.2 0 0 0-.776-.492C11.392 12.387 10.063 12 8 12s-3.392.387-4.224.803a4.2 4.2 0 0 0-.776.492z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <h3 className="display-6 fw-bold text-primary mb-4">Pour les étudiants</h3>
                                <ul className="list-unstyled fs-5">
                                    <li className="mb-3">
                                        <span className="text-primary fw-bold">✓</span> Gérez vos informations personnelles en ligne
                                    </li>
                                    <li className="mb-3">
                                        <span className="text-primary fw-bold">✓</span> Téléchargez votre photo depuis votre profil
                                    </li>
                                    <li className="mb-3">
                                        <span className="text-primary fw-bold">✓</span> Interface intuitive
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 bg-light">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 order-lg-2 mb-4 mb-lg-0">
                                <div className="text-center p-5 bg-success bg-opacity-10 rounded-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" fill="currentColor" className="bi bi-people-fill text-success mb-3" viewBox="0 0 16 16">
                                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                                    </svg>
                                </div>
                            </div>
                            <div className="col-lg-6 order-lg-1">
                                <h3 className="display-6 fw-bold text-success mb-4">Pour les associations</h3>
                                <ul className="list-unstyled fs-5">
                                    <li className="mb-3">
                                        <span className="text-success fw-bold">✓</span> Gérez tous les badges de vos évènements
                                    </li>
                                    <li className="mb-3">
                                        <span className="text-success fw-bold">✓</span> Créez des rôles personnalisés
                                    </li>
                                    <li className="mb-3">
                                        <span className="text-success fw-bold">✓</span> Exportez et partagez les données facilement
                                    </li>
                                    <li className="mb-3">
                                        <span className="text-success fw-bold">✓</span> Tableau de bord administrateur complet
                                    </li>
                                    <li className="mb-3">
                                        <span className="text-success fw-bold">✓</span> Impression des badges en masse en quelques clics
                                    </li>
                                    <li className="mb-3">
                                        <span className="text-success fw-bold">✓</span> Gestion des droits et permissions
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-5 bg-white text-center">
                    <div className="container">
                        <h3 className="display-6 fw-bold mb-4">Prêt à commencer ?</h3>
                        <p className="lead mb-4">
                            {!user ? 'Rejoignez TurboBadges dès aujourd\'hui' : 'Accédez à votre espace'}
                        </p>
                        {!user ? (
                            <Link
                                href="/auth"
                                className="btn btn-primary btn-lg px-5 py-3"
                            >
                                Se connecter
                            </Link>
                        ) : isAgentOrAdmin ? (
                            <Link
                                href="/admin"
                                className="btn btn-primary btn-lg px-5 py-3"
                            >
                                Interface d'administration
                            </Link>
                        ) : (
                            <Link
                                href="/profile"
                                className="btn btn-primary btn-lg px-5 py-3"
                            >
                                Mon profil
                            </Link>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

