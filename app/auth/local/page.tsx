'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function LocalLoginPage() {
    const { loginWithLocal, isLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await loginWithLocal(email, password);
            router.push('/profile');
        } catch (err: any) {
            setError(err?.message || 'Erreur de connexion');
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <main className="container">
                <div className="col-12 col-lg-6 mx-auto py-5">
                    <h1 className="h3 fw-bold mb-4 text-dark text-center">Connexion locale</h1>
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                        <p className="text-danger text-center">Réservée aux administrateurs de la plateforme</p>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Mot de passe</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="btn btn-primary w-100 mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </button>
                    </form>
                </div>
                <Link
                    href="/auth"
                    className="text-primary text-decoration-none d-flex justify-content-center"
                >
                    Retour
                </Link>
            </main>
        </div>
    );
}
