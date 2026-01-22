import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import DEFAULT_HERO_IMAGE from "@/assets/hero-gaming.jpg";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/api/settings";
import { getImageUrl } from "@/lib/image-utils";

const HeroSection = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const storeName = settings?.storeName || "MKARIM SOLUTION";
  const heroSubtitle = settings?.heroSubtitle || "🎮 Solutions Gaming & IT au Maroc";
  const heroTitlePart2 = settings?.heroTitle || "PC & Gaming de Qualité";
  const heroDescription = settings?.heroDescription || "PCs haute performance & accessoires gaming. Payez à la livraison partout au Maroc.";
  const heroImage = settings?.heroImage ? getImageUrl(settings.heroImage) : DEFAULT_HERO_IMAGE;

  const primaryBtnText = settings?.heroPrimaryBtnText || "Commander Maintenant";
  const primaryBtnLink = settings?.heroPrimaryBtnLink || "/products";
  const secondaryBtnText = settings?.heroSecondaryBtnText || "Découvrir les Produits";
  const secondaryBtnLink = settings?.heroSecondaryBtnLink || "/products";

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 py-12 md:py-20">
        <div className="max-w-3xl text-center md:text-left mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
              {heroSubtitle}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            {storeName.split(" ").length > 1 ? (
              <>
                <span className="text-primary">{storeName.split(" ")[0]}</span>
                {storeName.split(" ").slice(1).join(" ")}
              </>
            ) : (
              <span className="text-primary">{storeName}</span>
            )}
            <br />
            <span className="text-muted-foreground">{heroTitlePart2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto md:mx-0 whitespace-pre-wrap"
          >
            {heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mb-12"
          >
            <Link to={primaryBtnLink}>
              <Button size="lg" className="btn-glow glow-primary text-lg px-8">
                {primaryBtnText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={secondaryBtnLink}>
              <Button size="lg" variant="outline" className="text-lg px-8">
                {secondaryBtnText}
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center md:justify-start gap-3"
          >
            <div className="trust-badge">
              <CreditCard className="w-5 h-5 text-primary" />
              <span>Paiement à la livraison</span>
            </div>
            <div className="trust-badge">
              <Truck className="w-5 h-5 text-primary" />
              <span>Livraison rapide</span>
            </div>
            <div className="trust-badge">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Garantie & Service</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
