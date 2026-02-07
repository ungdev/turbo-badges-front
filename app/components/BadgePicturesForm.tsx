'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '../types/user';
import { Roles } from './Guard';
import { useHasRole } from '../hooks/useRole';
import { useNotifications } from '@/app/context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { env } from '@/lib/config/env';

interface BadgePicturesFormProps {
    editingOptionId: string | null;
    frontPictureFilename: string;
    backPictureFilename: string;
}

export default function BadgePicturesForm({ editingOptionId, frontPictureFilename, backPictureFilename }: BadgePicturesFormProps) {
    const { authFetch } = useAuth();
    const { success, error, confirm } = useNotifications();

    const [frontFilename, setFrontFilename] = useState<string>(frontPictureFilename);
    const [backFilename, setBackFilename] = useState<string>(backPictureFilename);

    const frontInput = useRef<HTMLInputElement | null>(null);
    const backInput = useRef<HTMLInputElement | null>(null);

    const uploadPicture = async (form: FormData, side: string): Promise<string | null> => {
        try {
            const resp = await authFetch(`${env.apiUrl}/badges/options/access/${editingOptionId}/picture/${side}`, {
                method: 'PUT',
                body: form,
            });
            if (resp.ok) {
                success('Image téléversée avec succès.');
                const data = await resp.json().catch(() => null);
                // serveur devrait renvoyer frontPictureFilename/backPictureFilename ; sinon on gère plus bas
                // BUG ici
                return data?.frontPictureFilename ?? data?.backPictureFilename ?? null;
            } else {
                error('Impossible de téléverser les images sur le serveur.');
                return null;
            }
        } catch (e) {
            error('Erreur lors du téléversement des images.');
            return null;
        }
    };

    const deletePicture = async (side: string): Promise<boolean> => {
        try {
            const resp = await authFetch(`${env.apiUrl}/badges/options/access/${editingOptionId}/picture/${side}`, {
                method: 'DELETE',
            });
            if (resp.ok) {
                success('Image supprimée avec succès.');
                return true;
            } else {
                error('Impossible de supprimer l\'image sur le serveur.');
                return false;
            }
        } catch (e) {
            error('Erreur lors de la suppression de l\'image.');
            return false;
        }
    };

    const handleFrontUpload = async () => {
        const file = frontInput.current?.files?.[0];
        if (!file) { error('Aucun fichier recto sélectionné.'); return; }
        const fd = new FormData();
        fd.append('picture', file);
        const returned = await uploadPicture(fd, 'front');
        const filenameToUse = returned ?? file.name;
        setFrontFilename(`${filenameToUse}?t=${Date.now()}`);
    }

    const handleBackUpload = async () => {
        const file = backInput.current?.files?.[0];
        if (!file) { error('Aucun fichier verso sélectionné.'); return; }
        const fd = new FormData();
        fd.append('picture', file);
        const returned = await uploadPicture(fd, 'back');
        const filenameToUse = returned ?? file.name;
        setBackFilename(`${filenameToUse}?t=${Date.now()}`);
    }

    const handleFrontDelete = async () => {
        const ok = await deletePicture('front');
        if (ok) setFrontFilename('');
    }

    const handleBackDelete = async () => {
        const ok = await deletePicture('back');
        if (ok) setBackFilename('');
    }

    return (
        <div>
            <p>Sélectionnez les images pour le badge (recto / verso)</p>

            <div className="mb-3">
                <label className="form-label">Image recto</label>
                {frontFilename &&
                    <div className="text-center mb-2">
                        <Image
                            src={`${env.apiUrl}/uploads/badges/${frontFilename}`}
                            alt="Image recto"
                            width={200}
                            height={200}
                            className="img-fluid"
                            style={{ maxWidth: '200px', display: 'inline-block', height: 'auto' }}
                        />
                    </div>
                }
                <input type="file" accept="image/*" className="form-control" ref={frontInput} />
                <p className="text-muted small text-center">
                    Format: JPG, PNG, GIF. Taille max: 5MB
                </p>
                <div className="mt-2">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleFrontUpload}
                    >
                        Téléverser
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger ms-2"
                        onClick={handleFrontDelete}
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label">Image verso</label>
                {backFilename &&
                    <div className="text-center mb-2">
                        <Image
                            src={`${env.apiUrl}/uploads/badges/${backFilename}`}
                            alt="Image verso"
                            width={200}
                            height={200}
                            style={{ maxWidth: '200px', display: 'inline-block', height: 'auto' }}
                        />
                    </div>
                }
                <input type="file" accept="image/*" className="form-control" ref={backInput} />
                <p className="text-muted small text-center">
                    Format: JPG, PNG, GIF. Taille max: 5MB
                </p>
                <div className="mt-2">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleBackUpload}
                    >
                        Téléverser
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-danger ms-2"
                        onClick={handleBackDelete}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
}
