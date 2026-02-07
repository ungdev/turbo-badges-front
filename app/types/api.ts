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

export interface APIOption {
    id: string;
    name: string;
}

export interface APIOptionWithAccessImagesList extends APIOption {
    accessImages: {
        frontPictureFilename: string;
        backPictureFilename: string;
    }[]
}

export interface APIOptionWithPictures extends APIOption {
    frontPictureFilename: string;
    backPictureFilename: string;
}
