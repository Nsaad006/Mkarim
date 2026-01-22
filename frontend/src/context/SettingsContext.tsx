import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { settingsApi, GlobalSettings } from "@/api/settings";

interface SettingsContextType {
    settings: GlobalSettings | undefined;
    isLoading: boolean;
    formatPrice: (price: number) => string;
    currency: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: () => settingsApi.get(),
    });

    const currency = settings?.currency || "DH";

    const formatPrice = (price: number) => {
        return `${price.toLocaleString()} ${currency}`;
    };

    return (
        <SettingsContext.Provider value={{ settings, isLoading, formatPrice, currency }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
