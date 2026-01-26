import { useState } from "react";
import { Search, Mail, Phone, FileDown, History, Loader2 } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { customersApi, Customer } from "@/api/customers";
import { useSettings } from "@/context/SettingsContext";
import { exportCustomersToExcel, exportCustomersToPDF } from "@/utils/exportUtils";
import { toast } from "@/hooks/use-toast";

const Customers = () => {
    const { currency } = useSettings();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showOrderHistory, setShowOrderHistory] = useState(false);

    const { data: customers = [], isLoading } = useQuery({
        queryKey: ['admin-customers'],
        queryFn: () => customersApi.getAll(),
    });

    const { data: customerOrders = [], isLoading: isLoadingOrders } = useQuery({
        queryKey: ['customer-orders', selectedCustomer?.id],
        queryFn: () => customersApi.getCustomerOrders(selectedCustomer!.id),
        enabled: !!selectedCustomer,
    });

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    const handleExportExcel = () => {
        try {
            exportCustomersToExcel(filteredCustomers, currency);
            toast({
                title: "Export réussi",
                description: "Les clients ont été exportés en Excel.",
            });
        } catch (error) {
            toast({
                title: "Erreur d'export",
                description: "Impossible d'exporter les clients.",
                variant: "destructive",
            });
        }
    };

    const handleExportPDF = () => {
        try {
            exportCustomersToPDF(filteredCustomers, currency);
            toast({
                title: "Export réussi",
                description: "Les clients ont été exportés en PDF.",
            });
        } catch (error) {
            toast({
                title: "Erreur d'export",
                description: "Impossible d'exporter les clients.",
                variant: "destructive",
            });
        }
    };

    const handleViewOrderHistory = (customer: Customer) => {
        setSelectedCustomer(customer);
        setShowOrderHistory(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <FileDown className="w-4 h-4 mr-2" />
                            Exporter
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleExportExcel}>
                            <FileDown className="w-4 h-4 mr-2" />
                            Exporter en Excel (.xlsx)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportPDF}>
                            <FileDown className="w-4 h-4 mr-2" />
                            Exporter en PDF
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="bg-card rounded-xl border border-border p-6">
                <div className="mb-6 max-w-sm relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher nom, email, téléphone..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Ville</TableHead>
                            <TableHead>Commandes</TableHead>
                            <TableHead>Total Dépensé</TableHead>
                            <TableHead>Dernière Commande</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Chargement des clients...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <TableRow key={customer.id} className="hover:bg-muted/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{customer.name}</p>
                                                <p className="text-xs text-muted-foreground">{customer.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <Mail className="w-3 h-3" /> {customer.email}
                                            </span>
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <Phone className="w-3 h-3" /> {customer.phone}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.city}</TableCell>
                                    <TableCell>{customer.ordersCount}</TableCell>
                                    <TableCell className="font-semibold">{customer.totalSpent.toLocaleString()} {currency}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(customer.lastOrderDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewOrderHistory(customer)}
                                            >
                                                <History className="w-4 h-4 mr-1" />
                                                Historique
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.open(`https://wa.me/${customer.phone.replace(/\s+/g, '')}`, "_blank")}
                                            >
                                                WhatsApp
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    Aucun client trouvé.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Order History Dialog */}
            <Dialog open={showOrderHistory} onOpenChange={setShowOrderHistory}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Historique des Commandes</DialogTitle>
                        <DialogDescription>
                            {selectedCustomer && (
                                <>
                                    Client: <span className="font-semibold">{selectedCustomer.name}</span> |
                                    Total: <span className="font-semibold">{selectedCustomer.ordersCount} commande(s)</span>
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        {isLoadingOrders ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                <span>Chargement de l'historique...</span>
                            </div>
                        ) : customerOrders.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>N° Commande</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Produits</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customerOrders.map((order: any) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
                                            <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {order.items?.map((item: any, idx: number) => (
                                                        <div key={idx} className="text-muted-foreground">
                                                            {item.product?.name || 'Produit'} x{item.quantity}
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold">{order.total.toLocaleString()} {currency}</TableCell>
                                            <TableCell>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${order.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                            order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                                'bg-yellow-500/10 text-yellow-500'}`}>
                                                    {order.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                Aucune commande trouvée pour ce client.
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Customers;
