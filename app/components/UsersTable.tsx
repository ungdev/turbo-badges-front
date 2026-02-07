'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { badgeStorage, Entry } from '../admin/badges/utils/badgeStorage';
import { UserProfile } from '../types/user';
import { APIOption } from '../types/api';
import { env } from '@/lib/config/env';

interface UsersTableProps {
    users: UserProfile[];
    mode: 'selection' | 'management';
    onEdit?: (user: UserProfile) => void;
    onUpdateEntry?: (entry: Entry) => void;
    onRemove?: (id: string) => void;
    onDelete?: (id: string) => void;
}

function findOptionById(options: APIOption[], val: any): APIOption | null {
    if (val === null || val === undefined) return null;
    const s = String(val);
    let found = options.find(o => String(o.id) === s);
    if (found) return found;
    found = options.find(o => String(o.name) === s);
    return found || null;
}

export default function UsersTable({ users, mode, onEdit, onUpdateEntry, onRemove, onDelete }: UsersTableProps) {
    const [imageVersions, setImageVersions] = useState<Record<string, number>>({});
    const [gradeOptions, setGradeOptions] = useState<APIOption[]>([]);
    const [commissionOptions, setCommissionOptions] = useState<APIOption[]>([]);
    const [accessOptions, setAccessOptions] = useState<APIOption[]>([]);
    const [overrides, setOverrides] = useState<Record<string, { grade?: string; commission?: string; access?: string }>>({});
    const { authFetch } = useAuth();
    const { warning } = useNotifications();

    useEffect(() => {
        const newVersions: Record<string, number> = {};
        users.forEach(user => {
            if (user.pictureFilename) {
                newVersions[user.id] = Date.now();
            }
        });
        setImageVersions(prev => ({ ...prev, ...newVersions }));
    }, [users.map(u => u.pictureFilename).join(',')]);

    useEffect(() => {
        let mounted = true;
        const loadLists = async () => {
            const resp = await authFetch(`${env.apiUrl}/badges/options`);
            if (!mounted) return;
            if (resp.ok) {
                const data = await resp.json();
                setGradeOptions(data.grades ?? data.grade ?? []);
                setCommissionOptions(data.commissions ?? data.commission ?? []);
                setAccessOptions(data.accesses ?? data.access ?? []);
                return;
            } else {
                warning("Impossible de charger les listes de rôles, commissions et accès depuis le serveur.");
            }
        };

        loadLists();
        return () => { mounted = false; };
    }, [authFetch]);

    useEffect(() => {
        try {
            const entries = badgeStorage.loadEntries();
            const map: Record<string, { grade?: string; commission?: string; access?: string }> = {};
            entries.forEach(e => { map[e.id] = { grade: (e as any).grade, commission: e.commission, access: e.access }; });
            setOverrides(map);
        } catch (e) {
            // ignore
        }
    }, []);

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
            onDelete?.(id);
        }
    };

    const handleFieldChange = (user: UserProfile, field: string, value: string | null) => {
        const existing = badgeStorage.loadEntries();
        const updatedEntries = existing.filter(e => e.id !== user.id);
        const entry: Entry = {
            id: user.id,
            grade: (overrides[user.id]?.grade || (user as any).grade) as string | undefined,
            commission: (overrides[user.id]?.commission || (user as any).commission) as string | undefined,
            access: (overrides[user.id]?.access || (user as any).access) as string | undefined,
        };
        (entry as any)[field] = value || undefined;
        updatedEntries.push(entry);
        try {
            badgeStorage.saveEntries(updatedEntries);
        } catch (e) {
            // ignore
        }

        setOverrides(prev => ({ ...prev, [user.id]: { ...(prev[user.id] || {}), [field]: value || undefined } }));

        (typeof (onUpdateEntry) === 'function') && onUpdateEntry(entry);
    };

    const getImageUrl = (userId: string, pictureFilename: string) => {
        const version = imageVersions[userId] || Date.now();
        return `${env.apiUrl}/uploads/pictures/${pictureFilename}?v=${version}`;
    };

    if (users.length === 0) {
        return (
            <div className="alert alert-info text-center py-4">
                {mode === 'selection'
                    ? 'Aucun utilisateur ajouté. Cliquez sur "Ajouter un utilisateur" pour commencer.'
                    : 'Aucun utilisateur trouvé.'}
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover border">
                <thead className="table-primary sticky-top">
                    <tr>
                        <th>Photo</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Grade</th>
                        <th>Commission</th>
                        <th>Accès</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                {user.pictureFilename ? (
                                    <Image
                                        src={getImageUrl(user.id, user.pictureFilename)}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        width={40}
                                        height={40}
                                        className="rounded-circle"
                                        style={{ objectFit: 'cover' }}
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
                            <td style={{ minWidth: 200 }}>
                                <Select
                                    value={findOptionById(gradeOptions, overrides[user.id]?.grade ?? (user as any).grade)}
                                    onChange={(opt: any) => handleFieldChange(user, 'grade', opt?.id || null)}
                                    options={gradeOptions}
                                    getOptionLabel={(o: any) => o.name}
                                    getOptionValue={(o: any) => String(o.id)}
                                    isClearable
                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                    menuPosition="fixed"
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                />
                            </td>
                            <td style={{ minWidth: 200 }}>
                                <Select
                                    value={findOptionById(commissionOptions, overrides[user.id]?.commission ?? (user as any).commission)}
                                    onChange={(opt: any) => handleFieldChange(user, 'commission', opt?.id || null)}
                                    options={commissionOptions}
                                    getOptionLabel={(o: any) => o.name}
                                    getOptionValue={(o: any) => String(o.id)}
                                    isClearable
                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                    menuPosition="fixed"
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                />
                            </td>
                            <td style={{ minWidth: 200 }}>
                                <Select
                                    value={findOptionById(accessOptions, overrides[user.id]?.access ?? (user as any).access)}
                                    onChange={(opt: any) => handleFieldChange(user, 'access', opt?.id || null)}
                                    options={accessOptions}
                                    getOptionLabel={(o: any) => o.name}
                                    getOptionValue={(o: any) => String(o.id)}
                                    isClearable
                                    menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                                    menuPosition="fixed"
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                />
                            </td>
                            <td className="text-center">
                                {onEdit && (
                                    <button
                                        className="btn btn-sm btn-outline-primary me-2"
                                        onClick={() => onEdit(user)}
                                        title="Modifier"
                                    >
                                        ✎ Modifier
                                    </button>
                                )}
                                {mode === 'selection' && onRemove && (
                                    <button
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() => onRemove(user.id)}
                                        title="Retirer de la sélection"
                                    >
                                        ⊖ Retirer
                                    </button>
                                )}
                                {mode === 'management' && onDelete && (
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                                        title="Supprimer définitivement"
                                    >
                                        🗑 Supprimer
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}