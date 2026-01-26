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
            <div className="min-h-screen bg-zinc-950 flex flex-col selection:bg-primary selection:text-white">
                <Navbar />
                <div className="container mx-auto px-4 pt-48 pb-16 flex-1 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md mx-auto text-center"
                    >
                        <div className="w-32 h-32 bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 relative shadow-2xl">
                            <ShoppingBag className="w-16 h-16 text-primary" />
                            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
                        </div>
                        <h1 className="font-display text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Votre panier est <span className="text-primary italic">vide</span></h1>
                        <p className="text-zinc-500 font-medium mb-10 max-w-xs mx-auto">
                            Le matériel de vos rêves attend d'être ajouté à votre arsenal.
                        </p>
                        <Link to="/products">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-8 h-14 rounded-xl shadow-[0_0_30px_rgba(235,68,50,0.3)] italic">
                                <ShoppingBag className="w-5 h-5 mr-3" />
                                Découvrir le Catalogue
                            </Button>
                        </Link>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col selection:bg-primary selection:text-white">
            <Navbar />
            <div className="container-custom pt-24 lg:pt-32 pb-40 lg:pb-32 flex-1">
                <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-12">
                    <div className="w-1 h-6 lg:w-2 lg:h-10 bg-primary skew-x-[-15deg]" />
                    <h1 className="font-display text-2xl lg:text-6xl font-black text-white italic uppercase tracking-tighter">Votre <span className="text-primary">Panier</span></h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-3 lg:space-y-6">
                        {state.items.map((item) => (
                            <motion.div
                                key={item.product.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="bg-zinc-900/40 backdrop-blur-xl rounded-xl lg:rounded-2xl p-3 lg:p-6 border border-white/5 group hover:border-primary/30 transition-all duration-300"
                            >
                                <div className="flex flex-row gap-3 lg:gap-8">
                                    {/* Product Image */}
                                    <div className="w-16 h-16 lg:w-32 lg:h-32 rounded-lg lg:rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 flex-shrink-0 group-hover:border-primary/50 transition-colors">
                                        <img
                                            src={getImageUrl(item.product.image)}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 flex flex-col justify-between min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <h3 className="font-display text-sm lg:text-2xl font-black text-white italic tracking-tighter uppercase leading-tight truncate">{item.product.name}</h3>
                                                <p className="text-[8px] lg:text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-0.5 lg:mt-2">
                                                    {item.product.category?.name || item.product.categoryId?.replace("-", " ") || "MATÉRIEL"}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeItem(item.product.id)}
                                                className="text-zinc-600 hover:text-primary hover:bg-primary/10 rounded-lg h-7 w-7 lg:h-10 lg:w-10 flex-shrink-0"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 lg:mt-6">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-1 bg-zinc-950 rounded-lg lg:rounded-xl p-0.5 lg:p-1 border border-white/5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 lg:h-8 lg:w-8 text-white hover:bg-white/5 active:scale-95"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
                                                </Button>
                                                <span className="w-6 lg:w-10 text-center text-[11px] lg:text-sm font-black text-white italic">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 lg:h-8 lg:w-8 text-white hover:bg-white/5 active:scale-95"
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                >
                                                    <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                                                </Button>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <p className="text-lg lg:text-3xl font-black text-primary italic tracking-tight">
                                                    {(item.product.price * item.quantity).toLocaleString()} <span className="text-[9px] lg:text-xs not-italic text-zinc-500">{currency}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary (Desktop) */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 sticky top-32 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                            <h2 className="font-display text-2xl font-black text-white italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">Résumé Tactique</h2>

                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Sous-total matériel</span>
                                    <span className="font-bold text-zinc-200">{getTotal().toLocaleString()} {currency}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Logistique nationale</span>
                                    <span className="text-xs font-black text-green-500 uppercase italic">Calculée au déploiement</span>
                                </div>
                                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                    <span className="font-display text-xl font-black text-white italic uppercase tracking-tighter">Total</span>
                                    <span className="text-4xl font-black text-primary italic tracking-tighter">{getTotal().toLocaleString()} <span className="text-sm not-italic font-bold">{currency}</span></span>
                                </div>
                            </div>

                            <Link to="/checkout">
                                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-16 rounded-2xl shadow-[0_0_30px_rgba(235,68,50,0.3)] hover:shadow-[0_0_40px_rgba(235,68,50,0.5)] transition-all active:scale-95 italic text-lg mb-4" size="lg">
                                    Finaliser la Commande
                                </Button>
                            </Link>

                            <Link to="/products">
                                <Button variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white font-black uppercase tracking-widest h-12 rounded-xl transition-all active:scale-95 italic text-sm mb-8">
                                    Revenir au Magasin
                                </Button>
                            </Link>

                            <div className="space-y-4">
                                {[
                                    { text: "Paiement à la livraison", color: "bg-green-500" },
                                    { text: "Logistique Express 24-72h", color: "bg-primary" },
                                    { text: "Certification Qualité Mkarim", color: "bg-white" }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <div className={`w-1.5 h-1.5 ${row.color} rounded-full shadow-[0_0_10px_currentColor]`} />
                                        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{row.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Mobile Summary Bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-white/5 p-4 pb-[env(safe-area-inset-bottom,1rem)] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Total arsenal</span>
                            <span className="text-xl font-black text-primary italic tracking-tighter leading-none">{getTotal().toLocaleString()} <span className="text-[10px] not-italic text-zinc-500">{currency}</span></span>
                        </div>
                        <span className="text-[8px] font-black text-green-500 uppercase italic tracking-tighter bg-green-500/10 px-2 py-1 rounded">Logistique incluse</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Link to="/checkout" className="block w-full">
                            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all italic text-base">
                                FINALISER LA COMMANDE
                            </Button>
                        </Link>
                        <Link to="/products" className="block w-full">
                            <Button variant="ghost" className="w-full text-zinc-600 hover:text-white font-black uppercase tracking-widest h-8 rounded-xl transition-all active:scale-95 italic text-[10px]">
                                REVENIR AU MAGASIN
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CartPage;
