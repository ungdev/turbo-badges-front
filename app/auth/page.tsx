'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function HomePage() {
    const { login, signup } = useAuth();
    const router = useRouter();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <main className="container">
                <div className="col-12 col-lg-8 mx-auto py-5">
                    <h1 className="display-5 fw-bold mb-4 text-dark">TurboBadges</h1>
                    <button onClick={login} className="btn btn-primary mb-3 w-100">
                        Connexion SIA
                    </button>
                    <button onClick={signup} className="btn btn-outline-primary mb-3 w-100">
                        Créer mon compte SIA
                    </button>
                    <Link
                        href="/auth/local"
                        className="text-primary text-decoration-none d-flex justify-content-center"
                    >
                        Connexion locale
                    </Link>
                </div>
            </main>
        </div>
    );
}

