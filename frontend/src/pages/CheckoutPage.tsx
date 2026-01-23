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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
          <Button onClick={() => navigate("/products")}>Découvrir nos produits</Button>
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
        phone: formData.phone,
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
      const error = err as AxiosError<{ error: string }>;
      console.error("Order submission error:", error);
      toast({
        title: "Erreur",
        description: error.response?.data?.error || error.message || "Une erreur est survenue lors de la commande.",
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au panier
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-8 shadow-sm border border-border"
            >
              <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nom complet
                    </Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email (optionnel)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre@email.com"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Pour recevoir la confirmation de commande</p>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Téléphone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+212 6XX XXX XXX"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Format: +212 6XX XXX XXX ou 06XX XXX XXX</p>
                  </div>

                  <div>
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Ville
                    </Label>
                    <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.name}>
                            {city.name} - {city.shippingFee} {currency} ({city.deliveryTime})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Adresse complète
                    </Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Rue, quartier, numéro..."
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Confirmer la commande
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-sm border border-border sticky top-24">
              <h2 className="text-xl font-bold mb-6">Résumé</h2>

              <div className="space-y-3 mb-6">
                {cartState.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {(item.product.price * item.quantity).toLocaleString()} {currency}
                    </span>
                  </div>
                ))}

                <div className="border-t border-border pt-3 flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{getTotal().toLocaleString()} {currency}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison {formData.city ? `(${formData.city})` : ''}</span>
                  <span>{shippingFee > 0 ? `${shippingFee} ${currency}` : shippingFee === 0 && formData.city ? 'Gratuit' : '-'}</span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{total.toLocaleString()} {currency}</span>
                </div>
              </div>

              <div className="bg-white border border-green-200 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">Paiement à la livraison</span>
                </div>
                <p className="text-green-700 text-xs">
                  Vous payez uniquement à la réception de votre commande
                </p>
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
