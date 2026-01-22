import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Save, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi, GlobalSettings } from "@/api/settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ImageUpload";

const Settings = () => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState<Partial<GlobalSettings>>({});

    // Fetch settings
    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: () => settingsApi.get(),
    });

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    // Update mutation
    const mutation = useMutation({
        mutationFn: (data: Partial<GlobalSettings>) => settingsApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['settings'] });
            toast({
                title: "Paramètres enregistrés",
                description: "La configuration de la boutique a été mise à jour.",
            });
        },
        onError: () => {
            toast({
                title: "Erreur",
                description: "Impossible de sauvegarder les paramètres.",
                variant: "destructive"
            });
        }
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>

            <form onSubmit={handleSave} className="space-y-6">
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto gap-2 bg-transparent p-0">
                        <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border">Général</TabsTrigger>
                        <TabsTrigger value="hero" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border">Hero</TabsTrigger>
                        <TabsTrigger value="sections" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border">Sections</TabsTrigger>
                        <TabsTrigger value="contact" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border">Contact</TabsTrigger>
                        <TabsTrigger value="checkout" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border">Checkout</TabsTrigger>
                    </TabsList>

                    <div className="mt-6">
                        {/* General Tab */}
                        <TabsContent value="general" className="space-y-6 m-0">
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Informations Générales</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Nom de la boutique</Label>
                                        <Input
                                            value={formData.storeName || ""}
                                            onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Devise</Label>
                                        <Input
                                            value={formData.currency || ""}
                                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            placeholder="DH"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Contenu du Footer</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Description du Footer</Label>
                                        <Textarea
                                            value={formData.footerDescription || ""}
                                            onChange={(e) => setFormData({ ...formData, footerDescription: e.target.value })}
                                            placeholder="Votre destination pour les meilleurs PC..."
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Copyright</Label>
                                        <Input
                                            value={formData.footerCopyright || ""}
                                            onChange={(e) => setFormData({ ...formData, footerCopyright: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Hero Section Tab */}
                        <TabsContent value="hero" className="space-y-6 m-0">
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Section Hero (Accueil)</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Image de Fond</Label>
                                        <ImageUpload
                                            value={formData.heroImage || ""}
                                            onChange={(url) => setFormData({ ...formData, heroImage: url })}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Petit Sous-titre (Badge)</Label>
                                            <Input
                                                value={formData.heroSubtitle || ""}
                                                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                                                placeholder="🎮 Solutions Gaming & IT"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Titre Principal (Partie 2)</Label>
                                            <Input
                                                value={formData.heroTitle || ""}
                                                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                                                placeholder="PC & Gaming de Qualité"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={formData.heroDescription || ""}
                                            onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                                        <div className="space-y-2">
                                            <Label>Texte Bouton Principal</Label>
                                            <Input
                                                value={formData.heroPrimaryBtnText || ""}
                                                onChange={(e) => setFormData({ ...formData, heroPrimaryBtnText: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Lien Bouton Principal</Label>
                                            <Input
                                                value={formData.heroPrimaryBtnLink || ""}
                                                onChange={(e) => setFormData({ ...formData, heroPrimaryBtnLink: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Texte Bouton Secondaire</Label>
                                            <Input
                                                value={formData.heroSecondaryBtnText || ""}
                                                onChange={(e) => setFormData({ ...formData, heroSecondaryBtnText: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Lien Bouton Secondaire</Label>
                                            <Input
                                                value={formData.heroSecondaryBtnLink || ""}
                                                onChange={(e) => setFormData({ ...formData, heroSecondaryBtnLink: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Sections Content Tab */}
                        <TabsContent value="sections" className="space-y-6 m-0">
                            {/* Categories Section */}
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Section Catégories</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Titre</Label>
                                        <Input
                                            value={formData.categoriesTitle || ""}
                                            onChange={(e) => setFormData({ ...formData, categoriesTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sous-titre</Label>
                                        <Input
                                            value={formData.categoriesSubtitle || ""}
                                            onChange={(e) => setFormData({ ...formData, categoriesSubtitle: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Featured Section */}
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Section Produits Populaires</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Titre</Label>
                                        <Input
                                            value={formData.featuredTitle || ""}
                                            onChange={(e) => setFormData({ ...formData, featuredTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sous-titre</Label>
                                        <Input
                                            value={formData.featuredSubtitle || ""}
                                            onChange={(e) => setFormData({ ...formData, featuredSubtitle: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Why Us Section */}
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Section "Pourquoi nous"</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Titre</Label>
                                        <Input
                                            value={formData.whyTitle || ""}
                                            onChange={(e) => setFormData({ ...formData, whyTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sous-titre</Label>
                                        <Input
                                            value={formData.whySubtitle || ""}
                                            onChange={(e) => setFormData({ ...formData, whySubtitle: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* CTA Section */}
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Section CTA (Bas de page)</h2>
                                <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Titre</Label>
                                            <Input
                                                value={formData.ctaTitle || ""}
                                                onChange={(e) => setFormData({ ...formData, ctaTitle: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Sous-titre</Label>
                                            <Input
                                                value={formData.ctaSubtitle || ""}
                                                onChange={(e) => setFormData({ ...formData, ctaSubtitle: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-2">
                                            <Label>Texte Bouton Principal</Label>
                                            <Input
                                                value={formData.ctaPrimaryBtnText || ""}
                                                onChange={(e) => setFormData({ ...formData, ctaPrimaryBtnText: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Lien Bouton Principal</Label>
                                            <Input
                                                value={formData.ctaPrimaryBtnLink || ""}
                                                onChange={(e) => setFormData({ ...formData, ctaPrimaryBtnLink: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Texte Bouton Secondaire</Label>
                                            <Input
                                                value={formData.ctaSecondaryBtnText || ""}
                                                onChange={(e) => setFormData({ ...formData, ctaSecondaryBtnText: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Lien Bouton Secondaire</Label>
                                            <Input
                                                value={formData.ctaSecondaryBtnLink || ""}
                                                onChange={(e) => setFormData({ ...formData, ctaSecondaryBtnLink: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Contact Tab */}
                        <TabsContent value="contact" className="space-y-6 m-0">
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Informations de Contact</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Adresse</Label>
                                        <Input
                                            value={formData.contactAddress || ""}
                                            onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Téléphone</Label>
                                        <Input
                                            value={formData.contactPhone || ""}
                                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            value={formData.contactEmail || ""}
                                            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Horaires</Label>
                                        <Input
                                            value={formData.contactHours || ""}
                                            onChange={(e) => setFormData({ ...formData, contactHours: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Numéro WhatsApp</Label>
                                        <Input
                                            value={formData.whatsappNumber || ""}
                                            onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Page À Propos</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Titre</Label>
                                        <Input
                                            value={formData.aboutTitle || ""}
                                            onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={formData.aboutDescription || ""}
                                            onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Mission</Label>
                                        <Textarea
                                            value={formData.aboutMission || ""}
                                            onChange={(e) => setFormData({ ...formData, aboutMission: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Checkout Tab */}
                        <TabsContent value="checkout" className="space-y-6 m-0">
                            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                                <h2 className="text-xl font-semibold border-b pb-2">Checkout & Paiement</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Paiement à la livraison (COD)</Label>
                                            <p className="text-sm text-muted-foreground">Activer le paiement à la livraison pour les clients</p>
                                        </div>
                                        <Switch
                                            checked={formData.codEnabled || false}
                                            onCheckedChange={(checked) => setFormData({ ...formData, codEnabled: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Disponibilité de la boutique</Label>
                                            <p className="text-sm text-muted-foreground">Permettre aux clients de passer des commandes</p>
                                        </div>
                                        <Switch
                                            checked={formData.storeAvailability || false}
                                            onCheckedChange={(checked) => setFormData({ ...formData, storeAvailability: checked })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>

                <div className="flex justify-end sticky bottom-6">
                    <Button size="lg" className="shadow-lg" disabled={mutation.isPending}>
                        {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Enregistrer les changements
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
