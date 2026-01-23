import apiClient from '@/lib/api-client';
import { Category } from '@/data/mock-admin-data';
export type { Category };

export const categoriesApi = {
    // Get all categories
    getAll: async (includeInactive: boolean = false): Promise<Category[]> => {
        const params = includeInactive ? '?includeInactive=true' : '';
        const { data } = await apiClient.get<Category[]>(`/api/categories${params}`);
        return data;
    },

    // Create category
    create: async (categoryData: Partial<Category>): Promise<Category> => {
        const { data } = await apiClient.post<Category>('/api/categories', categoryData);
        return data;
    },

    // Update category
    update: async (id: string, categoryData: Partial<Category>): Promise<Category> => {
        const { data } = await apiClient.put<Category>(`/api/categories/${id}`, categoryData);
        return data;
    },

    // Delete category
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/categories/${id}`);
    }
};
