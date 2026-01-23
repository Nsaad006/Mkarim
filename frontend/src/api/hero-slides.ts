import apiClient from "@/lib/api-client";

export interface HeroSlide {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    description?: string;
    buttonText: string;
    buttonLink: string;
    badge?: string;
    order: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CreateHeroSlide = Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>;

export const heroSlidesApi = {
    getAll: async () => {
        const { data } = await apiClient.get<HeroSlide[]>('/api/hero-slides');
        return data;
    },

    getAllAdmin: async () => {
        const { data } = await apiClient.get<HeroSlide[]>('/api/hero-slides/all');
        return data;
    },

    create: async (data: CreateHeroSlide) => {
        const { data: responseData } = await apiClient.post<HeroSlide>('/api/hero-slides', data);
        return responseData;
    },

    update: async (id: string, data: Partial<CreateHeroSlide>) => {
        const { data: responseData } = await apiClient.put<HeroSlide>(`/api/hero-slides/${id}`, data);
        return responseData;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/api/hero-slides/${id}`);
    }
};
