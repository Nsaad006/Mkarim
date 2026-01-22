import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Package, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import confetti from "canvas-confetti";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get("orderNumber");

    useEffect(() => {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 pt-48 pb-16 flex-1">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <div className="w-24 h-24 bg-green-100/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>

                    <h1 className="text-4xl font-bold mb-4">Commande confirmée !</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Merci pour votre confiance. Votre commande a été enregistrée avec succès.
                    </p>

                    {orderNumber && (
                        <div className="bg-card rounded-xl p-6 shadow-sm border border-border mb-8">
                            <p className="text-sm text-muted-foreground mb-2">Numéro de commande</p>
                            <p className="text-2xl font-mono font-bold text-primary">{orderNumber}</p>
                        </div>
                    )}

                    <div className="bg-muted/50 border border-border rounded-xl p-6 mb-8 text-left">
                        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            Prochaines étapes
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-primary">1</span>
                                </div>
                                <span className="text-muted-foreground">Vous recevrez un appel de confirmation dans les 24h</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-primary">2</span>
                                </div>
                                <span className="text-muted-foreground">Votre commande sera préparée et expédiée dans les plus brefs délais</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-primary">3</span>
                                </div>
                                <span className="text-muted-foreground">Vous payez uniquement à la réception de votre colis</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => navigate("/")} variant="outline" size="lg" className="gap-2">
                            <Home className="w-5 h-5" />
                            Retour à l'accueil
                        </Button>
                        <Button onClick={() => navigate("/products")} size="lg" className="gap-2">
                            <Package className="w-5 h-5" />
                            Continuer mes achats
                        </Button>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
