'use client';

import { Guard, Roles } from '../../components/Guard';
import Link from 'next/link';

function AdminRolesContent() {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <main className="container">
                <div className="col-12 col-lg-8 mx-auto py-5">
                    <h1 className="display-5 fw-bold mb-4 text-dark">Gestion des rôles</h1>

                    <div className="card">
                        <div className="card-body">
                            <p className="text-secondary mb-4">
                                Cette page permet de gérer les rôles des utilisateurs.
                            </p>

                            <div className="d-grid gap-2">
                                <button className="btn btn-primary">
                                    Créer un nouveau rôle
                                </button>
                                <button className="btn btn-outline-primary">
                                    Voir tous les rôles
                                </button>
                            </div>
                        </div>
                    </div>

                    <Link href="/admin" className="btn btn-secondary mt-4">
                        ← Retour au panneau d'administration
                    </Link>
                </div>
            </main>
        </div>
    );
}

export default function AdminRolesPage() {
    return (
        <Guard
            allowedRoles={[Roles.AGENT]}
            redirectTo='/profile'
        >
            <AdminRolesContent />
        </Guard>
    );
}
