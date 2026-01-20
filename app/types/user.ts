export interface Role {
    id: string;
    name: string;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
}

export interface User extends UserProfile {
    photoFilename?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UpdateUserInput {
    firstName?: string;
    lastName?: string;
}
