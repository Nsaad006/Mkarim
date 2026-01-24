import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "@/hooks/use-toast";
import { getImageUrl } from "@/lib/image-utils";
import { useSettings } from "@/context/SettingsContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { currency } = useSettings();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: "MATÉRIEL AJOUTÉ",
      description: `${product.name} est prêt pour déploiement.`,
    });
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(235,68,50,0.15)] hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-zinc-950">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges - Gaming Style */}
        <div className="absolute top-4 left-0 flex flex-col gap-2 items-start z-10">
          {product.badge && (
            <div className="bg-primary text-white text-[10px] font-black px-3 py-1 skew-x-[-12deg] -ml-1 shadow-lg">
              <span className="skew-x-[12deg] inline-block uppercase tracking-widest">{product.badge}</span>
            </div>
          )}
          {discount > 0 && (
            <div className="bg-white text-black text-[10px] font-black px-3 py-1 skew-x-[-12deg] -ml-1 shadow-lg border-l-4 border-primary">
              <span className="skew-x-[12deg] inline-block uppercase tracking-widest">-{discount}% OFF</span>
            </div>
          )}
        </div>

        {/* Quick View Icon - Desktop Only */}
        <div className="absolute top-4 right-4 opacity-0 md:group-hover:opacity-100 transition-all duration-300 transform translate-x-2 md:group-hover:translate-x-0 hidden md:block">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10 hover:bg-primary transition-colors">
            <Eye className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
            {product.category?.name || product.categoryId.replace("-", " ")}
          </span>
          <div className={`flex items-center gap-1 ${product.inStock ? "text-green-500" : "text-zinc-600"}`}>
            <div className={`w-1 h-1 rounded-full ${product.inStock ? "bg-green-500 animate-pulse" : "bg-zinc-600"}`} />
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-tighter">
              {product.inStock ? "OK" : "OUT"}
            </span>
          </div>
        </div>

        <h3 className="font-display text-[13px] md:text-lg font-black text-white italic tracking-tighter leading-tight mb-2 line-clamp-2 min-h-[2.5rem] md:min-h-[3.5rem] uppercase group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex-grow" />

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg md:text-2xl font-black text-primary italic tracking-tight">
            {product.price.toLocaleString()} <span className="text-[9px] not-italic text-zinc-500">{currency}</span>
          </span>
          {product.originalPrice && (
            <span className="text-[9px] md:text-xs text-zinc-600 line-through font-bold">
              {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Actions - Integrated Side-by-Side */}
        <div className="flex gap-1.5 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-none w-10 h-10 md:w-auto md:flex-1 md:h-11 border-white/10 text-white hover:bg-white/5 p-0 md:px-3 rounded-lg active:scale-95 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e);
            }}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden md:inline ml-2 text-[10px] font-black uppercase tracking-widest text-center">PANIER</span>
          </Button>

          <Link
            to={`/product/${product.id}`}
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button className="w-full h-10 md:h-11 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-lg shadow-[0_4px_10px_rgba(235,68,50,0.2)] active:scale-95 transition-all italic" size="sm">
              COMMANDER
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
