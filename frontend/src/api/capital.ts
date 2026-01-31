import apiClient from '@/lib/api-client';

export interface CapitalEntry {
    id: string;
    amount: number;
    type: string;
    description: string | null;
    date: string;
    adminId: string | null;
    admin?: { name: string };
}

export const capitalApi = {
    getAll: async (): Promise<CapitalEntry[]> => {
        const { data } = await apiClient.get<CapitalEntry[]>('/api/capital');
        return data;
    },

    inject: async (dto: { amount: number; description: string }): Promise<CapitalEntry> => {
        const { data } = await apiClient.post<CapitalEntry>('/api/capital', dto);
        return data;
    }
};
