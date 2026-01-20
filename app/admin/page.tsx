'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { Guard, Roles } from '../components/Guard';

function AdminPanel() {
  return (
    <div className="card border-primary">
      <div className="card-header bg-primary text-white">
        <h2 className="h4 fw-semibold mb-0">Panneau Administrateur</h2>
      </div>
      <div className="card-body">
        <div className="d-grid gap-2">
          <Link href="/admin/users" className="btn btn-outline-primary">
            Gérer les utilisateurs
          </Link>
          <Link href="/admin/roles" className="btn btn-outline-primary">
            Gérer les rôles
          </Link>
        </div>
      </div>
    </div>
  )
}

function AgentPanel() {
  return (
    <div className="card border-primary">
      <div className="card-header bg-primary text-white">
        <h2 className="h4 fw-semibold mb-0">Panneau Agent</h2>
      </div>
      <div className="card-body">
        <div className="d-grid gap-2">
          <Link href="/admin/badges" className="btn btn-outline-primary">
            Générer des badges
          </Link>
        </div>
      </div>
    </div>
  )
}

function UserPanel() {
  return (
    <div className="d-flex gap-2">
      <div className="w-50">
        <Link href="/profile" className="btn btn-primary w-100">
          Modifier mon profil
        </Link>
      </div>
      <div className="w-50">
        <button onClick={useAuth().logout} className="btn btn-danger w-100">
          Se déconnecter
        </button>
      </div>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="d-grid gap-3">
      <AgentPanel />
      <AdminPanel />
      <UserPanel />
    </div>
  );
}

function AgentDashboard() {
  return (
    <div className="d-grid gap-3">
      <AgentPanel />
      <UserPanel />
    </div>
  );
}

function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role.name.toLowerCase()) {
    case 'admin':
      return <AdminDashboard />;
    case 'agent':
      return <AgentDashboard />;
  }
}

export default function AdminPage() {
  return (
    <Guard
      allowedRoles={[Roles.AGENT]}
      redirectTo='/profile'
    >
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <main className="container">
          <div className="col-12 col-lg-8 mx-auto py-5">
            <h1 className="display-5 fw-bold mb-4 text-dark">Administration</h1>
            <RoleBasedDashboard />
          </div>
        </main>
      </div>
    </Guard>
  );
}

