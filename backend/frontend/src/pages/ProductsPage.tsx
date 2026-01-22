import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter, Grid3X3, LayoutList, SlidersHorizontal, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsApi } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { categoriesApi } from "@/api/categories";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";
  const searchParam = searchParams.get("search") || "";
  const [sortBy, setSortBy] = useState("featured");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories (active only)
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'active'],
    queryFn: () => categoriesApi.getAll(),
  });

  const categoryLabels = useMemo(() => {
    const labels: Record<string, string> = { "all": "Tous les produits" };
    categories.forEach(c => {
      labels[c.slug] = c.name;
    });
    return labels;
  }, [categories]);

  // Fetch products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', categoryParam, searchParam],
    queryFn: () => productsApi.getAll({
      categoryId: categoryParam !== "all" ? categoryParam : undefined,
      search: searchParam || undefined
    }),
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (inStockOnly && !product.inStock) {
        return false;
      }
      return true;
    });
  }, [products, inStockOnly]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [filteredProducts, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Page Header */}
        <section className="bg-card border-b border-border py-8 md:py-12">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                {categoryLabels[categoryParam] || "Nos Produits"}
                {searchParam && ` : "${searchParam}"`}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-muted-foreground">
                  {sortedProducts.length} produit{sortedProducts.length > 1 ? "s" : ""} disponible{sortedProducts.length > 1 ? "s" : ""}
                </p>
                {searchParam && (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-primary"
                    onClick={() => {
                      searchParams.delete("search");
                      setSearchParams(searchParams);
                    }}
                  >
                    Effacer la recherche
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-24 space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Catégories
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          if (key === "all") {
                            searchParams.delete("category");
                          } else {
                            searchParams.set("category", key);
                          }
                          setSearchParams(searchParams);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryParam === key || (key === "all" && !categoryParam)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-display font-semibold mb-4">Filtres</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="inStock"
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
                      />
                      <label htmlFor="inStock" className="text-sm cursor-pointer">
                        En stock uniquement
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtres
                </Button>

                <div className="flex items-center gap-3 ml-auto">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Trier par:
                  </span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Recommandés</SelectItem>
                      <SelectItem value="price-asc">Prix croissant</SelectItem>
                      <SelectItem value="price-desc">Prix décroissant</SelectItem>
                      <SelectItem value="name">Nom A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products */}
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    Aucun produit trouvé pour cette catégorie.
                  </p>
                </div>
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
