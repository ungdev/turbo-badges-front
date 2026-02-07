import { UserProfile } from '../../../types/user';

export interface BadgeUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    pictureFilename?: string;
    commission?: string;
    grade?: string;
    access?: string;
    role: { id: string; name: string };
}

export const mapUserProfileToBadgeUser = (user: UserProfile, override?: { commission?: string; grade?: string; access?: string }): BadgeUser => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    pictureFilename: user.pictureFilename,
    commission: override?.commission || '',
    grade: override?.grade || '',
    access: override?.access || '',
    role: { id: user.role.id, name: user.role.name }
});

export const filterAndMapUsers = (allUsers: UserProfile[], userIdsOrEntries: string[] | { id: string; commission?: string; grade?: string; access?: string }[]): BadgeUser[] => {
    const entriesMap: Record<string, { commission?: string; grade?: string; access?: string } | undefined> = {};
    const ids: string[] = [];

    if (Array.isArray(userIdsOrEntries) && userIdsOrEntries.length > 0 && typeof userIdsOrEntries[0] === 'string') {
        (userIdsOrEntries as string[]).forEach(id => ids.push(id));
    } else {
        (userIdsOrEntries as { id: string; commission?: string; grade?: string; access?: string }[]).forEach(e => {
            ids.push(e.id);
            entriesMap[e.id] = { commission: e.commission, grade: (e as any).grade, access: e.access };
        });
    }

    return allUsers
        .filter((user: UserProfile) => ids.includes(user.id))
        .map((user: UserProfile) => mapUserProfileToBadgeUser(user, entriesMap[user.id]));
};

export const isUserAlreadyAdded = (badgeUsers: BadgeUser[], userId: string): boolean => {
    return badgeUsers.some(u => u.id === userId);
};

export const findMissingPictures = (badgeUsers: BadgeUser[]): BadgeUser[] => {
    return badgeUsers.filter(u => !u.pictureFilename);
};