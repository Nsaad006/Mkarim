import {
    ShoppingBag,
    Users,
    CreditCard,
    Package,
    ArrowRight,
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    User
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import { ordersApi } from "@/api/orders";
import { statsApi } from "@/api/stats";
import { contactsApi } from "@/api/contacts";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/admin/StatsCard";
import { useSettings } from "@/context/SettingsContext";

const Dashboard = () => {
    const { searchQuery } = useOutletContext<{ searchQuery: string }>();
    const { currency } = useSettings();
    // Fetch dashboard summary
    const { data: summary, isLoading: isStatsLoading } = useQuery({
        queryKey: ['stats-summary'],
        queryFn: () => statsApi.getSummary(7),
    });

    // Fetch orders for the recent orders table
    const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: () => ordersApi.getAll(),
    });

    // Fetch messages for the dashboard
    const { data: messages = [] } = useQuery({
        queryKey: ['admin-contacts'],
        queryFn: () => contactsApi.getAll(),
    });

    const kpis = summary?.stats || {
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0
    };

    const dailyRevenueHistory = summary?.revenueHistory || [];
    const cityData = summary?.salesByCity || [];

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase();
        return (
            order.customerName.toLowerCase().includes(query) ||
            order.orderNumber.toLowerCase().includes(query) ||
            order.items.some(item => item.product?.name.toLowerCase().includes(query))
        );
    });

    const filteredStockAlerts = (summary?.lowStock || []).filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredOutOfStock = (summary?.outOfStock || []).filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="flex gap-2">
                    <Link to="/admin/products">
                        <Button>
                            <Package className="mr-2 h-4 w-4" />
                            Ajouter un Produit
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Commandes"
                    value={kpis.totalOrders}
                    icon={ShoppingBag}
                    trend="+12%"
                    trendUp={true}
                />
                <StatsCard
                    title="En Attente (COD)"
                    value={kpis.pendingOrders}
                    icon={Clock}
                    description="Commandes à confirmer"
                />
                <StatsCard
                    title="Commandes Livrées"
                    value={kpis.deliveredOrders}
                    icon={CheckCircle2}
                    trend="+5%"
                    trendUp={true}
                />
                <StatsCard
                    title="Revenu Estimé"
                    value={`${kpis.totalRevenue.toLocaleString()} ${currency}`}
                    icon={CreditCard}
                    trend="+18%"
                    trendUp={true}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Revenue Chart */}
                <div className="col-span-4 bg-card rounded-xl border border-border p-6">
                    <h3 className="font-semibold mb-6">Aperçu des Revenus (7 jours)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyRevenueHistory}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#9b87f5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `${value}${currency}`}
                                />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#9b87f5"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders by City */}
                <div className="col-span-3 bg-card rounded-xl border border-border p-6">
                    <h3 className="font-semibold mb-6">Commandes par Ville</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cityData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                />
                                <Tooltip />
                                <Bar dataKey="value" fill="#9b87f5" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold">Commandes Récentes</h3>
                    <Link to="/admin/orders">
                        <Button variant="outline" size="sm">
                            Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border text-left">
                                <th className="pb-3 font-medium text-sm text-muted-foreground">ID Commande</th>
                                <th className="pb-3 font-medium text-sm text-muted-foreground">Client</th>
                                <th className="pb-3 font-medium text-sm text-muted-foreground">Produit</th>
                                <th className="pb-3 font-medium text-sm text-muted-foreground">Montant</th>
                                <th className="pb-3 font-medium text-sm text-muted-foreground">Status</th>
                                <th className="pb-3 font-medium text-sm text-muted-foreground">Date</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredOrders.slice(0, 5).map((order) => (
                                <tr key={order.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                                    <td className="py-4 font-mono">{order.orderNumber}</td>
                                    <td className="py-4 font-medium">{order.customerName}</td>
                                    <td className="py-4">
                                        {order.items.length > 1
                                            ? `${order.items[0]?.product?.name} (+${order.items.length - 1})`
                                            : order.items[0]?.product?.name || '---'}
                                    </td>
                                    <td className="py-4 font-bold">{order.total.toLocaleString()} {currency}</td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-success/10 text-success' :
                                            order.status === 'pending' ? 'bg-warning/10 text-warning' :
                                                order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                                                    'bg-secondary text-secondary-foreground'
                                            }`}>
                                            {order.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                                            {order.status === 'delivered' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-4 text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Low Stock Alerts */}
            {filteredStockAlerts.length > 0 && (
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 text-destructive mb-4">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Alertes Stock Faible</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredStockAlerts.map(product => (
                            <div key={product.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">Reste: {product.quantity} unités</p>
                                </div>
                                <Link to="/admin/products">
                                    <Button size="sm" variant="outline">Réapprovisionner</Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Out of Stock Alerts */}
            {filteredOutOfStock.length > 0 && (
                <div className="bg-warning/5 border border-warning/20 rounded-xl p-6">
                    <div className="flex items-center gap-2 text-warning mb-4">
                        <Package className="w-5 h-5" />
                        <h3 className="font-semibold text-lg">Produits en Rupture de Stock</h3>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredOutOfStock.map(product => (
                            <div key={product.id} className="bg-card border border-border rounded-lg p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">Marqué comme indisponible</p>
                                </div>
                                <Link to="/admin/products">
                                    <Button size="sm" variant="outline">Gérer</Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
