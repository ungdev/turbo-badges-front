'use client';

import { useState, useRef } from 'react';
import { Guard, Roles } from '../../components/Guard';
import { UserProfile } from '../../types/user';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import ProfileCard from '../../components/ProfileCard';
import UserForm from '../../components/UserForm';
import UsersTable from '../../components/UsersTable';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useBadgeUsers } from './hooks/useBadgeUsers';
import type { Entry } from './utils/badgeStorage';
import { badgeStorage } from './utils/badgeStorage';
import { BadgeUser, isUserAlreadyAdded, findMissingPictures } from './utils/badgeUser';
import { env } from '@/lib/config/env';

function BadgesPage() {
    const { updateProfileFromUser, uploadProfilePictureFromUser, deleteProfilePictureForUser, authFetch } = useAuth();
    const { success, error, warning, confirm } = useNotifications();
    const { badgeUsers, setBadgeUsers, isLoading, loadFromUserIds } = useBadgeUsers();
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProfileUser, setEditingProfileUser] = useState<UserProfile | null>(null);
    const [showProfileEditor, setShowProfileEditor] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAddUser = (user: BadgeUser) => {
        if (isUserAlreadyAdded(badgeUsers, user.id)) {
            warning('Cet utilisateur est déjà dans le tableau');
            return;
        }

        setBadgeUsers([...badgeUsers, user]);
        setShowAddForm(false);
    };

    const handleEdit = (user: BadgeUser) => {
        setEditingProfileUser({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            pictureFilename: user.pictureFilename,
            role: { id: user.role.id, name: user.role.name }
        });
        setShowProfileEditor(true);
    };

    const handleRemove = (id: string) => {
        setBadgeUsers(badgeUsers.filter(u => u.id !== id));
    };

    const handleProfileCardUpdate = async (data: { firstName: string; lastName: string }) => {
        if (!editingProfileUser?.id) return;

        try {
            const updatedUser = await updateProfileFromUser({
                id: editingProfileUser.id,
                firstName: data.firstName,
                lastName: data.lastName,
                role: editingProfileUser.role
            });

            setBadgeUsers(prev =>
                prev.map(u =>
                    u.id === editingProfileUser.id
                        ? { ...u, firstName: updatedUser.firstName, lastName: updatedUser.lastName }
                        : u,
                ),
            );

            success('Profil mis à jour');
            handleProfileCardClose();
        } catch (err) {
            error('Erreur lors de la mise à jour');
        }
    };

    const handleProfileCardUploadPicture = async (file: File) => {
        if (!editingProfileUser?.id) return;

        const updatedUser = await uploadProfilePictureFromUser(file, editingProfileUser.id);

        setBadgeUsers(prev =>
            prev.map(u =>
                u.id === editingProfileUser.id
                    ? { ...u, pictureFilename: updatedUser.pictureFilename }
                    : u,
            ),
        );

        setEditingProfileUser({ ...editingProfileUser, pictureFilename: updatedUser.pictureFilename });
    };

    const handleProfileCardDeletePicture = async () => {
        if (!editingProfileUser?.id) return;

        const updatedUser = await deleteProfilePictureForUser(editingProfileUser.id);

        setBadgeUsers(prev =>
            prev.map(u =>
                u.id === editingProfileUser.id
                    ? { ...u, pictureFilename: undefined }
                    : u,
            ),
        );

        setEditingProfileUser({ ...editingProfileUser, pictureFilename: updatedUser.pictureFilename });
    }

    const handleProfileCardClose = () => {
        setShowProfileEditor(false);
        setEditingProfileUser(null);
    };

    const handleClearSelection = () => {
        confirm({
            message: 'Êtes-vous sûr de vouloir vider la sélection ?',
            onConfirm: () => {
                setBadgeUsers([]);
                success('Sélection vidée');
            }
        });
    };

    const handleDownloadSelection = () => {
        if (badgeUsers.length === 0) {
            warning('Aucun utilisateur à sauvegarder');
            return;
        }

        badgeStorage.downloadFile(badgeUsers.map(u => u.id), badgeUsers.length);
        success(`Fichier téléchargé avec ${badgeUsers.length} utilisateur(s)`);
    };

    const handleUploadSelection = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const parsed = await badgeStorage.parseFile(file);
        if (!parsed) {
            error('Format de fichier invalide');
            return;
        }

        confirm({
            message: `Charger ${parsed.entries.length} utilisateur(s) ?\n\nCette action va remplacer la sélection actuelle (${badgeUsers.length} utilisateur(s)).`,
            onConfirm: async () => {
                badgeStorage.saveEntries(parsed.entries);
                const ids = parsed.entries.map(e => e.id);
                const loadedCount = await loadFromUserIds(ids, parsed.entries as any);
                if (loadedCount > 0) {
                    success(`${loadedCount} utilisateur(s) chargé(s) avec succès`);
                } else {
                    error('Erreur lors de la récupération des utilisateurs');
                }
            },
            description: 'Cette action va remplacer la sélection actuelle.'
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleListMissing = () => {
        const missing = findMissingPictures(badgeUsers);
        if (missing.length === 0) {
            success('Tous les utilisateurs ont une photo');
        } else {
            warning(
                `${missing.length} utilisateur(s) sans photo:\n${missing.map(u => `${u.firstName} ${u.lastName}`).join('\n')}`
            );
        }
    };

    const handleGenerateBadges = async () => {
        if (badgeUsers.length === 0) {
            warning('Aucune sélection');
            return;
        }

        const payload = badgeUsers.map(u => ({
            userId: u.id,
            gradeId: u.grade,
            commissionId: u.commission,
            accessId: u.access,
        }));

        const missingAccess = payload.filter(p => !p.accessId);
        if (missingAccess.length > 0) {
            warning(`${missingAccess.length} utilisateur(s) sans accès sélectionné`);
            return;
        }

        const missingCommission = payload.filter(p => !p.commissionId);
        if (missingCommission.length > 0) {
            warning(`${missingCommission.length} utilisateur(s) sans commission sélectionnée`);
            return;
        }

        try {
            setIsGenerating(true);

            const resp = await authFetch(`${env.apiUrl}/badges/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!resp.ok) {
                const text = await resp.text();
                let errMsg = 'Erreur lors de la génération des badges';
                try {
                    const json = JSON.parse(text);
                    errMsg = json?.message || json?.error || (typeof json === 'string' ? json : errMsg);
                } catch {
                    if (text) errMsg = text;
                }
                throw new Error(errMsg);
            }

            const blob = await resp.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `badges.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            success('Badges générés');
        } catch (e: any) {
            error(e?.message || 'Erreur lors de la génération');
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <Guard allowedRoles={[Roles.AGENT]} redirectTo="/profile">
                <div className="min-vh-100 bg-light py-5 d-flex align-items-center justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            </Guard>
        );
    }

    return (
        <Guard
            allowedRoles={[Roles.AGENT]}
            redirectTo='/profile'
        >
            <div className="min-vh-100 bg-light">
                <Header rightButton={
                    <Link href="/admin" className="btn btn-outline-primary">
                        Panneau admin
                    </Link>
                } />

                <main className="container-fluid py-5">
                    <div className="w-100">
                        <div className="mb-4">
                            <Link href="/admin" className="btn btn-link text-decoration-none ps-0">
                                ← Retour au panneau d'administration
                            </Link>
                        </div>

                        <div className="card shadow-sm border-0 rounded-4">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-printer text-primary me-3" viewBox="0 0 16 16">
                                        <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1" />
                                        <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1" />
                                    </svg>
                                    <h1 className="h3 fw-bold mb-0 text-primary">Générer des badges</h1>
                                </div>

                                <div>
                                    {!showAddForm && (
                                        <div className="mb-4">
                                            <div className="mb-4">
                                                <button
                                                    className="btn btn-primary me-2"
                                                    onClick={() => setShowAddForm(true)}
                                                >
                                                    + Ajouter un utilisateur
                                                </button>
                                                <button
                                                    className="btn btn-success me-2"
                                                    onClick={handleDownloadSelection}
                                                    disabled={badgeUsers.length === 0}
                                                    title="Télécharger la sélection en JSON"
                                                >
                                                    💾 Télécharger ({badgeUsers.length})
                                                </button>
                                                <button
                                                    className="btn btn-info me-2"
                                                    onClick={handleUploadSelection}
                                                    title="Charger une sauvegarde depuis un fichier"
                                                >
                                                    📂 Charger une sauvegarde
                                                </button>
                                                <button
                                                    className="btn btn-warning me-2"
                                                    onClick={handleListMissing}
                                                    disabled={badgeUsers.length === 0}
                                                >
                                                    📷 Lister les badges sans photo
                                                </button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={handleClearSelection}
                                                    disabled={badgeUsers.length === 0}
                                                >
                                                    🗑 Vider la sélection
                                                </button>
                                            </div>
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={handleGenerateBadges}
                                                disabled={isGenerating || badgeUsers.length === 0}
                                            >
                                                {isGenerating ? 'Génération en cours...' : 'Générer les badges'}
                                            </button>
                                        </div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".json"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />

                                    {showAddForm && (
                                        <UserForm
                                            onAddUser={handleAddUser}
                                            onCancel={() => setShowAddForm(false)}
                                            existingUserIds={badgeUsers.map(u => u.id)}
                                        />
                                    )}

                                    <UsersTable
                                        users={badgeUsers}
                                        mode="selection"
                                        onEdit={handleEdit}
                                        onRemove={handleRemove}
                                        onUpdateEntry={(entry: Entry) => {
                                            setBadgeUsers(prev => prev.map(u => {
                                                if (u.id !== entry.id) return u;
                                                const updated = { ...u } as any;
                                                if ('grade' in entry) {
                                                    if ((entry as any).grade === undefined) {
                                                        delete (updated as any).grade;
                                                    } else {
                                                        (updated as any).grade = (entry as any).grade;
                                                    }
                                                }
                                                if ('commission' in entry) {
                                                    if (entry.commission === undefined) {
                                                        delete updated.commission;
                                                    } else {
                                                        updated.commission = entry.commission;
                                                    }
                                                }
                                                if ('access' in entry) {
                                                    if (entry.access === undefined) {
                                                        delete updated.access;
                                                    } else {
                                                        updated.access = entry.access;
                                                    }
                                                }
                                                return updated;
                                            }));
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />

                {showProfileEditor && editingProfileUser && (
                    <div className="modal d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered modal-lg">
                            <div className="modal-content">
                                <ProfileCard
                                    user={{ ...editingProfileUser }}
                                    onUploadPicture={handleProfileCardUploadPicture}
                                    onDeletePicture={handleProfileCardDeletePicture}
                                    onUpdateProfile={handleProfileCardUpdate}
                                    onClose={handleProfileCardClose}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Guard>
    );
}

export default BadgesPage;

