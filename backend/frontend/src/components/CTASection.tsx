import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/api/settings";

const CTASection = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const ctaTitle = settings?.ctaTitle || "Prêt à Équiper Votre Setup ?";
  const ctaSubtitle = settings?.ctaSubtitle || "Commandez maintenant et recevez votre matériel chez vous. Paiement à la livraison, sans risque.";
  const primaryBtnText = settings?.ctaPrimaryBtnText || "Découvrir les Produits";
  const primaryBtnLink = settings?.ctaPrimaryBtnLink || "/products";
  const secondaryBtnText = settings?.ctaSecondaryBtnText || "Nous Contacter";
  const secondaryBtnLink = settings?.ctaSecondaryBtnLink || "/contact";

  return (
    <section className="section-padding bg-gradient-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            {ctaTitle}
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8">
            {ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={primaryBtnLink}>
              <Button size="lg" variant="secondary" className="text-lg px-8 font-semibold">
                {primaryBtnText}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={secondaryBtnLink}>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                {secondaryBtnText}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
