export interface Role {
    id: string;
    name: string;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    pictureFilename?: string;
    role: Role;
}

export interface User extends UserProfile {
    pictureFilename?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UpdateUserInput {
    firstName?: string;
    lastName?: string;
}

export interface UpdateUserInputWithIdAndRole extends UpdateUserInput {
    id: string;
    role: Role;
}
