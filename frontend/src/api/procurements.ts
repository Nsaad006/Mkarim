import apiClient from "@/lib/api-client";

export const procurementsApi = {
    getAll: async () => {
        const { data } = await apiClient.get('/api/procurements');
        return data;
    },
    deleteMany: async (ids: string[]) => {
        const { data: result } = await apiClient.delete('/api/procurements', { data: { ids } });
        return result;
    },
    create: async (data: {
        supplierId: string;
        productId: string;
        quantityPurchased: number;
        unitCostPrice: number;
        purchaseDate?: string;
    }) => {
        const { data: result } = await apiClient.post('/api/procurements', data);
        return result;
    }
};
