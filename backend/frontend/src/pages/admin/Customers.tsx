import { useState } from "react";
import { Search, Mail, Phone, MapPin } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { customersApi, Customer } from "@/api/customers";
import { Loader2 } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const Customers = () => {
    const { currency } = useSettings();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: customers = [], isLoading } = useQuery({
        queryKey: ['admin-customers'],
        queryFn: () => customersApi.getAll(),
    });

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
                <Button variant="outline">
                    Export DB
                </Button>
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
                                        <Button variant="outline" size="sm" onClick={() => window.open(`https://wa.me/${customer.phone.replace(/\s+/g, '')}`, "_blank")}>
                                            WhatsApp
                                        </Button>
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
        </div>
    );
};

export default Customers;
