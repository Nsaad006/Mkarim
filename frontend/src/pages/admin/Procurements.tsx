import { useState } from "react";
import { Plus, Search, Loader2, Package, Truck, Calendar, DollarSign, History, ArrowUpCircle, Trash2, AlertTriangle } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { procurementsApi } from "@/api/procurements";
import { productsApi } from "@/api/products";
import { suppliersApi } from "@/api/suppliers";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useSettings } from "@/context/SettingsContext";
import { useEffect } from "react";
import { Pagination } from "@/components/admin/Pagination";

const Procurements = () => {
    const { currency } = useSettings();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const queryClient = useQueryClient();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    // Get current user permissions
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : { role: "viewer", permissions: [] };
    const userRole = user.role;
    const userPermissions = user.permissions || [];
    const canViewLogistics = userRole === 'super_admin' || userRole === 'editor' || userPermissions.includes('logistics:view');

    const [formData, setFormData] = useState({
        productId: "",
        supplierId: "",
        quantityPurchased: "",
        unitCostPrice: "",
        purchaseDate: new Date().toISOString().split('T')[0],
    });

    // Fetch procurements
    const { data: procurements = [], isLoading } = useQuery({
        queryKey: ['procurements'],
        queryFn: procurementsApi.getAll,
    });

    // Fetch products for selection
    const { data: products = [] } = useQuery({
        queryKey: ['admin-products'],
        queryFn: () => productsApi.getAll(),
    });

    // Fetch suppliers for selection — only if user has logistics permission
    const { data: suppliers = [] } = useQuery({
        queryKey: ['suppliers'],
        queryFn: suppliersApi.getAll,
        enabled: canViewLogistics,
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: any) => procurementsApi.create({
            ...data,
            quantityPurchased: Number(data.quantityPurchased),
            unitCostPrice: Number(data.unitCostPrice)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procurements'] });
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['stats-summary'] });
            toast({
                title: "Approvisionnement réussi",
                description: "Le stock et le capital ont été mis à jour."
            });
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (err: any) => {
            toast({
                title: "Erreur",
                description: err.response?.data?.error || "Impossible d'ajouter l'approvisionnement",
                variant: "destructive"
            });
        }
    });

    const deleteManyMutation = useMutation({
        mutationFn: (ids: string[]) => procurementsApi.deleteMany(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procurements'] });
            setSelectedIds(new Set());
            setIsDeleteConfirmOpen(false);
            toast({ title: "Supprimé", description: "Les approvisionnements sélectionnés ont été supprimés." });
        },
        onError: () => {
            toast({ title: "Erreur", description: "Impossible de supprimer.", variant: "destructive" });
        }
    });

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === paginatedProcurements.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(paginatedProcurements.map((p: any) => p.id)));
        }
    };

    const resetForm = () => {
        setFormData({
            productId: "",
            supplierId: "",
            quantityPurchased: "",
            unitCostPrice: "",
            purchaseDate: new Date().toISOString().split('T')[0],
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    const filteredProcurements = procurements.filter((p: any) =>
        p.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Apply pagination
    const totalPages = Math.ceil(filteredProcurements.length / pageSize);
    const paginatedProcurements = filteredProcurements.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Approvisionnements</h1>
                <div className="flex gap-2">
                    {selectedIds.size > 0 && (
                        <Button variant="destructive" size="sm" onClick={() => setIsDeleteConfirmOpen(true)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer ({selectedIds.size})
                        </Button>
                    )}
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Ajouter
                    </Button>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="mb-6 max-w-sm relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="w-10">
                                    <Checkbox
                                        checked={paginatedProcurements.length > 0 && selectedIds.size === paginatedProcurements.length}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Produit</TableHead>
                                <TableHead>Fournisseur</TableHead>
                                <TableHead className="text-center">Quantité</TableHead>
                                <TableHead className="text-right">P.U Achat</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-center">Admin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <span className="text-muted-foreground">Chargement de l'historique...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedProcurements.length > 0 ? (
                                paginatedProcurements.map((proc: any) => (
                                    <TableRow key={proc.id} className={`hover:bg-muted/30 transition-colors ${selectedIds.has(proc.id) ? 'bg-muted/20' : ''}`}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.has(proc.id)}
                                                onCheckedChange={() => toggleSelect(proc.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium whitespace-nowrap text-xs">
                                            <div className="flex flex-col">
                                                <span>{format(new Date(proc.purchaseDate), 'dd MMM yyyy', { locale: fr })}</span>
                                                <span className="text-[10px] text-muted-foreground opacity-70">
                                                    {format(new Date(proc.purchaseDate), 'HH:mm')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-primary/10 rounded">
                                                    <Package className="w-3 h-3 text-primary" />
                                                </div>
                                                <span className="font-semibold">{proc.product?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Truck className="w-3 h-3 text-muted-foreground" />
                                                <span>{proc.supplier?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                +{proc.quantityPurchased}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-mono text-xs">
                                            {proc.unitCostPrice.toLocaleString()} {currency}
                                        </TableCell>
                                        <TableCell className="text-right font-bold text-destructive">
                                            -{proc.totalCost.toLocaleString()} {currency}
                                        </TableCell>
                                        <TableCell className="text-center text-[10px] italic text-muted-foreground">
                                            {proc.admin?.name || '---'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                                        Aucun approvisionnement trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                }}
                totalItems={filteredProcurements.length}
            />

            {/* Bulk Delete Confirmation Dialog */}
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-destructive" />
                            Confirmer la suppression
                        </DialogTitle>
                        <DialogDescription>
                            Vous êtes sur le point de supprimer <strong>{selectedIds.size}</strong> approvisionnement(s). Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Annuler</Button>
                        <Button
                            variant="destructive"
                            disabled={deleteManyMutation.isPending}
                            onClick={() => deleteManyMutation.mutate(Array.from(selectedIds))}
                        >
                            {deleteManyMutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Creation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" />
                            Nouvel Approvisionnement
                        </DialogTitle>
                        <DialogDescription>
                            Ajoutez du stock à un produit existant. Cela déduira automatiquement le montant du capital disponible.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Produit</Label>
                                <Select
                                    required
                                    value={formData.productId}
                                    onValueChange={(value) => {
                                        const product = products.find((p: any) => p.id === value);
                                        setFormData({
                                            ...formData,
                                            productId: value,
                                            unitCostPrice: product?.weightedAverageCost?.toString() || ""
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un produit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products.map((p: any) => (
                                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Fournisseur</Label>
                                <Select
                                    required
                                    value={formData.supplierId}
                                    onValueChange={(value) => setFormData({ ...formData, supplierId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un fournisseur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((s: any) => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Quantité à ajouter</Label>
                                    <Input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.quantityPurchased}
                                        onChange={(e) => setFormData({ ...formData, quantityPurchased: e.target.value })}
                                        placeholder="Ex: 10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Coût Unitaire ({currency})</Label>
                                    <Input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.unitCostPrice}
                                        onChange={(e) => setFormData({ ...formData, unitCostPrice: e.target.value })}
                                        placeholder="Prix d'achat"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Date d'achat</Label>
                                <Input
                                    type="date"
                                    value={formData.purchaseDate}
                                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                />
                            </div>
                        </div>

                        {formData.quantityPurchased && formData.unitCostPrice && (
                            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                <p className="text-sm font-medium flex justify-between">
                                    Total à déduire du capital:
                                    <span className="text-primary font-bold">
                                        {(Number(formData.quantityPurchased) * Number(formData.unitCostPrice)).toLocaleString()} {currency}
                                    </span>
                                </p>
                            </div>
                        )}

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Traitement..." : "Confirmer l'achat"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Procurements;
