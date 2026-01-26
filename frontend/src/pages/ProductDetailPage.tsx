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
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <main className="pt-32 flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-xs">Initialisation du matériel...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <main className="pt-32 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="font-display text-4xl font-black text-white uppercase italic mb-6 tracking-tighter">Matériel <span className="text-primary">Introuvable</span></h1>
            <Link to="/products">
              <Button className="bg-primary text-white font-black uppercase tracking-widest px-8 h-14 rounded-xl">Retour au Catalogue</Button>
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
  };

  const handleOrderNow = () => {
    navigate(`/checkout?product=${product.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-primary selection:text-white">
      <Navbar />
      <main className="pt-24 lg:pt-32">
        <div className="container-custom py-8 lg:py-16">
          {/* Breadcrumb */}
          <Link
            to="/products"
            className="inline-flex items-center gap-3 text-zinc-500 hover:text-white mb-10 transition-colors font-black uppercase tracking-[0.2em] text-[10px]"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
            Retour au Catalogue
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Product Image Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <ProductImageGallery
                images={product.images && product.images.length > 0 ? product.images : [product.image]}
                productName={product.name}
                badge={product.badge}
              />
              {/* Decorative glow */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4 skew-x-[-12deg]">
                  <span className="skew-x-[12deg]">{product.category?.name || product.categoryId.replace("-", " ")}</span>
                </div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white italic tracking-tighter leading-[0.9] mb-6">
                  {product.name}
                </h1>
                <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-xl">
                  {product.description}
                </p>
              </div>

              {/* Price & Stock */}
              <div className="flex flex-wrap items-center gap-8 bg-zinc-900/50 backdrop-blur-md p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-5xl font-black text-white italic tracking-tighter">
                      {product.price.toLocaleString()} <span className="text-primary text-2xl not-italic underline decoration-primary/50 decoration-4 underline-offset-8 ml-1">{currency}</span>
                    </span>
                    {product.originalPrice && (
                      <span className="text-2xl text-zinc-600 line-through font-bold tracking-tighter">
                        {product.originalPrice.toLocaleString()} {currency}
                      </span>
                    )}
                  </div>
                  <div className={`mt-4 inline-flex items-center gap-2 font-black uppercase tracking-[0.2em] text-[10px] ${product.inStock ? "text-green-500" : "text-primary"}`}>
                    <Check className={`w-4 h-4 ${product.inStock ? "text-green-500" : "text-primary"}`} />
                    {product.inStock ? "UNITÉ PRÊTE POUR EXPÉDITION" : "UNITÉ ÉPUISÉE"}
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!storeAvailability ? (
                  <div className="p-6 bg-primary/5 text-primary border border-primary/20 rounded-2xl text-center flex-1 font-black uppercase tracking-widest text-sm italic">
                    ACCÈS AUX LOGISTIQUES TEMPORAIREMENT SUSPENDU.
                  </div>
                ) : (
                  <>
                    <Button
                      size="lg"
                      className="flex-[1.5] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-16 rounded-2xl shadow-[0_0_30px_rgba(235,68,50,0.3)] hover:shadow-[0_0_40px_rgba(235,68,50,0.5)] transition-all active:scale-95 italic text-xl"
                      onClick={handleOrderNow}
                      disabled={!product.inStock}
                    >
                      COMMANDER MAINTENANT
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-widest h-16 rounded-2xl active:scale-95 italic text-lg"
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      + PANIER
                    </Button>
                  </>
                )}
              </div>

              {/* Specs */}
              {product.specs && product.specs.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-2">SPECIFICATIONS TECHNIQUES</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {product.specs.map((spec, index) => (
                      <div key={index} className="flex items-center gap-4 bg-zinc-950 border border-white/5 p-4 rounded-xl group hover:border-primary/30 transition-colors duration-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm font-bold text-zinc-300 uppercase tracking-tight">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 pt-10 border-t border-white/5">
                {[
                  { icon: Truck, label: "EXPRESS LOGISTICS", sub: "24-72H MAROC" },
                  { icon: ShieldCheck, label: "CERTIFIED GEAR", sub: "FULL WARRANTY" },
                  { icon: CreditCard, label: "SECURE COD", sub: "PAY ON RECEIPT" }
                ].map((badge, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-3">
                    <badge.icon className="w-6 h-6 text-primary" />
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-white tracking-[0.1em]">{badge.label}</p>
                      <p className="text-[8px] font-bold text-zinc-500 tracking-[0.05em]">{badge.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-32 pt-16 border-t border-white/5">
              <div className="flex items-center justify-between mb-12">
                <h2 className="font-display text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase">
                  UNITÉS <span className="text-primary">SIMILAIRES</span>
                </h2>
                <Link to="/products" className="text-[10px] font-black text-zinc-500 hover:text-primary uppercase tracking-[0.2em] transition-colors border-b border-zinc-800 hover:border-primary pb-1">
                  VOIR CATALOGUE COMPLET
                </Link>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
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
