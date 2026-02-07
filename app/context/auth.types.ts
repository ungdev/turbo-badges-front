import type { User, UpdateUserInput } from '@/app/types';
import { UpdateUserInputWithIdAndRole } from '@/app/types/user';

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: () => void;
    loginWithLocal: (email: string, password: string) => Promise<void>;
    logout: () => void;
    signup: () => void;
    updateProfile: (data: UpdateUserInput) => Promise<void>;
    updateProfileFromUser: (data: UpdateUserInputWithIdAndRole) => Promise<User>;
    uploadProfilePicture: (file: File) => Promise<void>;
    uploadProfilePictureFromUser: (file: File, userId: string) => Promise<User>;
    deleteProfilePicture: () => Promise<void>;
    deleteProfilePictureForUser: (userId: string) => Promise<User>;
    isLoading: boolean;
    authFetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
}