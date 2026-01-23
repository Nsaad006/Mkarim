import { useState, useEffect, useMemo } from "react";
import {
    ChevronDown,
    Check,
    RotateCcw,
    Zap,
    Filter
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/data/products";
import { Category } from "@/api/categories";

import * as LucideIcons from "lucide-react";

interface FilterSidebarProps {
    products: Product[];
    categories: Category[];
    activeFilters: any;
    updateFilters: (filters: any) => void;
    onClose?: () => void;
}

export const FilterSidebar = ({ products, categories, activeFilters, updateFilters, onClose }: FilterSidebarProps) => {

    // Safety resolver for category icons
    const getCategoryIcon = (cat: any) => {
        // 1. Try resolving by explicitly stored DB icon name
        if (cat.icon) {
            const iconName = cat.icon;
            const normalizedInput = iconName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            // Handle common aliases/typos/French terms
            const aliases: Record<string, string> = {
                'motocycle': 'motorcycle',
                'moto': 'motorcycle',
                'scooter': 'bike',
                'trottinette': 'bike',
                'ecran': 'monitor',
                'souris': 'mouse',
                'clavier': 'keyboard',
                'casque': 'headset'
            };

            const target = aliases[normalizedInput] || normalizedInput;
            const foundKey = Object.keys(LucideIcons).find(
                key => key.toLowerCase() === target
            );
            if (foundKey) return (LucideIcons as any)[foundKey];
        }

        // 2. Try resolving by slug mapping fallback
        const slug = cat.slug || cat.id;
        const slugMapping: Record<string, any> = {
            'gaming-pc': LucideIcons.Gamepad2,
            'laptops': LucideIcons.Laptop,
            'gaming-monitors': LucideIcons.Tv,
            'monitors': LucideIcons.Monitor,
            'gaming-headsets': LucideIcons.Headset,
            'gaming-mice': LucideIcons.Mouse,
            'gaming-keyboards': LucideIcons.Keyboard,
            'desktops': LucideIcons.Boxes,
            'earphones': LucideIcons.Bluetooth,
            'it-accessories': LucideIcons.Cable,
            'components': LucideIcons.Cpu,
            'trottinette': LucideIcons.Bike,
            'all': LucideIcons.LayoutGrid
        };

        if (slugMapping[slug]) return slugMapping[slug];

        // 3. Fallback to generic filter
        return Filter;
    };
    const [priceRange, setPriceRange] = useState<[number, number]>([
        activeFilters.minPrice || 0,
        activeFilters.maxPrice || 100000
    ]);

    useEffect(() => {
        setPriceRange([activeFilters.minPrice || 0, activeFilters.maxPrice || 100000]);
    }, [activeFilters.minPrice, activeFilters.maxPrice]);

    const handlePriceChange = (value: number[]) => {
        setPriceRange([value[0], value[1]]);
    };

    const applyPriceFilter = () => {
        updateFilters({ ...activeFilters, minPrice: priceRange[0], maxPrice: priceRange[1] });
    };

    const toggleArrayFilter = (field: string, value: string) => {
        const current = activeFilters[field] || [];
        const updated = current.includes(value)
            ? current.filter((v: string) => v !== value)
            : [...current, value];
        updateFilters({ ...activeFilters, [field]: updated });
    };

    // Extract Specs Dynamically based on current category products
    const dynamicSpecs = useMemo(() => {
        if (!products || products.length === 0) return { cpus: [], gpus: [], others: [] };

        const cpus = new Set<string>();
        const gpus = new Set<string>();
        const others = new Set<string>();

        const cpuKeywords = ['ryzen', 'core i', 'intel', 'amd'];
        const gpuKeywords = ['rtx', 'gtx', 'radeon', 'rx', 'nvidia'];

        // 1. Resolve active category
        const activeCatObj = activeFilters.category === 'all'
            ? null
            : categories.find(c => String(c.slug) === String(activeFilters.category) || String(c.id) === String(activeFilters.category));

        // 2. Filter products that belong to this category (only if not 'all')
        const relevantProducts = activeCatObj
            ? products.filter(p => String(p.categoryId) === String(activeCatObj.id) || String(p.categoryId) === String(activeCatObj.slug))
            : products;

        // 3. Extract and categorize specs
        relevantProducts.forEach(product => {
            if (product.specs && Array.isArray(product.specs)) {
                product.specs.forEach(spec => {
                    const lowerSpec = spec.toLowerCase();
                    if (cpuKeywords.some(k => lowerSpec.includes(k))) cpus.add(spec);
                    else if (gpuKeywords.some(k => lowerSpec.includes(k))) gpus.add(spec);
                    else if (spec.trim() !== "") others.add(spec);
                });
            }
        });

        return {
            cpus: Array.from(cpus).sort(),
            gpus: Array.from(gpus).sort(),
            others: Array.from(others).sort().slice(0, 20)
        };
    }, [products, activeFilters.category, categories]);

    const resetAll = () => {
        updateFilters({
            category: 'all',
            cpus: [],
            gpus: [],
            others: [],
            games: [],
            minPrice: 0,
            maxPrice: 100000,
            inStockOnly: false,
        });
        if (onClose) onClose();
    };

    return (
        <div className="flex flex-col h-full bg-zinc-950/50 backdrop-blur-xl border-r border-white/5 w-full lg:w-72">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-950/80 z-20">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-primary skew-x-[-15deg]" />
                    <h2 className="font-display font-black text-white text-lg uppercase italic tracking-tighter">Filtres</h2>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAll}
                    className="text-[10px] font-black text-zinc-500 hover:text-primary uppercase tracking-widest gap-2"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                </Button>
            </div>

            <ScrollArea className="flex-1 px-4 py-6">
                <div className="space-y-8 pb-8">

                    {/* Main Filter: Categories */}
                    <div>
                        <h3 className="px-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Secteur d'Arsenal</h3>
                        <div className="space-y-1">
                            {[{ id: 'all', name: 'Tous les Produits', slug: 'all', icon: 'LayoutGrid' }, ...categories].map((cat) => {
                                const categorySlug = (cat as any).slug || cat.id;
                                const Icon = getCategoryIcon(cat);
                                const isActive = activeFilters.category === categorySlug;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => updateFilters({ ...activeFilters, category: categorySlug })}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                            ? 'bg-primary text-white shadow-[0_0_20px_rgba(235,68,50,0.3)] translate-x-1'
                                            : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-primary'}`} />
                                        <span className="text-xs font-black uppercase italic tracking-tight">{cat.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dynamic Specs based on Category */}
                    <div className="space-y-6 pt-4 border-t border-white/5">
                        <h3 className="px-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-2">Spécifications Tactiques</h3>

                        <Accordion type="multiple" className="w-full space-y-2">
                            {/* CPU Group */}
                            {dynamicSpecs.cpus.length > 0 && (
                                <AccordionItem value="cpus" className="border-none">
                                    <AccordionTrigger className="flex items-center gap-3 py-3 px-4 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all hover:no-underline">
                                        <div className="flex items-center gap-3 flex-1 text-left">
                                            <LucideIcons.Cpu className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black text-white uppercase tracking-wider">Processeurs</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 px-1">
                                        <div className="space-y-1">
                                            {dynamicSpecs.cpus.map((cpu) => (
                                                <div
                                                    key={cpu}
                                                    onClick={() => toggleArrayFilter('cpus', cpu)}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${activeFilters.cpus?.includes(cpu) ? 'bg-primary border-primary' : 'border-white/10 group-hover:border-white/30'}`}>
                                                            {activeFilters.cpus?.includes(cpu) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={`text-xs font-bold uppercase tracking-tight transition-colors ${activeFilters.cpus?.includes(cpu) ? 'text-white' : 'text-zinc-400'}`}>
                                                            {cpu}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}

                            {/* GPU Group */}
                            {dynamicSpecs.gpus.length > 0 && (
                                <AccordionItem value="gpus" className="border-none">
                                    <AccordionTrigger className="flex items-center gap-3 py-3 px-4 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all hover:no-underline">
                                        <div className="flex items-center gap-3 flex-1 text-left">
                                            <Zap className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black text-white uppercase tracking-wider">Graphisme (GPU)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 px-1">
                                        <div className="space-y-1">
                                            {dynamicSpecs.gpus.map((gpu) => (
                                                <div
                                                    key={gpu}
                                                    onClick={() => toggleArrayFilter('gpus', gpu)}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${activeFilters.gpus?.includes(gpu) ? 'bg-primary border-primary' : 'border-white/10 group-hover:border-white/30'}`}>
                                                            {activeFilters.gpus?.includes(gpu) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={`text-xs font-bold uppercase tracking-tight transition-colors ${activeFilters.gpus?.includes(gpu) ? 'text-white' : 'text-zinc-400'}`}>
                                                            {gpu}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}

                            {/* Other Specs (dynamic per category) */}
                            {dynamicSpecs.others.length > 0 && (
                                <AccordionItem value="others" className="border-none">
                                    <AccordionTrigger className="flex items-center gap-3 py-3 px-4 bg-zinc-900 border border-white/5 rounded-xl hover:bg-zinc-800 transition-all hover:no-underline">
                                        <div className="flex items-center gap-3 flex-1 text-left">
                                            <LucideIcons.Boxes className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black text-white uppercase tracking-wider">
                                                {activeFilters.category === 'all' ? 'Hardware Global' : 'Filtres Avancés'}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-2 px-1">
                                        <div className="space-y-1">
                                            {dynamicSpecs.others.map((spec) => (
                                                <div
                                                    key={spec}
                                                    onClick={() => toggleArrayFilter('others', spec)}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${activeFilters.others?.includes(spec) ? 'bg-primary border-primary' : 'border-white/10 group-hover:border-white/30'}`}>
                                                            {activeFilters.others?.includes(spec) && <Check className="w-3 h-3 text-white" />}
                                                        </div>
                                                        <span className={`text-[11px] font-bold uppercase tracking-tight transition-colors ${activeFilters.others?.includes(spec) ? 'text-white' : 'text-zinc-400'}`}>
                                                            {spec}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            )}
                        </Accordion>
                    </div>

                    {/* Price Range (Permanent Global Filter) */}
                    <div className="pt-8 border-t border-white/5">
                        <h3 className="px-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Budget de Déploiement</h3>
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 space-y-6 shadow-xl">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest px-1">MIN (MAD)</p>
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) => {
                                            const val = Math.min(Number(e.target.value), priceRange[1]);
                                            handlePriceChange([val, priceRange[1]]);
                                            updateFilters({ ...activeFilters, minPrice: val, maxPrice: priceRange[1] });
                                        }}
                                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3 py-2 text-xs font-black text-white italic outline-none focus:border-primary/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest px-1">MAX (MAD)</p>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) => {
                                            const val = Math.max(Number(e.target.value), priceRange[0]);
                                            handlePriceChange([priceRange[0], val]);
                                            updateFilters({ ...activeFilters, minPrice: priceRange[0], maxPrice: val });
                                        }}
                                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-3 py-2 text-xs font-black text-white italic outline-none focus:border-primary/50"
                                    />
                                </div>
                            </div>

                            <Slider
                                value={priceRange}
                                min={0}
                                max={100000}
                                step={500}
                                onValueChange={handlePriceChange}
                                onValueCommit={applyPriceFilter}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>

            {/* Mobile Apply Button */}
            {onClose && (
                <div className="p-6 border-t border-white/5 bg-zinc-950/80">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14 rounded-xl shadow-lg" onClick={onClose}>
                        Valider le Matériel
                    </Button>
                </div>
            )}
        </div>
    );
};
