const STORAGE_KEY = 'badgeUserEntries';


export type Entry = { id: string; grade?: string; commission?: string; access?: string };

export const badgeStorage = {
    loadEntries: (): Entry[] => {
        if (typeof window === 'undefined') return [];
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        try {
            return JSON.parse(raw) as Entry[];
        } catch (error) {
            console.error('Erreur lors de la lecture des entrées sauvegardées:', error);
            return [];
        }
    },

    saveEntries: (entries: Entry[]): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des entrées:', error);
        }
    },

    downloadFile: (userIds: string[], count: number): void => {
        const entries = ((): Entry[] => {
            if (typeof window === 'undefined') return [];
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return [];
                const all = JSON.parse(raw) as Entry[];
                return all.filter(e => userIds.includes(e.id));
            } catch (e) {
                return [];
            }
        })();

        const dataToExport = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            count,
            userIds,
            entries,
        };

        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `badges-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    parseFile: async (file: File): Promise<{ entries: Entry[] } | null> => {
        try {
            const text = await file.text();
            const data = JSON.parse(text);

            if (!data.userIds || !Array.isArray(data.userIds)) {
                return null;
            }

            const entries: Entry[] = Array.isArray(data.entries) ? data.entries : [];

            return { entries };
        } catch (error) {
            console.error('Erreur lors du parsing du fichier:', error);
            return null;
        }
    }
};
export { };