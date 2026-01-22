import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/image-utils";
import { useSettings } from "@/context/SettingsContext";

const CartPage = () => {
    const { state, removeItem, updateQuantity, getTotal } = useCart();
    const { currency } = useSettings();

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="container mx-auto px-4 pt-48 pb-16 flex-1 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto text-center"
                    >
                        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
                        <p className="text-muted-foreground mb-8">
                            Découvrez nos produits et ajoutez-les à votre panier
                        </p>
                        <Link to="/products">
                            <Button size="lg" className="gap-2">
                                <ShoppingBag className="w-5 h-5" />
                                Découvrir nos produits
                            </Button>
                        </Link>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 pt-20 sm:pt-24 pb-12 flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold mb-8">Panier</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {state.items.map((item) => (
                            <motion.div
                                key={item.product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border"
                            >
                                <div className="flex flex-row gap-3 sm:gap-6">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        <img
                                            src={getImageUrl(item.product.image)}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-base sm:text-lg line-clamp-2">{item.product.name}</h3>
                                                <p className="text-xs sm:text-sm text-muted-foreground">
                                                    {item.product.category?.name || item.product.categoryId?.replace("-", " ") || "Catégorie non spécifiée"}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(item.product.id)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-1 sm:gap-3 bg-muted/50 rounded-lg p-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </Button>
                                                <span className="w-6 sm:w-8 text-center text-sm sm:text-base font-medium">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 sm:h-8 sm:w-8"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                </Button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-lg sm:text-2xl font-bold text-primary">
                                                    {(item.product.price * item.quantity).toLocaleString()} {currency}
                                                </p>
                                                {item.quantity > 1 && (
                                                    <p className="text-[10px] sm:text-sm text-muted-foreground">
                                                        {item.product.price.toLocaleString()} {currency} / unité
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Résumé de la commande</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Sous-total</span>
                                    <span>{getTotal().toLocaleString()} {currency}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Livraison</span>
                                    <span className="text-green-600 font-medium">Calculée à la caisse</span>
                                </div>
                                <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{getTotal().toLocaleString()} {currency}</span>
                                </div>
                            </div>

                            <Link to="/checkout">
                                <Button className="w-full" size="lg">
                                    Passer la commande
                                </Button>
                            </Link>

                            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Paiement à la livraison</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Livraison rapide</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>Garantie satisfait ou remboursé</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
