import apiClient from '@/lib/api-client';

export const suppliersApi = {
    getAll: async () => {
        const response = await apiClient.get('/api/suppliers');
        return response.data;
    },
    getById: async (id: string) => {
        const response = await apiClient.get(`/api/suppliers/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await apiClient.post('/api/suppliers', data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await apiClient.put(`/api/suppliers/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await apiClient.delete(`/api/suppliers/${id}`);
        return response.data;
    }
};
