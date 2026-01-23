import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
  Loader2,
  X,
  ChevronRight,
  Search
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsApi } from "@/api/products";
import { categoriesApi } from "@/api/categories";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FilterSidebar } from "@/components/FilterSidebar";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";

  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  // Advanced Filtering State
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    cpus: searchParams.get("cpus")?.split(",") || [],
    gpus: searchParams.get("gpus")?.split(",") || [],
    others: searchParams.get("others")?.split(",") || [],
    games: searchParams.get("games")?.split(",") || [],
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 100000,
    inStockOnly: searchParams.get("inStock") === "true",
  });

  // Sync state with URL
  useEffect(() => {
    const params: any = {};
    if (filters.category !== "all") params.category = filters.category;
    if (filters.cpus.length > 0) params.cpus = filters.cpus.join(",");
    if (filters.gpus.length > 0) params.gpus = filters.gpus.join(",");
    if (filters.others.length > 0) params.others = filters.others.join(",");
    if (filters.games.length > 0) params.games = filters.games.join(",");
    if (filters.minPrice > 0) params.minPrice = filters.minPrice.toString();
    if (filters.maxPrice < 100000) params.maxPrice = filters.maxPrice.toString();
    if (filters.inStockOnly) params.inStock = "true";
    if (searchParam) params.search = searchParam;

    setSearchParams(params, { replace: true });
  }, [filters, searchParam]);

  // Fetch all products
  const { data: allProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const isLoading = productsLoading || categoriesLoading;

  // Complex Client-side Filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search
      if (searchParam && !product.name.toLowerCase().includes(searchParam.toLowerCase())) return false;

      // Category
      const selectedCat = categories.find(c => c.slug === filters.category || c.id === filters.category);
      if (filters.category !== "all" &&
        product.categoryId !== selectedCat?.id &&
        product.categoryId !== selectedCat?.slug) return false;

      // Price
      if (product.price < filters.minPrice || product.price > filters.maxPrice) return false;

      // Stock
      if (filters.inStockOnly && !product.inStock) return false;

      const productText = (product.name + " " + (product.specs?.join(" ") || "") + " " + (product.description || "")).toLowerCase();

      // CPU
      if (filters.cpus?.length > 0) {
        if (!filters.cpus.some(cpu => productText.includes(cpu.toLowerCase()))) return false;
      }

      // GPU
      if (filters.gpus?.length > 0) {
        if (!filters.gpus.some(gpu => productText.includes(gpu.toLowerCase()))) return false;
      }

      // Dynamic Specs (Others)
      if (filters.others?.length > 0) {
        if (!filters.others.some(spec => productText.includes(spec.toLowerCase()))) return false;
      }

      // Games
      if (filters.games?.length > 0) {
        if (!filters.games.some(game => productText.includes(game.toLowerCase()))) return false;
      }

      return true;
    });
  }, [allProducts, filters, searchParam]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name": return a.name.localeCompare(b.name);
        default: return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  const removeFilter = (type: string, value?: string) => {
    if (type === 'search') {
      searchParams.delete("search");
      setSearchParams(searchParams);
      return;
    }

    if (type === 'minPrice' || type === 'maxPrice') {
      setFilters({ ...filters, minPrice: 0, maxPrice: 100000 });
      return;
    }

    if (type === 'inStockOnly') {
      setFilters({ ...filters, inStockOnly: false });
      return;
    }

    if (type === 'category') {
      setFilters({ ...filters, category: 'all' });
      return;
    }

    const current = (filters as any)[type] || [];
    setFilters({
      ...filters,
      [type]: current.filter((v: string) => v !== value)
    });
  };

  const activeFilterChips = useMemo(() => {
    const chips: { type: string, value: string, label: string }[] = [];
    if (searchParam) chips.push({ type: 'search', value: searchParam, label: `Recherche: ${searchParam}` });
    if (filters.category !== 'all') chips.push({ type: 'category', value: filters.category, label: `Cat: ${filters.category}` });
    filters.cpus.forEach(v => chips.push({ type: 'cpus', value: v, label: v.toUpperCase() }));
    filters.gpus.forEach(v => chips.push({ type: 'gpus', value: v, label: v.toUpperCase() }));
    filters.others.forEach(v => chips.push({ type: 'others', value: v, label: v.toUpperCase() }));
    filters.games.forEach(v => chips.push({ type: 'games', value: v, label: v.toUpperCase() }));
    if (filters.minPrice > 0 || filters.maxPrice < 100000) {
      chips.push({ type: 'price', value: 'price', label: `${filters.minPrice}-${filters.maxPrice} MAD` });
    }
    if (filters.inStockOnly) chips.push({ type: 'inStockOnly', value: 'true', label: 'En Stock' });
    return chips;
  }, [filters, searchParam]);

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-primary selection:text-white">
      <Navbar />
      <main className="pt-24 lg:pt-32">
        {/* Simplified Header */}
        <section className="relative py-8 lg:py-12 border-b border-white/5">
          <div className="container-custom relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-6 bg-primary skew-x-[-15deg]" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">ARSYENAL MKARIM</span>
                </div>
                <h1 className="font-display text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter">
                  Catalogue <span className="text-primary tracking-tight">Tech</span>
                </h1>
              </div>
              <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">ARTICLES TROUVÉS</p>
                  <p className="text-xl font-black text-white italic tracking-tighter">{sortedProducts.length}</p>
                </div>
                <div className="w-[1px] h-8 bg-white/10 hidden sm:block" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-zinc-950 border-white/5 text-white font-bold uppercase tracking-wider h-12">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-white/10 text-white">
                    <SelectItem value="featured">Recommandés</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-32 rounded-3xl overflow-hidden shadow-2xl">
                <FilterSidebar
                  products={allProducts}
                  categories={categories}
                  activeFilters={filters}
                  updateFilters={setFilters}
                />
              </div>
            </aside>

            {/* Mobile Filter Trigger */}
            <div className="lg:hidden">
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full h-14 bg-zinc-900 border-white/5 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl">
                    <SlidersHorizontal className="w-5 h-5 mr-3 text-primary" />
                    UNITÉ DE FILTRAGE
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 bg-transparent border-none w-[300px] sm:w-[350px]">
                  <FilterSidebar
                    products={allProducts}
                    categories={categories}
                    activeFilters={filters}
                    updateFilters={setFilters}
                    onClose={() => setShowFilters(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 space-y-8">

              {/* Active Filter Chips */}
              <AnimatePresence>
                {activeFilterChips.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 items-center"
                  >
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">ACTIF:</span>
                    {activeFilterChips.map((chip) => (
                      <motion.div
                        key={`${chip.type}-${chip.value}`}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full group hover:border-primary/50 transition-colors"
                      >
                        <span className="text-[10px] font-black text-primary uppercase tracking-wider">{chip.label}</span>
                        <button
                          onClick={() => removeFilter(chip.type, chip.value)}
                          className="text-primary/40 hover:text-primary transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                    <button
                      onClick={() => setFilters({
                        category: 'all',
                        cpus: [],
                        gpus: [],
                        others: [],
                        games: [],
                        minPrice: 0,
                        maxPrice: 100000,
                        inStockOnly: false
                      })}
                      className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest ml-2 transition-colors underline underline-offset-4"
                    >
                      Réinitialiser tout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Products Area */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 bg-zinc-900/20 rounded-3xl border border-white/5">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  </div>
                  <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-xs">Synchronisation du catalogue...</p>
                </div>
              ) : sortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                  {sortedProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-40 bg-zinc-900/20 rounded-3xl border border-dashed border-white/10"
                >
                  <Search className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                  <h3 className="font-display text-2xl font-black text-white italic uppercase tracking-tighter mb-2">
                    Aucune Correspondance
                  </h3>
                  <p className="text-zinc-500 font-medium max-w-xs mx-auto mb-8">
                    Le matériel spécifié n'est pas disponible dans notre arsenal actuel.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      category: 'all',
                      cpus: [],
                      gpus: [],
                      others: [],
                      games: [],
                      minPrice: 0,
                      maxPrice: 100000,
                      inStockOnly: false
                    })}
                    className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-12 rounded-xl"
                  >
                    Réinitialiser les paramètres
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
