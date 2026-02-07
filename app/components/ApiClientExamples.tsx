/**
 * Exemple d'utilisation du client API
 * 
 * Ce fichier montre comment migrer du code utilisant authFetch vers le nouveau client API.
 * 
 * ⚠️ Ce fichier est à titre d'exemple uniquement.
 * Pour l'utiliser, copiez le code dans vos composants existants.
 */

'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/app/hooks/useApi';
import { ApiError } from '@/lib/api';
import type { User, UpdateUserInput } from '@/app/types';
import { useNotifications } from '@/app/context/NotificationContext';

/**
 * Exemple 1 : Liste d'utilisateurs simple
 */
export function UsersList() {
    const api = useApi();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                // ✅ Nouveau : utilisation du client API
                const data = await api.users.list();

                // ❌ Ancien code (authFetch) :
                // const response = await authFetch(`${env.apiUrl}/users`);
                // const data = await response.json();

                setUsers(data);
            } catch (err) {
                if (err instanceof ApiError) {
                    setError(err.message);
                } else {
                    setError('Erreur inconnue');
                }
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [api]);

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <ul className="list-group">
            {users.map(user => (
                <li key={user.id} className="list-group-item">
                    {user.firstName} {user.lastName}
                </li>
            ))}
        </ul>
    );
}

/**
 * Exemple 2 : Formulaire de mise à jour de profil
 */
export function ProfileUpdateForm({ user }: { user: User }) {
    const api = useApi();
    const { success, error } = useNotifications();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data: UpdateUserInput = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
        };

        try {
            setLoading(true);

            // ✅ Nouveau : utilisation du client API
            const response = await api.users.updateMyProfile(data);

            // ❌ Ancien code (authFetch) :
            // const response = await authFetch(`${env.apiUrl}/users/me/profile`, {
            //   method: 'PUT',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(data),
            // });
            // const result = await response.json();

            success('Profil mis à jour avec succès !');
        } catch (err) {
            if (err instanceof ApiError) {
                error(err.message);
            } else {
                error('Erreur lors de la mise à jour');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-3">
            <div className="mb-3">
                <label className="form-label">Prénom</label>
                <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    defaultValue={user.firstName}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Nom</label>
                <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    defaultValue={user.lastName}
                    required
                />
            </div>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
            >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
        </form>
    );
}

/**
 * Exemple 3 : Upload de photo avec preview
 */
export function PhotoUpload({ userId }: { userId: string }) {
    const api = useApi();
    const { success, error } = useNotifications();
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            error('Veuillez sélectionner une image');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            error('La taille de l\'image ne doit pas dépasser 5MB');
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = input?.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            // ✅ Nouveau : utilisation du client API
            await api.users.uploadMyPicture(file);

            // ❌ Ancien code (authFetch) :
            // const formData = new FormData();
            // formData.append('picture', file);
            // const response = await authFetch(`${env.apiUrl}/users/me/picture`, {
            //   method: 'PUT',
            //   body: formData,
            // });
            // const result = await response.json();

            success('Photo uploadée avec succès !');
            setPreview(null);
        } catch (err) {
            if (err instanceof ApiError) {
                error(err.message);
            } else {
                error('Erreur lors de l\'upload');
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card p-3">
            <h5>Upload de photo</h5>

            {preview && (
                <div className="mb-3 text-center">
                    <img src={preview} alt="Preview" style={{ maxWidth: '200px' }} />
                </div>
            )}

            <input
                type="file"
                accept="image/*"
                className="form-control mb-3"
                onChange={handleFileChange}
            />

            <button
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={!preview || uploading}
            >
                {uploading ? 'Upload en cours...' : 'Uploader'}
            </button>
        </div>
    );
}

/**
 * Exemple 4 : Génération de badges
 */
export function BadgeGenerator() {
    const api = useApi();
    const { success, error } = useNotifications();
    const [users, setUsers] = useState<Array<{ id: string; grade?: string; commission?: string; access?: string }>>([]);
    const [generating, setGenerating] = useState(false);

    const handleGenerate = async () => {
        if (users.length === 0) {
            error('Aucun utilisateur sélectionné');
            return;
        }

        try {
            setGenerating(true);

            // ✅ Nouveau : utilisation du client API
            const result = await api.badges.generate({ users });

            // ❌ Ancien code (authFetch) :
            // const response = await authFetch(`${env.apiUrl}/badges/generate`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ users }),
            // });
            // const result = await response.json();

            // Télécharger le fichier
            window.open(result.url, '_blank');
            success('Badges générés avec succès !');
        } catch (err) {
            if (err instanceof ApiError) {
                error(err.message);
            } else {
                error('Erreur lors de la génération');
            }
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="card p-3">
            <h5>Génération de badges</h5>
            <p>Utilisateurs sélectionnés : {users.length}</p>

            <button
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={users.length === 0 || generating}
            >
                {generating ? 'Génération...' : 'Générer les badges'}
            </button>
        </div>
    );
}

/**
 * Exemple 5 : Chargement des options de badges
 */
export function BadgeOptionsLoader() {
    const api = useApi();
    const [grades, setGrades] = useState<string[]>([]);
    const [commissions, setCommissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOptions = async () => {
            try {
                setLoading(true);

                // ✅ Nouveau : utilisation du client API
                const options = await api.badges.getOptions();

                // ❌ Ancien code (authFetch) :
                // const response = await authFetch(`${env.apiUrl}/badges/options`);
                // const options = await response.json();

                setGrades(options.grades?.map(g => g.name) || []);
                setCommissions(options.commissions?.map(c => c.name) || []);
            } catch (err) {
                console.error('Erreur lors du chargement des options', err);
            } finally {
                setLoading(false);
            }
        };

        loadOptions();
    }, [api]);

    if (loading) return <div>Chargement des options...</div>;

    return (
        <div>
            <h5>Grades disponibles :</h5>
            <ul>
                {grades.map((grade, i) => (
                    <li key={i}>{grade}</li>
                ))}
            </ul>

            <h5>Commissions disponibles :</h5>
            <ul>
                {commissions.map((commission, i) => (
                    <li key={i}>{commission}</li>
                ))}
            </ul>
        </div>
    );
}

/**
 * Résumé des avantages du nouveau client API :
 * 
 * 1. ✅ Type-safety complet
 * 2. ✅ Moins de code boilerplate
 * 3. ✅ Gestion automatique des erreurs
 * 4. ✅ Refresh token transparent
 * 5. ✅ Logs automatiques
 * 6. ✅ URLs centralisées
 * 7. ✅ Réutilisabilité
 * 8. ✅ Maintenance simplifiée
 */
