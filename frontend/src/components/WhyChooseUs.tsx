import { motion } from "framer-motion";
import { ShieldCheck, Truck, Headphones, Award, CreditCard, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/api/settings";

const features = [
  {
    icon: CreditCard,
    title: "Paiement à la Livraison",
    description: "Payez en cash à la réception de votre commande. Simple et sécurisé.",
  },
  {
    icon: Truck,
    title: "Livraison Rapide",
    description: "Livraison partout au Maroc en 24-72h selon votre ville.",
  },
  {
    icon: ShieldCheck,
    title: "Garantie Produits",
    description: "Tous nos produits sont couverts par une garantie officielle.",
  },
  {
    icon: Award,
    title: "Qualité Premium",
    description: "Nous sélectionnons uniquement des produits de qualité supérieure.",
  },
  {
    icon: Headphones,
    title: "Support Client",
    description: "Notre équipe est disponible pour vous accompagner avant et après achat.",
  },
  {
    icon: Clock,
    title: "Réponse Rapide",
    description: "Confirmation de commande sous 24h et suivi personnalisé.",
  },
];

const WhyChooseUs = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const sectionTitle = settings?.whyTitle || "Pourquoi Choisir MKARIM SOLUTION ?";
  const sectionSubtitle = settings?.whySubtitle || "La confiance de milliers de clients au Maroc";

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {sectionTitle.includes("<span") ? (
              <span dangerouslySetInnerHTML={{ __html: sectionTitle }} className="inline" />
            ) : sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {sectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
