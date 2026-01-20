'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User } from '../types/user';
import { Roles } from './Guard';
import { useHasRole } from '../hooks/useRole';

interface ProfileCardProps {
    user: User;
    onUploadPhoto: (file: File) => Promise<void>;
    onUpdateProfile: (data: { firstName: string; lastName: string }) => Promise<void>;
    onLogout: () => void;
    goBacktoAdminPanel?: boolean;
}

export default function ProfileCard({ user, onUploadPhoto, onUpdateProfile, onLogout, goBacktoAdminPanel = false }: ProfileCardProps) {
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

    useEffect(() => {
        setFirstName(user.firstName);
        setLastName(user.lastName);
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
            await onUploadPhoto(selectedFile);
            setSuccess('Photo de profil mise à jour avec succès!');
            setSelectedFile(null);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            setError(err.message || 'Erreur lors de l\'upload de la photo');
        } finally {
            setUploading(false);
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

    const handleLogoutClick = () => {
        onLogout();
    };

    return (
        <div className="card shadow">
            <div className="card-body p-5">
                <h1 className="card-title mb-4">Mon Profil</h1>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
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
                        {success}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSuccess('')}
                        ></button>
                    </div>
                )}

                {/* Photo Section */}
                <div>
                    <h5 className="mb-3">Photo de Profil</h5>
                    <div className="row">
                        <div className="col-md-4 text-center mb-3">
                            <div
                                style={{
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
                                    <img
                                        src={photoPreview}
                                        alt="Profile"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <div className="text-muted">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="50"
                                            height="50"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 5a4.474 4.474 0 0 1-.08-1.38c.076-.265.17-.638.28-1.052.154-.537.232-.892.32-1.039.205-.368.718-.568 1.762-.568.531 0 1.16.125 1.52.32.362.194.547.403.647.643.064.122.133.288.22.603.087.415.181.768.281 1.052.148.416.227.89.246 1.217.024.272.044.586.063.934.039.735.008 1.25-.018 1.863-.034.572-.089 1.005-.146 1.497-.05.457-.1.954-.157 1.488-.079.79-.131 1.467-.182 1.694-.052.236-.325.456-.631.456-.933 0-1.961-.968-2.846-2.028-.6.771-1.379 1.552-2.215 2.1-.846.558-1.79.96-2.676.96-.656 0-1.156-.037-1.453-.229-.297-.191-.572-.717-.572-1.457 0-.656.125-1.513.26-2.752.135-1.23.582-2.908 1.04-4.09.187-.52.392-1.062.608-1.499.216-.437.457-.816.747-1.101.29-.285.64-.57 1.042-.788.4-.217.896-.434 1.466-.588.57-.155 1.231-.27 1.974-.27z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-8">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handlePhotoSelect}
                                    accept="image/*"
                                    className="form-control mb-3"
                                    disabled={uploading}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUploadPhoto}
                                    disabled={!selectedFile || uploading}
                                >
                                    {uploading ? 'Upload en cours...' : 'Télécharger la photo'}
                                </button>
                                <p className="text-muted small mt-2">
                                    Format: JPG, PNG, GIF. Taille max: 5MB
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Info Section */}
                    <div className="mb-4">
                        <h5 className="mb-3">Informations du Profil</h5>
                        {!hasAdminRole && (
                            <small className="text-muted">
                                Les informations ci-dessous ne sont pas modifiables via l'interface.
                                <br />
                                Contactez les administrateurs pour toute modification.
                            </small>
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
                            <label htmlFor="email" className="form-label">
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
                            <label htmlFor="firstname" className="form-label">
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
                            <label htmlFor="lastname" className="form-label">
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
                            <label htmlFor="id" className="form-label">
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
                            <label htmlFor="role" className="form-label">
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
                    </div>

                    {hasAdminRole && (
                        <button
                            className="btn btn-success mb-3"
                            onClick={handleUpdateProfile}
                            disabled={updatingProfile}
                        >
                            {updatingProfile ? 'Enregistrement en cours...' : 'Enregistrer'}
                        </button>
                    )}

                    <hr />

                    {goBacktoAdminPanel && (
                        <Link href="/admin" className="btn btn-secondary mb-2 w-100">
                            Retour au panneau d'administration
                        </Link>
                    )}

                    <button
                        className="btn btn-danger w-100"
                        onClick={handleLogoutClick}
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    );
}
