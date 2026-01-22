import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Truck, ShieldCheck, CreditCard, ArrowLeft, Check, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { productsApi } from "@/api/products";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { settingsApi } from "@/api/settings";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { useSettings } from "@/context/SettingsContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency } = useSettings();

  // Fetch current product
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id as string),
    enabled: !!id,
  });

  const { addItem } = useCart();

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const storeAvailability = settings?.storeAvailability ?? true;

  // Fetch all products for matching related ones (simple approach)
  const { data: allProducts = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsApi.getAll(),
    enabled: !!product,
  });

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((p) => p.id !== id && p.categoryId === product.categoryId)
      .slice(0, 4);
  }, [allProducts, product, id]);

  if (isProductLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold mb-4">Produit non trouvé</h1>
            <Link to="/products">
              <Button>Retour aux produits</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    toast({
      title: "Produit ajouté !",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  const handleOrderNow = () => {
    navigate(`/checkout?product=${product.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <div className="container-custom py-8">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux produits
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImageGallery
                images={product.images && product.images.length > 0 ? product.images : [product.image]}
                productName={product.name}
                badge={product.badge}
              />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <span className="text-sm text-primary uppercase tracking-wider font-medium">
                  {product.category?.name || product.categoryId.replace("-", " ")}
                </span>
                <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-4">
                  {product.name}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  {product.price.toLocaleString()} {currency}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.originalPrice.toLocaleString()} {currency}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${product.inStock
                ? "bg-success/20 text-success"
                : "bg-destructive/20 text-destructive"
                }`}>
                <Check className="w-4 h-4" />
                <span className="font-medium">
                  {product.inStock ? "En stock - Disponible" : "Rupture de stock"}
                </span>
              </div>

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-semibold mb-4">Caractéristiques</h3>
                  <ul className="space-y-2">
                    {product.specs.map((spec, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* COD Highlight */}
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">Paiement à la livraison disponible</p>
                    <p className="text-sm text-muted-foreground">Payez en cash à la réception</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!storeAvailability ? (
                  <div className="p-4 bg-warning/10 text-warning border border-warning/20 rounded-xl text-center flex-1">
                    La boutique est temporairement fermée. Les commandes sont suspendues.
                  </div>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="flex-1 btn-glow glow-primary text-lg"
                      onClick={handleOrderNow}
                      disabled={!product.inStock}
                    >
                      Commander Maintenant
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 text-lg"
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      Ajouter au Panier
                    </Button>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="w-5 h-5 text-primary" />
                  <span>Livraison 24-72h</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span>Garantie incluse</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>Paiement COD</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 pt-12 border-t border-border">
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
                Produits <span className="text-primary">Similaires</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
