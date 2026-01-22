import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { productsApi } from "@/api/products";
import { settingsApi } from "@/api/settings";
import { useQuery } from "@tanstack/react-query";

const FeaturedProducts = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getAll({ inStock: true }),
  });

  const sectionTitle = settings?.featuredTitle || "Produits Populaires";
  const sectionSubtitle = settings?.featuredSubtitle || "Découvrez nos meilleures ventes et produits les plus appréciés";

  const featuredProducts = products.slice(0, 8);

  return (
    <section className="section-padding bg-card/50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              {sectionTitle.includes("<span") ? (
                <span dangerouslySetInnerHTML={{ __html: sectionTitle }} className="inline" />
              ) : sectionTitle}
            </h2>
            <p className="text-muted-foreground">
              {sectionSubtitle}
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="gap-2">
              Voir tous les produits
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">
            Aucun produit populaire disponible pour le moment.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
