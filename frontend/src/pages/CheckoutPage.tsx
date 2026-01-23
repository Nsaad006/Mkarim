import { useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag, MapPin, User, Phone, Home, CheckCircle2, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { ordersApi } from "@/api/orders";
import { useQuery } from "@tanstack/react-query";
import { citiesApi } from "@/api/cities";
import { productsApi } from "@/api/products";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { currency } = useSettings();
  const [searchParams] = useSearchParams();
  const { state: cartState, getTotal, clearCart, addItem } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Get product ID from query parameter
  const productId = searchParams.get('product');

  // Fetch product if coming from "Commander Maintenant"
  const { data: directProduct } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getById(productId!),
    enabled: !!productId,
  });

  // Add product to cart when coming from direct checkout
  useEffect(() => {
    if (directProduct && productId) {
      // Check if product is already in cart
      const existingItem = cartState.items.find(item => item.product.id === productId);
      if (!existingItem) {
        addItem(directProduct);
      }
      // Remove product parameter from URL to clean it up
      searchParams.delete('product');
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  }, [directProduct, productId]);

  // Use mocked API
  const { data: cities = [] } = useQuery({
    queryKey: ['cities'],
    queryFn: citiesApi.getAll,
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
  });

  // Redirect if cart is empty
  if (cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col selection:bg-primary selection:text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center flex-1 flex flex-col justify-center">
          <div className="w-32 h-32 bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 relative shadow-2xl">
            <ShoppingBag className="w-16 h-16 text-primary" />
            <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full" />
          </div>
          <h1 className="font-display text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Panier <span className="text-primary italic">Vide</span></h1>
          <p className="text-zinc-500 font-medium mb-10 max-w-xs mx-auto">Impossible de finaliser une commande sans matériel.</p>
          <Button onClick={() => navigate("/products")} className="bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest px-8 h-14 rounded-xl shadow-[0_0_30px_rgba(235,68,50,0.3)] italic mx-auto">Découvrir le Catalogue</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number
    const phoneRegex = /^(\+212|0)[5-7]\d{8}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      toast({
        title: "Numéro invalide",
        description: "Veuillez entrer un numéro de téléphone marocain valide.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a single order for all cart items
      const order = await ordersApi.create({
        items: cartState.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone.replace(/\s/g, ""),
        city: formData.city,
        address: formData.address,
      });

      // Pass the order number for display
      setOrderNumber(order.orderNumber);

      // Clear cart
      clearCart();

      toast({
        title: "Commande confirmée !",
        description: `Votre commande ${order.orderNumber} a été enregistrée avec succès.`,
      });

      // Navigate to success page after a short delay
      setTimeout(() => {
        navigate(`/order-success?orderNumber=${order.orderNumber}`);
      }, 2000);

    } catch (err) {
      const error = err as AxiosError<{ error: string; details?: { message: string }[] }>;
      console.error("Order submission error:", error);

      let description = error.response?.data?.error || error.message || "Une erreur est survenue lors de la commande.";

      if (error.response?.data?.details?.[0]?.message) {
        description += `: ${error.response.data.details[0].message}`;
      }

      toast({
        title: "Erreur",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCity = cities.find(c => c.name === formData.city);
  const shippingFee = selectedCity?.shippingFee || 0;
  const total = getTotal() + shippingFee;

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-primary selection:text-white">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-24">
        <Button
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="mb-10 gap-3 text-zinc-500 hover:text-white transition-colors font-black uppercase tracking-[0.2em] text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          Retour au Panier
        </Button>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-12 border border-white/5 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-8 md:mb-10 border-b border-white/5 pb-6 md:pb-8">
                <div className="w-1.5 h-8 md:w-2 md:h-10 bg-primary skew-x-[-15deg]" />
                <h1 className="font-display text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Finaliser <span className="text-primary tracking-tight">le Transfert</span></h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2 md:space-y-3">
                    <Label htmlFor="fullName" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 px-1">
                      <User className="w-3.5 h-3.5 text-primary" />
                      Nom complet de l'opérateur
                    </Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ex: Omar Alami"
                      className="bg-zinc-950 border-white/5 text-white h-12 md:h-14 rounded-xl focus:border-primary/50 transition-all font-bold placeholder:text-zinc-700"
                    />
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Label htmlFor="phone" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 px-1">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      Numéro de liaison
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="06 XX XX XX XX"
                      className="bg-zinc-950 border-white/5 text-white h-12 md:h-14 rounded-xl focus:border-primary/50 transition-all font-bold placeholder:text-zinc-700"
                    />
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Label htmlFor="city" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 px-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      Secteur de Déploiement
                    </Label>
                    <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                      <SelectTrigger className="bg-zinc-950 border-white/5 text-white h-12 md:h-14 rounded-xl focus:border-primary/50 transition-all font-bold uppercase tracking-wider">
                        <SelectValue placeholder="Choisir la ville" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white">
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name} className="focus:bg-white/5 uppercase tracking-wide font-black text-[10px] cursor-pointer">
                            {city.name} — {city.shippingFee} {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:space-y-3">
                    <Label htmlFor="address" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 px-1">
                      <Home className="w-3.5 h-3.5 text-primary" />
                      Coordonnées de Livraison
                    </Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Quartier, rue, numéro..."
                      className="bg-zinc-950 border-white/5 text-white h-12 md:h-14 rounded-xl focus:border-primary/50 transition-all font-bold placeholder:text-zinc-700"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  <Label htmlFor="email" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 px-1">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    Email pour le rapport (Optionnel)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="bg-zinc-950 border-white/5 text-white h-12 md:h-14 rounded-xl focus:border-primary/50 transition-all font-bold placeholder:text-zinc-700"
                  />
                </div>

                <div className="lg:hidden bg-zinc-950/50 rounded-2xl p-4 border border-white/5 mb-6">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total à régler</span>
                    <span className="text-3xl font-black text-primary italic tracking-tighter">{total.toLocaleString()} <span className="text-xs not-italic font-bold">{currency}</span></span>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest h-14 md:h-16 rounded-xl md:rounded-2xl shadow-[0_0_30px_rgba(235,68,50,0.3)] hover:shadow-[0_0_40px_rgba(235,68,50,0.5)] transition-all active:scale-95 italic text-lg md:text-xl mt-4" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      VERIFICATION...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6 mr-3" />
                      CONFIRMER LA COMMANDE
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-2">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 sticky top-32 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />

              <h2 className="font-display text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter mb-6 md:mb-8 border-b border-white/5 pb-4">Résumé Tactique</h2>

              <div className="space-y-4 mb-8 md:mb-10">
                <div className="max-h-48 md:max-h-64 overflow-y-auto pr-2 space-y-3 md:space-y-4 mb-4 md:mb-6 custom-scrollbar">
                  {cartState.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start gap-3 md:gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] md:text-xs font-black text-white uppercase italic tracking-tight line-clamp-1 truncate">{item.product.name}</p>
                        <p className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-0.5 md:mt-1">x{item.quantity}</p>
                      </div>
                      <span className="font-bold text-zinc-300 text-[10px] md:text-xs flex-shrink-0">
                        {(item.product.price * item.quantity).toLocaleString()} {currency}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 md:space-y-3 pt-4 md:pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-zinc-500 uppercase tracking-widest">SOUS-TOTAL</span>
                    <span className="text-zinc-200">{getTotal().toLocaleString()} {currency}</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-zinc-500 uppercase tracking-widest">LOGISTIQUE</span>
                    <span className={`uppercase italic ${shippingFee === 0 && formData.city ? 'text-green-500 font-black' : 'text-zinc-200'}`}>
                      {shippingFee > 0 ? `+${shippingFee} ${currency}` : shippingFee === 0 && formData.city ? 'OFFERTE' : '—'}
                    </span>
                  </div>

                  <div className="pt-4 md:pt-6 mt-2 md:mt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="font-display text-lg md:text-xl font-black text-white italic uppercase tracking-tighter leading-none">Total Net</span>
                    <span className="text-3xl md:text-4xl font-black text-primary italic tracking-tighter leading-none">{total.toLocaleString()} <span className="text-xs md:text-sm not-italic font-bold">{currency}</span></span>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-xl md:rounded-2xl p-4 md:p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 md:gap-3 text-green-500 mb-1 md:mb-2 relative z-10">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 shadow-[0_0_10px_currentColor]" />
                  <span className="font-black uppercase tracking-widest italic text-[9px] md:text-xs">PAIEMENT CASH A LA LIVRAISON</span>
                </div>
                <p className="text-[8px] md:text-[10px] font-bold text-green-500/70 uppercase tracking-wider relative z-10 leading-tight">
                  Réglez votre matériel en toute sécurité dès réception à domicile.
                </p>
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full -mr-12 -mt-12 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
