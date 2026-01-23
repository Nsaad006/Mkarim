import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ImageUpload";
import { Plus, Trash2, GripVertical, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { heroSlidesApi, HeroSlide, CreateHeroSlide } from "@/api/hero-slides";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export const HeroSlideManager = () => {
    const queryClient = useQueryClient();

    const { data: slides = [], isLoading } = useQuery({
        queryKey: ['hero-slides-admin'],
        queryFn: () => heroSlidesApi.getAllAdmin(),
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateHeroSlide) => heroSlidesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hero-slides-admin'] });
            toast({ title: "Slide ajouté" });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<CreateHeroSlide> }) => heroSlidesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hero-slides-admin'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => heroSlidesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['hero-slides-admin'] });
            toast({ title: "Slide supprimé" });
        }
    });

    const addNewSlide = () => {
        createMutation.mutate({
            title: "Nouveau Slide",
            subtitle: "Subtitle",
            description: "Description",
            image: "",
            buttonText: "Acheter Maintenant",
            buttonLink: "/products",
            badge: "Nouveau",
            order: slides.length,
            active: true
        });
    };

    if (isLoading) return <Loader2 className="animate-spin mx-auto" />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Gestion des Slides (Hero)</h2>
                <Button onClick={addNewSlide} disabled={createMutation.isPending}>
                    <Plus className="w-4 h-4 mr-2" /> Ajouter un slide
                </Button>
            </div>

            <div className="space-y-4">
                {slides.map((slide) => (
                    <Card key={slide.id} className="border-border bg-card/50">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="text-muted-foreground w-5 h-5" />
                                    <span className="font-bold">Slide #{slide.order + 1}</span>
                                    <div className="flex items-center gap-1 ml-4 border-l pl-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={slide.order === 0 || updateMutation.isPending}
                                            onClick={() => {
                                                const prevSlide = slides.find(s => s.order === slide.order - 1);
                                                if (prevSlide) {
                                                    updateMutation.mutate({ id: prevSlide.id, data: { order: slide.order } });
                                                    updateMutation.mutate({ id: slide.id, data: { order: slide.order - 1 } });
                                                }
                                            }}
                                        >
                                            <ArrowUp className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            disabled={slide.order === slides.length - 1 || updateMutation.isPending}
                                            onClick={() => {
                                                const nextSlide = slides.find(s => s.order === slide.order + 1);
                                                if (nextSlide) {
                                                    updateMutation.mutate({ id: nextSlide.id, data: { order: slide.order } });
                                                    updateMutation.mutate({ id: slide.id, data: { order: slide.order + 1 } });
                                                }
                                            }}
                                        >
                                            <ArrowDown className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={slide.active}
                                        onCheckedChange={(checked) => updateMutation.mutate({ id: slide.id, data: { active: checked } })}
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(slide.id)} className="text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Image du Slide</Label>
                                        <ImageUpload
                                            value={slide.image}
                                            onChange={(url) => updateMutation.mutate({ id: slide.id, data: { image: url } })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Badge (ex: Nouveau, -20%)</Label>
                                        <Input
                                            value={slide.badge || ""}
                                            onChange={(e) => updateMutation.mutate({ id: slide.id, data: { badge: e.target.value } })}
                                            onBlur={(e) => updateMutation.mutate({ id: slide.id, data: { badge: e.target.value } })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Titre</Label>
                                        <Input
                                            value={slide.title}
                                            onChange={(e) => updateMutation.mutate({ id: slide.id, data: { title: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Sous-titre</Label>
                                        <Input
                                            value={slide.subtitle || ""}
                                            onChange={(e) => updateMutation.mutate({ id: slide.id, data: { subtitle: e.target.value } })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={slide.description || ""}
                                            onChange={(e) => updateMutation.mutate({ id: slide.id, data: { description: e.target.value } })}
                                            rows={2}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-2">
                                            <Label>Texte Bouton</Label>
                                            <Input
                                                value={slide.buttonText}
                                                onChange={(e) => updateMutation.mutate({ id: slide.id, data: { buttonText: e.target.value } })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Lien Bouton</Label>
                                            <Input
                                                value={slide.buttonLink}
                                                onChange={(e) => updateMutation.mutate({ id: slide.id, data: { buttonLink: e.target.value } })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {slides.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">Aucun slide configuration. Ajoutez votre premier slide !</p>
                </div>
            )}
        </div>
    );
};
