'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [router]);

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <h2 className="h4 fw-semibold mb-3">Authentification en cours...</h2>
                <p className="text-secondary">Vous allez être redirigé dans un instant.</p>
            </div>
        </div>
    );
}
