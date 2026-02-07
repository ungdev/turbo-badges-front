'use client';

import { useEffect, useState } from 'react';
import { APIOption, APIOptionWithPictures } from '../types/api';
import { useHasRole } from '../hooks/useRole';

interface OptionsTableProps {
    options: APIOption[] | APIOptionWithPictures[];
    onDelete?: (id: string) => void;
    onUpdateImages?: (id: string) => void;
    type?: string;
}

export default function OptionsTable({ options, onDelete, onUpdateImages, type }: OptionsTableProps) {
    const canDelete = useHasRole('admin');

    return (
        <div className="table-responsive">
            <table className="table table-hover border">
                <thead className="table-primary sticky-top">
                    <tr>
                        <th>Nom</th>
                        <th className="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {options.map(option => (
                        <tr key={option.id}>
                            <td>
                                {option.name}
                            </td>
                            <td className="text-end">
                                {type === 'access' && (option as APIOptionWithPictures).frontPictureFilename && (option as APIOptionWithPictures).backPictureFilename ? (
                                    <span className="badge bg-success text-light me-2">
                                        Images enregistrées
                                    </span>
                                ) : type === 'access' ? (
                                    <span className="badge bg-warning text-light me-2">
                                        Image(s) manquante(s)
                                    </span>
                                ) : null}
                                {onUpdateImages && (
                                    <>
                                        <button
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={() => { onUpdateImages(option.id) }}
                                            title="Modifier les images"
                                        >
                                            Modifier les images
                                        </button>
                                    </>
                                )}
                                {onDelete && canDelete && (
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => { onDelete(option.id) }}
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