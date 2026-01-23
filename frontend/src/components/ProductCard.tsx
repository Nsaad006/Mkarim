import { Link } from "react-router-dom";
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
  const { addItem } = useCart();
  const { currency } = useSettings();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on a button or link
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return;
    }
    // Navigate to product page
    window.location.href = `/product/${product.id}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="product-card group cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-secondary/50 flex-shrink-0">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
            {product.badge}
          </span>
        )}

        {discount > 0 && !product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-success text-primary-foreground text-xs font-semibold rounded-full">
            -{discount}%
          </span>
        )}



        {/* Quick Actions */}
        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()}>
            <Button size="icon" variant="secondary" className="rounded-full">
              <Eye className="w-5 h-5" />
            </Button>
          </Link>
          <Button
            size="icon"
            className="rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e);
            }}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content - Flex grow to push buttons to bottom */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {product.category?.name || product.categoryId.replace("-", " ")}
          </span>
          {/* Stock Status */}
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.inStock
            ? "bg-success/20 text-success"
            : "bg-destructive/20 text-destructive"
            }`}>
            {product.inStock ? "En stock" : "Rupture"}
          </span>
        </div>
        <h3 className="font-semibold mt-1 mb-2 line-clamp-2 hover:text-primary transition-colors text-sm md:text-base">
          {product.name}
        </h3>
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Spacer to push price and buttons to bottom */}
        <div className="flex-grow"></div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg md:text-xl font-bold text-primary">
            {product.price.toLocaleString()} {currency}
          </span>
          {product.originalPrice && (
            <span className="text-xs md:text-sm text-muted-foreground line-through">
              {product.originalPrice.toLocaleString()} {currency}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(e);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
          <Link
            to={`/product/${product.id}`}
            className="flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button className="w-full btn-glow" size="sm">
              Commander
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
