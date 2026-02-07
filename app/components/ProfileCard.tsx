'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '../types/user';
import { Roles } from './Guard';
import { useHasRole } from '../hooks/useRole';
import { useNotifications } from '@/app/context/NotificationContext';
import { env } from '@/lib/config/env';

interface ProfileCardProps {
    user: User;
    onUploadPicture: (file: File) => Promise<void>;
    onDeletePicture: () => Promise<void>;
    onUpdateProfile: (data: { firstName: string; lastName: string }) => Promise<void>;
    goBacktoAdminPanel?: boolean;
    onLogout?: () => void;
    onClose?: () => void;
}

export default function ProfileCard({ user, onUploadPicture, onDeletePicture, onUpdateProfile, onLogout, goBacktoAdminPanel = false, onClose }: ProfileCardProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploading, setUploading] = useState(false);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const hasAdminRole = useHasRole(Roles.ADMIN);
    const { confirm } = useNotifications();

    useEffect(() => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setPhotoPreview(user.pictureFilename ? `${env.apiUrl}/uploads/pictures/${user.pictureFilename}` : null);
    }, [user]);

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Veuillez sélectionner un fichier image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('La taille de l\'image ne doit pas dépasser 5MB');
            return;
        }

        setSelectedFile(file);
        setError('');

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUploadPhoto = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError('');
        setSuccess('');

        try {
            await onUploadPicture(selectedFile);
            setSuccess('Photo de profil mise à jour avec succès!');
            setSelectedFile(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'upload de la photo');
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async () => {
        if (!photoPreview) return;

        setError('');
        setSuccess('');

        try {
            confirm({
                message: 'Êtes-vous sûr de vouloir vider la sélection ?',
                onConfirm: async () => {
                    setSelectedFile(null);
                    await onDeletePicture();
                    setSuccess('Photo de profil supprimée avec succès!');
                    setTimeout(() => setSuccess(''), 3000);
                }
            });
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la suppression de la photo');
        }
    };

    const handleUpdateProfile = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            setError('Le prénom et le nom ne peuvent pas être vides');
            return;
        }

        setUpdatingProfile(true);
        setError('');
        setSuccess('');

        try {
            await onUpdateProfile({ firstName, lastName });
            setSuccess('Profil mis à jour avec succès!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de la mise à jour du profil');
        } finally {
            setUpdatingProfile(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-5">
                {onClose && (
                    <div className="d-flex justify-content-end mb-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={onClose}
                        >
                            ✕ Fermer
                        </button>
                    </div>
                )}

                <h1 className="h3 fw-bold text-primary mb-4">Mon Profil</h1>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-circle me-2" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                        </svg>
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError('')}
                        ></button>
                    </div>
                )}

                {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-2" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
                        </svg>
                        {success}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSuccess('')}
                        ></button>
                    </div>
                )}

                <div>
                    {/* Photo de profil */}
                    <section className="mb-5">
                        <div className="d-flex align-items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-camera text-primary me-3" viewBox="0 0 16 16">
                                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z" />
                                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0" />
                            </svg>
                            <h5 className="mb-0 fw-bold">Photo de profil</h5>
                        </div>
                        <div className="row">
                            <div className="col-md-8 text-center mb-3 justify-content-center mx-auto">
                                <div
                                    style={{
                                        position: 'relative',
                                        width: '150px',
                                        height: '150px',
                                        margin: '0 auto',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {photoPreview ? (
                                        <Image
                                            src={photoPreview}
                                            alt="Profile Picture"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            sizes="200px"
                                        />
                                    ) : (
                                        <Image
                                            src="/default-profile.svg"
                                            alt="Default Profile Picture"
                                            fill
                                            style={{
                                                objectFit: 'cover',
                                            }}
                                            sizes="200px"
                                        />
                                    )}
                                </div>
                                <div className="col-12 mt-3">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handlePhotoSelect}
                                        accept="image/*"
                                        className="form-control mb-3"
                                        disabled={uploading}
                                    />
                                    <div className="d-flex gap-2 justify-content-center mb-3">
                                        <button
                                            className="btn btn-success"
                                            onClick={handleUploadPhoto}
                                            disabled={!selectedFile || uploading}
                                        >
                                            {uploading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Upload en cours...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg me-2" viewBox="0 0 16 16">
                                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                                    </svg>
                                                    Enregistrer
                                                </>
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={handleDeletePhoto}
                                            disabled={!photoPreview || uploading}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash me-2" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                            </svg>
                                            Supprimer
                                        </button>
                                    </div>
                                    <p className="text-muted small text-center">
                                        Format: JPG, PNG, GIF. Taille max: 5MB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Informations du profil */}
                    <section className="mb-4">
                        <div className="d-flex align-items-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-vcard text-primary me-3" viewBox="0 0 16 16">
                                <path d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4m4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5M9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8m1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5" />
                                <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96q.04-.245.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1 1 0 0 1 1 12z" />
                            </svg>
                            <h5 className="mb-0 fw-bold">Informations personnelles</h5>
                        </div>
                        {!hasAdminRole && (
                            <div className="alert alert-info mb-3" role="alert">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle me-2" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                </svg>
                                <small>
                                    Les informations ci-dessous ne sont pas modifiables via l'interface.
                                    Contactez les administrateurs pour toute modification.
                                </small>
                            </div>
                        )}
                        {hasAdminRole && (
                            <div className="card mb-3 bg-warning bg-opacity-10 border-warning">
                                <div className="card-body p-2">
                                    <small>
                                        Les informations seront à nouveau synchronisées avec le provider Oauth à la prochaine connexion de l'utilisateur.
                                    </small>
                                </div>
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-semibold">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={user.email}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="firstname" className="form-label fw-semibold">
                                Prénom
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="firstname"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={!hasAdminRole || updatingProfile}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="lastname" className="form-label fw-semibold">
                                Nom
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="lastname"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={!hasAdminRole || updatingProfile}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="id" className="form-label fw-semibold">
                                ID Utilisateur
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="id"
                                value={user.id}
                                disabled
                            />
                            {hasAdminRole && (
                                <small className="text-muted">
                                    Non modifiable.
                                </small>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="role" className="form-label fw-semibold">
                                Rôle
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="role"
                                value={user.role.name}
                                disabled
                            />
                            {hasAdminRole && (
                                <small className="text-muted">
                                    Doit être modifié via le provider Oauth.
                                </small>
                            )}
                        </div>
                    </section>

                    {hasAdminRole && (
                        <button
                            className="btn btn-success mb-3 w-100"
                            onClick={handleUpdateProfile}
                            disabled={updatingProfile}
                        >
                            {updatingProfile ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Enregistrement en cours...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-save me-2" viewBox="0 0 16 16">
                                        <path d="M2 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H9.5a1 1 0 0 0-1 1v7.293l2.646-2.647a.5.5 0 0 1 .708.708l-3.5 3.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L7.5 9.293V2a2 2 0 0 1 2-2H14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2.5a.5.5 0 0 1 0 1z" />
                                    </svg>
                                    Enregistrer les modifications
                                </>
                            )}
                        </button>
                    )}

                    {(goBacktoAdminPanel || onLogout) && <hr className="my-4" />}

                    {goBacktoAdminPanel && (
                        <Link href="/admin" className="btn btn-outline-secondary mb-2 w-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left me-2" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                            </svg>
                            Retour au panneau d'administration
                        </Link>
                    )}

                    {onLogout && (
                        <button
                            className="btn btn-danger w-100"
                            onClick={onLogout}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right me-2" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                            </svg>
                        </button>
                    )}

                </div>
            </div>
        </div >
    );
}
