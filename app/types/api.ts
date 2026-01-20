import { User } from './user';

export interface ApiError {
    message: string;
    statusCode?: number;
}

export interface UserResponse {
    user: User;
}

export interface RefreshTokenResponse {
    access_token: string;
}

export interface UploadPhotoResponse {
    user: User;
    url?: string;
}
