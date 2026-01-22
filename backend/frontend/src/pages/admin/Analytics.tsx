import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/api/stats";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { getImageUrl } from "@/lib/image-utils";

const Analytics = () => {
    const { currency } = useSettings();
    const [days, setDays] = useState(30);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const { data: summary, isLoading } = useQuery({
        queryKey: ['stats-summary', days, dateRange],
        queryFn: () => statsApi.getSummary(days, dateRange),
    });

    const dailyRevenueHistory = summary?.revenueHistory || [];
    const cityData = summary?.salesByCity || [];
    const topProducts = summary?.topProducts || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <div className="flex gap-2">
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Exporter
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <h3 className="font-semibold mb-6">Revenus (Derniers {days} jours)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyRevenueHistory}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `${val}${currency.toLowerCase()}`} />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#9b87f5"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#9b87f5" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Sales by City */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                    <h3 className="font-semibold mb-6">Ventes par Ville</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cityData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#9b87f5" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="font-semibold mb-6">Top Produits Vendus</h3>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 rounded-lg">
                            <tr>
                                <th className="px-6 py-3">Produit</th>
                                <th className="px-6 py-3">Catégorie</th>
                                <th className="px-6 py-3 text-center">Ventes</th>
                                <th className="px-6 py-3 text-right">Revenu Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((produit) => (
                                <tr key={produit.id} className="border-b last:border-0 border-border hover:bg-muted/50">
                                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                                        <img src={getImageUrl(produit.image)} alt="" className="w-8 h-8 rounded bg-secondary object-cover" />
                                        {produit.name}
                                    </td>
                                    <td className="px-6 py-4">{produit.category}</td>
                                    <td className="px-6 py-4 text-center font-bold text-lg">{produit.sales}</td>
                                    <td className="px-6 py-4 text-right">{produit.revenue.toLocaleString()} {currency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
