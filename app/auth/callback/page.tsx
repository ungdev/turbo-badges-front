'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHasRole } from '../../hooks/useRole';

export default function AuthCallback() {
    const router = useRouter();
    const hasAgentRoleOrMore = useHasRole('agent');

    useEffect(() => {
        if (hasAgentRoleOrMore) {
            router.push('/admin');
            return;
        }
        router.push('/profile');
    }, [router, hasAgentRoleOrMore]);

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <h2 className="h4 fw-semibold mb-3">Authentification en cours...</h2>
                <p className="text-secondary">Vous allez être redirigé dans un instant.</p>
            </div>
        </div>
    );
}