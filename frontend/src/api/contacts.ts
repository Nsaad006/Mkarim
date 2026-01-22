import apiClient from '@/lib/api-client';

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
    status: 'NEW' | 'READ' | 'REPLIED';
    createdAt: string;
}

export const contactsApi = {
    submit: async (data: Partial<Contact>) => {
        const response = await apiClient.post('/api/contacts', data);
        return response.data;
    },
    getAll: async () => {
        const response = await apiClient.get<Contact[]>('/api/contacts');
        return response.data;
    },
    updateStatus: async (id: string, status: string) => {
        const response = await apiClient.patch<Contact>(`/api/contacts/${id}/status`, { status });
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/api/contacts/${id}`);
        return response.data;
    }
};
