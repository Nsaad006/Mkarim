import apiClient from "@/lib/api-client";

export const procurementsApi = {
    getAll: async () => {
        const { data } = await apiClient.get('/api/procurements');
        return data;
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
