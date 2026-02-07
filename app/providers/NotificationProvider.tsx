'use client';

import React from 'react';
import { NotificationContext } from '@/app/context/NotificationContext';
import { toast } from 'sonner';
import { ConfirmOptions } from '@/app/context/notification.types';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const notifications = {
        success: (message: string) => toast.success(message),
        error: (message: string) => toast.error(message),
        info: (message: string) => toast.info(message),
        warning: (message: string) => toast.warning(message),

        confirm: (options: ConfirmOptions) => {
            toast(options.message, {
                description: options.description ?? 'Cette action est irréversible.',
                action: {
                    label: 'Confirmer',
                    onClick: options.onConfirm
                },
                cancel: options.onCancel
                    ? {
                        label: 'Annuler',
                        onClick: options.onCancel
                    }
                    : undefined,
            });
        },
    };

    return (
        <NotificationContext.Provider value={notifications}>
            {children}
        </NotificationContext.Provider>
    );
};
