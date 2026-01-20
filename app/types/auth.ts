import { Role, User } from './user';

export interface JWTPayload {
    id: string;
    role: Role;
}

export interface LoginResponse {
    access_token: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
}

export type { User, Role } from './user';
