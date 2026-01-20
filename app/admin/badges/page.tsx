'use client';

import { useState, useEffect } from 'react';
import { Guard, Roles } from '../../components/Guard';
import { UserProfile } from '../../types/user';
import { useAuth } from '../../context/AuthContext';
import Select from 'react-select';
import ProfileCard from '../../components/ProfileCard';
import { useHasRole } from '../../hooks/useRole';
import Link from 'next/link';

interface BadgeUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    commission?: string;
    permissions?: string;
}

function BadgesPage() {
    const { authFetch, isLoading, logout } = useAuth();
    const [badgeUsers, setBadgeUsers] = useState<BadgeUser[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [addMode, setAddMode] = useState<'existing' | 'new'>('existing');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingBadgeUserId, setEditingBadgeUserId] = useState<string | null>(null);
    const [editingProfileUser, setEditingProfileUser] = useState<UserProfile | null>(null);
    const [showProfileEditor, setShowProfileEditor] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        photo: '',
        commission: '',
        permissions: '',
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (isLoading) return;

        const fetchUsers = async () => {
            try {
                const response = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [authFetch, isLoading]);

    const handleAddUser = () => {
        if (addMode === 'existing') {
            if (!selectedUserId) {
                alert('Veuillez sélectionner un utilisateur');
                return;
            }
            const user = users.find(u => u.id === selectedUserId);
            if (!user) return;

            const isAlreadyAdded = badgeUsers.some(u => u.id === user.id);
            if (isAlreadyAdded) {
                alert('Cet utilisateur est déjà dans le tableau');
                return;
            }

            const newBadgeUser: BadgeUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                commission: '',
                permissions: '',
            };
            setBadgeUsers([...badgeUsers, newBadgeUser]);
            setSelectedUserId('');
            setShowAddForm(false);
        } else {
            if (!formData.firstName || !formData.lastName || !formData.email) {
                alert('Veuillez remplir les champs obligatoires');
                return;
            }

            if (editingId) {
                setBadgeUsers(badgeUsers.map(u =>
                    u.id === editingId
                        ? { ...u, ...formData }
                        : u
                ));
                setEditingId(null);
            } else {
                const newUser: BadgeUser = {
                    id: Date.now().toString(),
                    ...formData,
                };
                setBadgeUsers([...badgeUsers, newUser]);
            }

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                photo: '',
                commission: '',
                permissions: '',
            });
            setShowAddForm(false);
        }
    };

    const handleEdit = (user: BadgeUser) => {
        const profile = users.find(u => u.id === user.id);

        if (!profile) {
            console.warn('Utilisateur non trouvé dans la liste des utilisateurs chargés');
            return;
        }

        setEditingProfileUser(profile);
        setEditingBadgeUserId(user.id);
        setShowProfileEditor(true);
    };

    const handleRemove = (id: string) => {
        setBadgeUsers(badgeUsers.filter(u => u.id !== id));
    };

    const handleCancel = () => {
        setShowAddForm(false);
        setEditingId(null);
        setAddMode('existing');
        setSelectedUserId('');
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            photo: '',
            commission: '',
            permissions: '',
        });
    };

    const handleProfileCardUpdate = async (data: { firstName: string; lastName: string }) => {
        if (!editingBadgeUserId) return;

        setBadgeUsers(prev =>
            prev.map(u =>
                u.id === editingBadgeUserId
                    ? { ...u, firstName: data.firstName, lastName: data.lastName }
                    : u,
            ),
        );

        setUsers(prev =>
            prev.map(u =>
                u.id === editingBadgeUserId
                    ? { ...u, firstName: data.firstName, lastName: data.lastName }
                    : u,
            ),
        );

        setShowProfileEditor(false);
        setEditingProfileUser(null);
        setEditingBadgeUserId(null);
    };

    const handleProfileCardUploadPhoto = async (file: File) => {
        if (!editingBadgeUserId) return;

        const objectUrl = URL.createObjectURL(file);

        setBadgeUsers(prev =>
            prev.map(u =>
                u.id === editingBadgeUserId
                    ? { ...u, photo: objectUrl }
                    : u,
            ),
        );
    };

    const handleProfileCardClose = () => {
        setShowProfileEditor(false);
        setEditingProfileUser(null);
        setEditingBadgeUserId(null);
    };

    return (
        <Guard
            allowedRoles={[Roles.AGENT]}
            redirectTo='/profile'
        >
            <div className="min-vh-100 bg-light py-5">
                <main className="container-xxl">
                    <div className="col-12 col-lg-10 mx-auto">
                        <Link href="/admin" className="btn btn-secondary mb-2">
                            Retour au panneau d'administration
                        </Link>
                        <div className="card border-primary shadow-sm">
                            <div className="card-header bg-primary text-white">
                                <h1 className="h4 fw-bold mb-0">Générer des badges</h1>
                            </div>

                            <div className="card-body">
                                {!showAddForm && (
                                    <div className="mb-4">
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={() => setShowAddForm(true)}
                                        >
                                            + Ajouter un utilisateur
                                        </button>
                                        <button
                                            className="btn btn-secondary me-2"
                                            onClick={() => { }}
                                            disabled
                                        >
                                            Charger une sauvegarde
                                        </button>
                                        <button
                                            className="btn btn-secondary me-2"
                                            onClick={() => { }}
                                            disabled
                                        >
                                            Enregistrer
                                        </button>
                                    </div>
                                )}

                                {showAddForm && (
                                    <div className="card bg-light mb-4 border-secondary">
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">
                                                {editingId ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                                            </h5>

                                            {!editingId && (
                                                <div className="btn-group mb-3 w-100" role="group">
                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="addMode"
                                                        id="existingMode"
                                                        checked={addMode === 'existing'}
                                                        onChange={() => {
                                                            setAddMode('existing');
                                                            setFormData({
                                                                firstName: '',
                                                                lastName: '',
                                                                email: '',
                                                                photo: '',
                                                                commission: '',
                                                                permissions: '',
                                                            });
                                                        }}
                                                    />
                                                    <label className="btn btn-outline-primary" htmlFor="existingMode">
                                                        Utilisateur existant
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        className="btn-check"
                                                        name="addMode"
                                                        id="newMode"
                                                        checked={addMode === 'new'}
                                                        onChange={() => {
                                                            setAddMode('new');
                                                            setSelectedUserId('');
                                                        }}
                                                    />
                                                    <label className="btn btn-outline-primary" htmlFor="newMode">
                                                        Nouvel utilisateur
                                                    </label>
                                                </div>
                                            )}

                                            {addMode === 'existing' && !editingId ? (
                                                <div className="row g-3">
                                                    <div className="col-12">
                                                        <label className="form-label">Sélectionner un utilisateur *</label>
                                                        {loading ? (
                                                            <div className="alert alert-info">Chargement des utilisateurs...</div>
                                                        ) : users.length > 0 ? (
                                                            <Select
                                                                value={selectedUserId
                                                                    ? {
                                                                        value: selectedUserId,
                                                                        label: users.find((user) => user.id === selectedUserId)
                                                                            ? `${users.find((user) => user.id === selectedUserId)?.firstName} ${users.find((user) => user.id === selectedUserId)?.lastName}`
                                                                            : '',
                                                                    }
                                                                    : null}
                                                                onChange={(selectedOption: any) => setSelectedUserId(selectedOption.value)}
                                                                options={users
                                                                    .filter(user => !badgeUsers.some(bu => bu.id === user.id))
                                                                    .map((user) => ({
                                                                        value: user.id,
                                                                        label: `${user.firstName} ${user.lastName} (${user.email})`,
                                                                    }))}
                                                                className="w-full"
                                                                placeholder="Sélectionner un utilisateur"
                                                                isClearable
                                                                isSearchable
                                                            />
                                                        ) : (
                                                            <div className="alert alert-warning">Aucun utilisateur disponible</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Prénom *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            placeholder="Entrez le prénom"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Nom *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.lastName}
                                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                            placeholder="Entrez le nom"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Email *</label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            placeholder="Entrez l'email"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Photo (URL)</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.photo}
                                                            onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                                                            placeholder="URL de la photo"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Commission</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.commission}
                                                            onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                                                            placeholder="Entrez la commission"
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Permissions</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.permissions}
                                                            onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                                                            placeholder="Entrez les permissions"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {!editingId && (addMode === 'existing' ? (
                                                <div className="d-flex gap-2 mt-3">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={handleAddUser}
                                                        disabled={!selectedUserId}
                                                    >
                                                        Ajouter
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={handleCancel}
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="d-flex gap-2 mt-3">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={handleAddUser}
                                                    >
                                                        Ajouter
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={handleCancel}
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            ))}

                                            {editingId && (
                                                <div className="d-flex gap-2 mt-3">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={handleAddUser}
                                                    >
                                                        Mettre à jour
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={handleCancel}
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Tableau des utilisateurs */}
                                {badgeUsers.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover border">
                                            <thead className="table-primary sticky-top">
                                                <tr>
                                                    <th>Photo</th>
                                                    <th>Prénom</th>
                                                    <th>Nom</th>
                                                    <th>Email</th>
                                                    <th>Commission</th>
                                                    <th>Permissions</th>
                                                    <th className="text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {badgeUsers.map(user => (
                                                    <tr key={user.id}>
                                                        <td>
                                                            {user.photo ? (
                                                                <img
                                                                    src={user.photo}
                                                                    alt={`${user.firstName} ${user.lastName}`}
                                                                    className="rounded-circle"
                                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                                                    style={{ width: '40px', height: '40px', fontSize: '12px' }}
                                                                >
                                                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>{user.firstName}</td>
                                                        <td>{user.lastName}</td>
                                                        <td>{user.email}</td>
                                                        <td>
                                                            <span className="badge bg-info">
                                                                {user.commission || '-'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-warning">
                                                                {user.permissions || '-'}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => handleEdit(user)}
                                                                title="Modifier"
                                                            >
                                                                ✎ Modifier
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleRemove(user.id)}
                                                                title="Supprimer"
                                                            >
                                                                🗑 Supprimer
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center py-4">
                                        {showAddForm ? '' : 'Aucun utilisateur ajouté. Cliquez sur "Ajouter un utilisateur" pour commencer.'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {
                    showProfileEditor && editingProfileUser && (
                        <div
                            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}
                        >
                            <div className="container" style={{ maxWidth: '800px' }}>
                                <div className="row justify-content-center">
                                    <div className="col-12">
                                        <ProfileCard
                                            user={{ ...editingProfileUser }}
                                            onUploadPhoto={handleProfileCardUploadPhoto}
                                            onUpdateProfile={handleProfileCardUpdate}
                                            onLogout={handleProfileCardClose}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div >
        </Guard >
    );
}

export default BadgesPage;

