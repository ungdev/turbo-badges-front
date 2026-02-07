'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useNotifications } from '@/app/context/NotificationContext';
import { Guard, Roles } from '../../components/Guard';
import { APIOption, APIOptionWithAccessImagesList, APIOptionWithPictures } from '@/app/types/api';
import Link from 'next/link';
import OptionsTable from '@/app/components/OptionsTable';
import BadgePicturesForm from '@/app/components/BadgePicturesForm';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { env } from '@/lib/config/env';

function AdminOptionsContent() {
    const [gradeOptions, setGradeOptions] = useState<APIOption[]>([]);
    const [commissionOptions, setCommissionOptions] = useState<APIOption[]>([]);
    const [accessOptions, setAccessOptions] = useState<APIOptionWithPictures[]>([]);
    const [newGradeName, setNewGradeName] = useState<string>('');
    const [newCommissionName, setNewCommissionName] = useState<string>('');
    const [newAccessName, setNewAccessName] = useState<string>('');
    const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
    const { authFetch } = useAuth();
    const { success, error, confirm } = useNotifications();

    useEffect(() => {
        let mounted = true;
        const loadLists = async () => {
            const resp = await authFetch(`${env.apiUrl}/badges/options`);
            if (!mounted) return;
            if (resp.ok) {
                const data = await resp.json();
                setGradeOptions(data.grades ?? []);
                setCommissionOptions(data.commissions ?? []);
                setAccessOptions(data.accesses ? mapAccessAPIToAccessOptions(data.accesses) : []);
                return;
            } else {
                error("Impossible de charger les listes de rôles, commissions et accès depuis le serveur.");
            }
        };

        loadLists();
        return () => { mounted = false; };
    }, [authFetch, editingOptionId]);

    const mapAccessAPIToAccessOptions = (accesses: APIOptionWithAccessImagesList[]): APIOptionWithPictures[] => {
        return accesses.map(access => ({
            id: access.id,
            name: access.name,
            frontPictureFilename: access.accessImages.length > 0 ? access.accessImages[0].frontPictureFilename : '',
            backPictureFilename: access.accessImages.length > 0 ? access.accessImages[0].backPictureFilename : '',
        }));
    }

    const handleCreate = async (type: string, name: string) => {
        if (!name || name.trim() === '') {
            error("Le nom de l'option ne peut pas être vide.");
            return;
        }

        confirm({
            message: "Confirmer la création",
            description: `Êtes-vous sûr de vouloir créer cette option ? Seul un administrateur pourra la supprimer par la suite.`,
            onConfirm: async () => {
                await createOption(type, name.trim());
                if (type === 'grade') {
                    setNewGradeName('');
                } else if (type === 'commission') {
                    setNewCommissionName('');
                } else if (type === 'access') {
                    setNewAccessName('');
                }
            }
        });
    }

    const createOption = async (type: string, name: string) => {
        const resp = await authFetch(`${env.apiUrl}/badges/options/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        if (resp.ok) {
            const newOption = await resp.json();
            if (type === 'grade') {
                setGradeOptions([...gradeOptions, newOption]);
            } else if (type === 'commission') {
                setCommissionOptions([...commissionOptions, newOption]);
            } else if (type === 'access') {
                setAccessOptions([...accessOptions, newOption]);
            }
            success("Option créée avec succès.");
        } else {
            error("Impossible de créer l'option sur le serveur.");
        }
    }

    const handleDelete = async (type: string, id: string) => {
        await confirm({
            message: "Confirmer la suppression",
            description: "Êtes-vous sûr de vouloir supprimer cette option ? Cette action est irréversible et peut affecter les sélections existantes.",
            onConfirm: async () => {
                const resp = await authFetch(`${env.apiUrl}/badges/options/${type}/${id}`, {
                    method: 'DELETE',
                });
                if (resp.ok) {
                    if (type === 'grade') {
                        setGradeOptions(gradeOptions.filter(option => option.id !== id));
                    } else if (type === 'commission') {
                        setCommissionOptions(commissionOptions.filter(option => option.id !== id));
                    } else if (type === 'access') {
                        setAccessOptions(accessOptions.filter(option => option.id !== id));
                    }
                    success("Option supprimée avec succès.");
                } else {
                    error("Impossible de supprimer l'option depuis le serveur.");
                }
            },
        });
    }

    const handleUpdateImages = (id: string) => {
        setEditingOptionId(id);
    }

    return (
        <div className="min-vh-100 bg-light">
            <Header rightButton={
                <Link href="/admin" className="btn btn-outline-primary">
                    Panneau admin
                </Link>
            } />

            <main className="container py-5">
                <div className="col-12 col-lg-10 mx-auto">
                    <div className="mb-4">
                        <Link href="/admin" className="btn btn-link text-decoration-none ps-0">
                            ← Retour au panneau d'administration
                        </Link>
                    </div>

                    <div className="mb-5">
                        <h1 className="display-5 fw-bold text-dark mb-2">Gestion des options de badge</h1>
                        <p className="text-muted">Configurez les rôles, commissions et accès disponibles pour les badges</p>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-award text-primary me-3" viewBox="0 0 16 16">
                                    <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z" />
                                    <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z" />
                                </svg>
                                <h2 className="h4 mb-0 fw-bold">Choix de rôle</h2>
                            </div>

                            <OptionsTable options={gradeOptions} onDelete={(id) => handleDelete('grade', id)} />

                            <div className="d-grid gap-2">
                                <input type="text" value={newGradeName} onChange={(e) => setNewGradeName(e.target.value)} className="form-control" placeholder="Nom du rôle" />
                                <button onClick={() => handleCreate('grade', newGradeName)} className="btn btn-primary">
                                    Créer un nouveau rôle
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4 mb-4">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-people text-success me-3" viewBox="0 0 16 16">
                                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                                </svg>
                                <h2 className="h4 mb-0 fw-bold">Choix de commission</h2>
                            </div>

                            <OptionsTable options={commissionOptions} onDelete={(id) => handleDelete('commission', id)} />

                            <div className="d-grid gap-2">
                                <input type="text" value={newCommissionName} onChange={(e) => setNewCommissionName(e.target.value)} className="form-control" placeholder="Nom de la commission" />
                                <button onClick={() => handleCreate('commission', newCommissionName)} className="btn btn-primary">
                                    Créer une nouvelle commission
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0 rounded-4 mb-5">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-key text-warning me-3" viewBox="0 0 16 16">
                                    <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                                    <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                                </svg>
                                <h2 className="h4 mb-0 fw-bold">Choix d'accès</h2>
                            </div>
                            <OptionsTable
                                options={accessOptions}
                                onDelete={(id) => handleDelete('access', id)}
                                onUpdateImages={handleUpdateImages}
                                type="access"
                            />

                            <div className="d-grid gap-2">
                                <input type="text" value={newAccessName} onChange={(e) => setNewAccessName(e.target.value)} className="form-control" placeholder="Nom de l'accès" />
                                <button onClick={() => handleCreate('access', newAccessName)} className="btn btn-primary">
                                    Créer un nouvel accès
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />

            {editingOptionId && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Gérer les images pour l'accès</h5>
                                <button type="button" className="btn-close" onClick={() => setEditingOptionId(null)}></button>
                            </div>
                            <div className="modal-body">
                                <BadgePicturesForm
                                    editingOptionId={editingOptionId}
                                    frontPictureFilename={accessOptions.find(option => option.id === editingOptionId)?.frontPictureFilename || ''}
                                    backPictureFilename={accessOptions.find(option => option.id === editingOptionId)?.backPictureFilename || ''}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditingOptionId(null)}>Fermer</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminRolesPage() {
    return (
        <Guard
            allowedRoles={[Roles.AGENT]}
            redirectTo='/profile'
        >
            <AdminOptionsContent />
        </Guard>
    );
}
