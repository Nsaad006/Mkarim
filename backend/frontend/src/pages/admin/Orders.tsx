import { useState } from "react";
import {
    Search,
    Filter,
    Eye,
    MoreHorizontal,
    Phone,
    MessageCircle,
    XCircle,
    Truck,
    CheckCircle2,
    Package,
    Loader2,
    FileText,
    Download,
    FileSpreadsheet
} from "lucide-react";
import {
    exportOrdersToExcel,
    exportOrdersToPDF,
    generateInvoicePDF
} from "@/utils/exportUtils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import StatusBadge from "@/components/admin/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { ordersApi } from "@/api/orders";
import { Order } from "@/data/mock-admin-data";
import { toast } from "@/hooks/use-toast";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useSettings } from "@/context/SettingsContext";
import { getImageUrl } from "@/lib/image-utils";

const Orders = () => {
    const { searchQuery: globalSearch } = useOutletContext<{ searchQuery: string }>();
    const { currency } = useSettings();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const queryClient = useQueryClient();

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: () => ordersApi.getAll(),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            ordersApi.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast({
                title: "Statut mis à jour",
                description: "La commande a été mise à jour avec succès.",
            });
        },
        onError: () => {
            toast({
                title: "Erreur",
                description: "Impossible de mettre à jour le statut de la commande.",
                variant: "destructive",
            });
        }
    });

    const filteredOrders = orders
        .filter((order) => {
            const combinedSearch = (globalSearch + " " + searchTerm).trim().toLowerCase();
            const matchesSearch =
                order.customerName.toLowerCase().includes(combinedSearch) ||
                order.orderNumber.toLowerCase().includes(combinedSearch) ||
                order.phone.includes(combinedSearch);

            const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

            let matchesDate = true;
            if (dateRange?.from) {
                const orderDate = new Date(order.createdAt);
                if (dateRange.to) {
                    matchesDate = orderDate >= dateRange.from && orderDate <= new Date(dateRange.to.getTime() + 86400000); // Add 1 day to include end date
                } else {
                    matchesDate = orderDate >= dateRange.from;
                }
            }

            return matchesSearch && matchesStatus && matchesDate;
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const handleStatusChange = (orderId: string, newStatus: string) => {
        updateStatusMutation.mutate({ id: orderId, status: newStatus });
    };

    const openWhatsApp = (phone: string, orderNumber: string) => {
        const message = encodeURIComponent(`Bonjour, c'est à propos de votre commande ${orderNumber} sur MKARIM SOLUTION.`);
        window.open(`https://wa.me/${phone.replace(/\s+/g, '')}?text=${message}`, "_blank");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold tracking-tight">Commandes</h1>
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" /> Exporter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => exportOrdersToExcel(filteredOrders, currency)}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel (.xlsx)
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => exportOrdersToPDF(filteredOrders, currency)}>
                                <FileText className="mr-2 h-4 w-4" /> PDF (.pdf)
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher commande, client..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="pending">En Attente</SelectItem>
                                <SelectItem value="confirmed">Confirmée</SelectItem>
                                <SelectItem value="shipped">Expédiée</SelectItem>
                                <SelectItem value="delivered">Livrée</SelectItem>
                                <SelectItem value="cancelled">Annulée</SelectItem>
                            </SelectContent>
                        </Select>
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border overflow-x-auto overflow-y-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Ville</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Chargement des commandes...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-mono font-medium">{order.orderNumber}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{order.customerName}</span>
                                                <span className="text-xs text-muted-foreground">{order.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{order.city}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-bold">{order.total.toLocaleString()} {currency}</TableCell>
                                        <TableCell>
                                            <StatusBadge status={order.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </SheetTrigger>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        generateInvoicePDF(order, currency);
                                                    }}
                                                    title="Télécharger la facture"
                                                >
                                                    <FileText className="w-4 h-4 text-primary" />
                                                </Button>
                                                <SheetContent className="overflow-y-auto w-full sm:max-w-xl">
                                                    <SheetHeader className="mb-6">
                                                        <SheetTitle className="text-2xl">Commande {order.orderNumber}</SheetTitle>
                                                        <SheetDescription>
                                                            Détails complets de la commande et informations client
                                                        </SheetDescription>
                                                    </SheetHeader>

                                                    <div className="space-y-6">
                                                        {/* Status Section */}
                                                        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border">
                                                            <div>
                                                                <p className="text-sm text-muted-foreground mb-1">Statut actuel</p>
                                                                <StatusBadge status={order.status} />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => handleStatusChange(order.id, "CONFIRMED")}
                                                                    disabled={updateStatusMutation.isPending}
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Confirmer
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {/* Customer Info */}
                                                        <div>
                                                            <h3 className="font-semibold text-lg mb-3">Information Client</h3>
                                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                                <div>
                                                                    <p className="text-muted-foreground">Nom complet</p>
                                                                    <p className="font-medium">{order.customerName}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Téléphone</p>
                                                                    <p className="font-medium flex items-center gap-2">
                                                                        {order.phone}
                                                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openWhatsApp(order.phone, order.orderNumber)}>
                                                                            <MessageCircle className="w-3 h-3 text-green-600" />
                                                                        </Button>
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-muted-foreground">Ville</p>
                                                                    <p className="font-medium">{order.city}</p>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <p className="text-muted-foreground">Adresse</p>
                                                                    <p className="font-medium">{order.address}</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Items */}
                                                        <div>
                                                            <h3 className="font-semibold text-lg mb-3">Articles</h3>
                                                            <div className="border rounded-lg divide-y">
                                                                {order.items.map((item, idx) => (
                                                                    <div key={idx} className="p-3 flex justify-between items-center">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                                                                {item.product?.image ? (
                                                                                    <img src={getImageUrl(item.product.image)} alt={item.product.name} className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <Package className="w-5 h-5 text-gray-500" />
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                <p className="font-medium">{item.product?.name || 'Produit inconnu'}</p>
                                                                                <p className="text-sm text-muted-foreground">Qté: {item.quantity}</p>
                                                                            </div>
                                                                        </div>
                                                                        <p className="font-medium">{item.price.toLocaleString()} {currency}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                                                <span className="font-semibold text-lg">Total à payer</span>
                                                                <span className="font-bold text-xl text-primary">{order.total.toLocaleString()} {currency}</span>
                                                            </div>
                                                        </div>

                                                        {/* Quick Actions */}
                                                        <div>
                                                            <h3 className="font-semibold text-lg mb-3">Actions Rapides</h3>
                                                            <div className="grid grid-cols-3 gap-3">
                                                                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => openWhatsApp(order.phone, order.orderNumber)}>
                                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                                    WhatsApp
                                                                </Button>
                                                                <Button className="w-full" variant="outline" onClick={() => window.open(`tel:${order.phone}`)}>
                                                                    <Phone className="w-4 h-4 mr-2" />
                                                                    Appeler
                                                                </Button>
                                                                <Button className="w-full" variant="outline" onClick={() => generateInvoicePDF(order, currency)}>
                                                                    <FileText className="w-4 h-4 mr-2" />
                                                                    Facture
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="pt-4 border-t">
                                                            <Button
                                                                variant="destructive"
                                                                className="w-full"
                                                                onClick={() => handleStatusChange(order.id, "CANCELLED")}
                                                                disabled={updateStatusMutation.isPending}
                                                            >
                                                                <XCircle className="w-4 h-4 mr-2" />
                                                                Annuler la commande
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </SheetContent>
                                            </Sheet>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => generateInvoicePDF(order, currency)}>
                                                        <FileText className="mr-2 h-4 w-4" /> Facture PDF
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(order.id, "CONFIRMED")}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Confirmer
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(order.id, "SHIPPED")}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Marquer Expédiée
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleStatusChange(order.id, "DELIVERED")}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Marquer Livrée
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleStatusChange(order.id, "CANCELLED")}
                                                        disabled={updateStatusMutation.isPending}
                                                    >
                                                        Annuler
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        Aucune commande trouvée.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Orders;
