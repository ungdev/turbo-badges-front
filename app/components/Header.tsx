'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    rightButton?: React.ReactNode;
}

export default function Header({ rightButton }: HeaderProps) {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-light bg-white shadow-sm">
            <div className="container">
                <Link href="/" className="navbar-brand d-flex align-items-center mb-0 text-decoration-none">
                    <span className="display-6 fw-bold text-primary me-1">TurboBadges</span>
                    <span className="fs-5 text-muted me-2">by</span>
                    <Image src="/ung_dark.png" alt="UNG" width={80} height={40} />
                </Link>
                {rightButton ? (
                    rightButton
                ) : user ? (
                    <button onClick={logout} className="btn btn-danger">
                        Déconnexion
                    </button>
                ) : (
                    <Link href="/auth" className="btn btn-primary">
                        Connexion
                    </Link>
                )}
            </div>
        </nav>
    );
}
