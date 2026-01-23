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

  const ctaTitle = settings?.ctaTitle || "PRÊT À RÉVOLUTIONNER VOTRE SETUP ?";
  const ctaSubtitle = settings?.ctaSubtitle || "Rejoignez l'élite des gamers marocains. Qualité certifiée, livraison express et service client dédié.";
  const primaryBtnText = settings?.ctaPrimaryBtnText || "Accéder à la Boutique";
  const primaryBtnLink = settings?.ctaPrimaryBtnLink || "/products";
  const secondaryBtnText = settings?.ctaSecondaryBtnText || "Besoin d'aide ?";
  const secondaryBtnLink = settings?.ctaSecondaryBtnLink || "/contact";

  return (
    <section className="py-24 relative overflow-hidden bg-zinc-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(235,68,50,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      {/* Decorative Border Glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(235,68,50,0.5)]" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(235,68,50,0.5)]" />

      <div className="container-custom relative z-10 px-4 md:px-0">
        <div className="max-w-4xl mx-auto backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/5 bg-zinc-900/60 p-6 md:p-16 text-center shadow-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-sm font-black uppercase tracking-[0.2em] mb-6 md:mb-8">
              Édition Limitée
            </span>

            <h2 className="font-display text-3xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-tight md:leading-none">
              {ctaTitle.split(' ').map((word, i) => (
                <span key={i} className={word.toLowerCase() === 'setup' || word.toLowerCase() === 'révolutionner' ? "text-primary" : ""}>
                  {word}{' '}
                </span>
              ))}
            </h2>

            <p className="text-base md:text-xl text-zinc-200 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2 md:px-0 font-medium">
              {ctaSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
              <Link to={primaryBtnLink} className="w-full sm:w-auto">
                <Button size="lg" className="h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl font-black btn-glow glow-primary uppercase tracking-wider w-full sm:w-auto">
                  {primaryBtnText}
                  <ArrowRight className="ml-2 md:ml-3 w-5 h-5 md:w-6 md:h-6" />
                </Button>
              </Link>
              <Link to={secondaryBtnLink} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-14 md:h-16 px-8 md:px-10 text-lg md:text-xl font-bold bg-transparent border-white/10 text-white hover:bg-white/5 uppercase tracking-wider w-full sm:w-auto">
                  {secondaryBtnText}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
