'use client';

import { useAuth } from './context/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <p className="fs-5 text-secondary">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <main className="container">
        <div className="col-12 col-lg-8 mx-auto py-5">
          <h1 className="display-5 fw-bold mb-4 text-dark">Turbo Badges</h1>

          {user ? (
            <div className="d-grid gap-3">
              <div className="card">
                <div className="card-body">
                  <h2 className="h4 fw-semibold mb-3 text-dark">Profil utilisateur</h2>
                  <div className="text-secondary">
                    <p className="mb-1"><strong>Nom:</strong> {user.name}</p>
                    <p className="mb-1"><strong>Email:</strong> {user.email}</p>
                    {user.preferredUsername && (
                      <p className="mb-1"><strong>Nom d'utilisateur:</strong> {user.preferredUsername}</p>
                    )}
                    {user.groups && user.groups.length > 0 && (
                      <div className="mt-2">
                        <strong>Groupes:</strong>
                        <ul className="mt-1 ms-3">
                          {user.groups.map((group) => (
                            <li key={group}>{group}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Link href="/profile" className="btn btn-primary btn-lg">
                Gérer mon profil
              </Link>

              <button onClick={logout} className="btn btn-danger w-100">
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="d-grid gap-3">
              <p className="fs-5 text-secondary mb-3">
                Bienvenue! Connectez-vous avec OAuth pour accéder à l'application.
              </p>
              <button onClick={login} className="btn btn-primary btn-lg">
                Se connecter avec OAuth
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

