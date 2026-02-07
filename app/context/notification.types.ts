export interface NotificationContextType {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
    confirm: (options: ConfirmOptions) => void;
}

export type ConfirmOptions = {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    description?: string;
};