'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types/user';
import Select from 'react-select';
import { env } from '@/lib/config/env';

interface UserFormProps {
    onAddUser: (user: UserProfile) => void;
    onCancel: () => void;
    existingUserIds: string[];
}

export default function UserForm({ onAddUser, onCancel, existingUserIds }: UserFormProps) {
    const { authFetch } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [addMode, setAddMode] = useState<'existing' | 'new'>('existing');
    const [selectedUserId, setSelectedUserId] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        photo: '',
        grade: '',
        commission: '',
        access: '',
    });

    const [gradeOptions, setGradeOptions] = useState<any[]>([]);
    const [commissionOptions, setCommissionOptions] = useState<any[]>([]);
    const [accessOptions, setAccessOptions] = useState<any[]>([]);

    useEffect(() => {
        let mounted = true;
        const loadLists = async () => {
            try {
                const resp = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/lists`);
                if (!mounted) return;
                if (resp.ok) {
                    const data = await resp.json();

                    setGradeOptions(data.grades);
                    setCommissionOptions(data.commissions);
                    setAccessOptions(data.accesses);
                    return;
                }
            } catch (e) {
                // ignore
            }
        };

        loadLists();
        return () => { mounted = false; };
    }, [authFetch]);

    useEffect(() => {
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
    }, [authFetch]);

    const handleSubmit = () => {
        if (addMode === 'existing') {
            if (!selectedUserId) {
                alert('Veuillez sélectionner un utilisateur');
                return;
            }
            const user = users.find(u => u.id === selectedUserId);
            if (!user) return;

            const newBadgeUser: UserProfile = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                pictureFilename: user.pictureFilename,
                role: { id: user.role.id, name: user.role.name }
            };
            onAddUser(newBadgeUser);
        } else {
            if (!formData.firstName || !formData.lastName || !formData.email) {
                alert('Veuillez remplir les champs obligatoires');
                return;
            }

            const newUser: UserProfile = {
                id: Date.now().toString(),
                role: { id: 'default', name: 'Default' },
                ...formData,
            };
            onAddUser(newUser);
        }
    };

    const handleModeChange = (mode: 'existing' | 'new') => {
        setAddMode(mode);
        if (mode === 'existing') {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                photo: '',
                grade: '',
                commission: '',
                access: '',
            });
        } else {
            setSelectedUserId('');
        }
    };

    return (
        <div className="card bg-light mb-4 border-secondary">
            <div className="card-body">
                <h5 className="card-title mb-3">Ajouter un utilisateur</h5>

                <div className="btn-group mb-3 w-100" role="group">
                    <input
                        type="radio"
                        className="btn-check"
                        name="addMode"
                        id="existingMode"
                        checked={addMode === 'existing'}
                        onChange={() => handleModeChange('existing')}
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
                        onChange={() => handleModeChange('new')}
                    />
                    <label className="btn btn-outline-primary" htmlFor="newMode">
                        Nouvel utilisateur
                    </label>
                </div>

                {addMode === 'existing' ? (
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
                                    onChange={(selectedOption: any) => setSelectedUserId(selectedOption?.value || '')}
                                    options={users
                                        .filter(user => !existingUserIds.includes(user.id))
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
                        <div className="col-md-4">
                            <label className="form-label">Grade</label>
                            <Select
                                value={formData.grade ? { value: formData.grade, label: formData.grade } : null}
                                onChange={(opt: any) => setFormData({ ...formData, grade: opt?.value || '' })}
                                options={gradeOptions}
                                isClearable
                                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                menuPosition="fixed"
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Commission</label>
                            <Select
                                value={formData.commission ? { value: formData.commission, label: formData.commission } : null}
                                onChange={(opt: any) => setFormData({ ...formData, commission: opt?.value || '' })}
                                options={commissionOptions}
                                isClearable
                                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                menuPosition="fixed"
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Accès</label>
                            <Select
                                value={formData.access ? { value: formData.access, label: formData.access } : null}
                                onChange={(opt: any) => setFormData({ ...formData, access: opt?.value || '' })}
                                options={accessOptions}
                                isClearable
                                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                menuPosition="fixed"
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>
                    </div>
                )}

                <div className="d-flex gap-2 mt-3">
                    <button
                        className="btn btn-success"
                        onClick={handleSubmit}
                        disabled={addMode === 'existing' && !selectedUserId}
                    >
                        Ajouter
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={onCancel}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </div>
    );
}