import { Product } from '@/data/products';
import apiClient from '@/lib/api-client';

export interface RevenuePoint {
    date: string;
    fullDate: string;
    revenue: number;
    orders: number;
}


export interface CityStat {
    name: string;
    value: number;
}

export interface TopProduct {
    id: string;
    name: string;
    image: string;
    category: string;
    sales: number;
    revenue: number;
}

export interface StatsSummary {
    revenueHistory: RevenuePoint[];
    salesByCity: CityStat[];
    topProducts: TopProduct[];
    lowStock: Product[];
    outOfStock: Product[];  // Products marked as out of stock
    stats: {
        totalRevenue: number;
        totalOrders: number;
        pendingOrders: number;
        deliveredOrders: number;
        totalProducts: number;
        totalCustomers: number;
        totalCities: number;
    };
}

export interface PublicStats {
    totalProducts: number;
    totalCategories: number;
    totalCities: number;
    totalCustomers: number;
    deliveryTime: string;
    paymentMethods: string[];
}

export const statsApi = {
    getSummary: async (days: number = 7, dateRange?: { from?: Date; to?: Date }): Promise<StatsSummary> => {
        let query = `days=${days}`;
        if (dateRange?.from && dateRange?.to) {
            query += `&from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`;
        }
        const { data } = await apiClient.get<StatsSummary>(`/api/stats/analytics?${query}`);
        return data;
    },

    getPublicSummary: async (): Promise<PublicStats> => {
        const { data } = await apiClient.get<PublicStats>('/api/stats/summary');
        return data;
    }
};
