import { useState } from "react";
import { AxiosError } from "axios";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { productsApi } from "@/api/products";
import { categoriesApi } from "@/api/categories";
import { Product } from "@/data/products";
import { ImageUpload } from "@/components/ImageUpload";
import { MultiImageUpload } from "@/components/MultiImageUpload";
import { getImageUrl } from "@/lib/image-utils";
import { useSettings } from "@/context/SettingsContext";

const AdminProducts = () => {
    const { searchQuery: globalSearch } = useOutletContext<{ searchQuery: string }>();
    const { currency } = useSettings();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        categoryId: "",
        images: [] as string[],
        inStock: true,
        quantity: "0",
        badge: "",
        specs: "",
    });

    // Fetch categories (all, including inactive for admin)
    const { data: categories = [] } = useQuery({
        queryKey: ['categories', 'all'],
        queryFn: () => categoriesApi.getAll(true),
    });

    // Fetch products
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['admin-products'],
        queryFn: () => productsApi.getAll(),
    });

    // Create product mutation
    const createMutation = useMutation({
        mutationFn: (data: Omit<Product, 'id'>) => productsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                title: "Produit créé",
                description: "Le produit a été ajouté avec succès.",
            });
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.error || "Impossible de créer le produit.",
                variant: "destructive",
            });
        },
    });

    // Update product mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
            productsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                title: "Produit modifié",
                description: "Le produit a été mis à jour avec succès.",
            });
            setIsDialogOpen(false);
            resetForm();
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.error || "Impossible de modifier le produit.",
                variant: "destructive",
            });
        },
    });

    // Delete product mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => productsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast({
                title: "Produit supprimé",
                description: "Le produit a été supprimé avec succès.",
            });
        },
        onError: (error: AxiosError<{ error: string }>) => {
            toast({
                title: "Erreur",
                description: error.response?.data?.error || "Impossible de supprimer le produit.",
                variant: "destructive",
            });
        },
    });

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            originalPrice: "",
            categoryId: "",
            images: [],
            inStock: true,
            quantity: "0",
            badge: "",
            specs: "",
        });
        setEditingProduct(null);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            originalPrice: product.originalPrice?.toString() || "",
            categoryId: product.categoryId,
            images: product.images || (product.image ? [product.image] : []),
            inStock: product.inStock,
            quantity: product.quantity?.toString() || "0",
            badge: product.badge || "",
            specs: product.specs?.join(", ") || "",
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseInt(formData.price),
            originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
            categoryId: formData.categoryId,
            images: formData.images,
            inStock: formData.inStock,
            quantity: parseInt(formData.quantity) || 0,
            badge: formData.badge || undefined,
            specs: formData.specs ? formData.specs.split(",").map(s => s.trim()) : [],
        };

        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct.id, data: productData });
        } else {
            createMutation.mutate(productData as Omit<Product, 'id'>);
        }
    };

    // Handle stock status change with validation
    const handleStockStatusChange = (checked: boolean) => {
        const currentQuantity = parseInt(formData.quantity) || 0;

        // BLOCK: Prevent enabling "En stock" when quantity is 0
        if (checked && currentQuantity === 0) {
            toast({
                title: "Stock insuffisant",
                description: "Impossible de marquer le produit en stock. La quantité est à 0.",
                variant: "destructive",
            });
            // Do NOT update state - this prevents the switch from changing
            return false;
        }

        // Also prevent disabling when already disabled and quantity is 0
        if (!checked && currentQuantity === 0) {
            // Allow turning off, but it should already be off
            setFormData({ ...formData, inStock: false });
            return;
        }

        // Normal case: update the state
        setFormData({ ...formData, inStock: checked });
    };

    // Handle quantity change and auto-update stock status
    const handleQuantityChange = (value: string) => {
        const quantity = parseInt(value) || 0;

        // If quantity becomes 0, automatically set inStock to false
        if (quantity === 0) {
            setFormData({ ...formData, quantity: value, inStock: false });
        } else {
            setFormData({ ...formData, quantity: value });
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
            deleteMutation.mutate(id);
        }
    };

    const handleStockToggle = (product: Product) => {
        // CRITICAL: Prevent enabling stock when quantity is 0
        if (!product.inStock && product.quantity === 0) {
            toast({
                title: "Stock insuffisant",
                description: `Impossible de marquer "${product.name}" en stock. La quantité est à 0.`,
                variant: "destructive",
            });
            return;
        }

        updateMutation.mutate({
            id: product.id,
            data: { inStock: !product.inStock }
        });
    };

    const filteredProducts = products.filter((product) => {
        const combinedSearch = (globalSearch + " " + searchQuery).trim().toLowerCase();
        const matchesSearch = (
            product.name.toLowerCase().includes(combinedSearch) ||
            product.category?.name.toLowerCase().includes(combinedSearch)
        );
        const matchesCategory = categoryFilter === "all" || product.categoryId === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un produit
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                        placeholder="Rechercher un produit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        {categories.filter(cat => cat.active).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-x-auto overflow-y-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Prix</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="w-12 h-12 rounded object-cover bg-secondary"
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.category?.name || 'Sans catégorie'}</TableCell>
                                <TableCell>{product.price.toLocaleString()} {currency}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className={product.quantity === 0 ? "pointer-events-none opacity-50" : ""}>
                                            <Switch
                                                checked={product.inStock}
                                                onCheckedChange={() => handleStockToggle(product)}
                                                disabled={product.quantity === 0}
                                            />
                                        </div>
                                        <span className={`text-xs font-medium ${product.quantity === 0 ? 'text-muted-foreground' : ''}`}>
                                            {product.inStock ? "En stock" : "Rupture"}
                                            {product.quantity === 0 && " (Qté: 0)"}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive"
                                        onClick={() => handleDelete(product.id, product.name)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProduct ? "Modifier le produit" : "Ajouter un produit"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingProduct
                                ? "Modifiez les informations du produit ci-dessous."
                                : "Remplissez les informations pour ajouter un nouveau produit."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Nom du produit</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="PC Gamer RTX 4070"
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Description du produit..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Prix ({currency})</Label>
                                <Input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="15999"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Prix original (optionnel)</Label>
                                <Input
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                    placeholder="17999"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Stock Quantité</Label>
                                <Input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.quantity}
                                    onChange={(e) => handleQuantityChange(e.target.value)}
                                    placeholder="50"
                                />
                                {parseInt(formData.quantity) === 0 && (
                                    <p className="text-xs text-warning">⚠️ Quantité à 0 - Le produit sera automatiquement en rupture</p>
                                )}
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Images du produit (max 6)</Label>
                                <MultiImageUpload
                                    value={formData.images}
                                    onChange={(urls) => setFormData({ ...formData, images: urls })}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    maxImages={6}
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Spécifications (séparées par des virgules)</Label>
                                <Textarea
                                    value={formData.specs}
                                    onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                                    placeholder="Intel i7, 16GB RAM, RTX 4070"
                                    rows={2}
                                />
                            </div>

                            <div className="flex items-center space-x-2 col-span-2">
                                {(() => {
                                    const isQuantityZero = !formData.quantity || formData.quantity === '' || formData.quantity === '0' || parseInt(formData.quantity) === 0;
                                    return (
                                        <>
                                            <div className={isQuantityZero ? "pointer-events-none opacity-50 cursor-not-allowed" : ""}>
                                                <Switch
                                                    checked={formData.inStock}
                                                    onCheckedChange={handleStockStatusChange}
                                                    disabled={isQuantityZero}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label className={isQuantityZero ? "text-muted-foreground" : ""}>
                                                    En stock
                                                </Label>
                                                {isQuantityZero && (
                                                    <p className="text-xs text-destructive mt-1 font-medium">
                                                        🚫 Bloqué - Quantité à 0
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                {createMutation.isPending || updateMutation.isPending ? "Enregistrement..." : "Enregistrer"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminProducts;
