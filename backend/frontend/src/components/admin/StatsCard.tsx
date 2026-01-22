import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    description?: string;
}

const StatsCard = ({ title, value, icon: Icon, trend, trendUp, description }: StatsCardProps) => {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                </div>
                <div className="flex flex-col mt-3">
                    <span className="text-3xl font-bold">{value}</span>
                    {description && (
                        <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    )}
                    {trend && (
                        <p className={`text-xs font-medium mt-1 flex items-center ${trendUp ? "text-success" : "text-destructive"}`}>
                            {trendUp ? "↑" : "↓"} {trend}
                            <span className="text-muted-foreground ml-1">vs mois dernier</span>
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default StatsCard;
