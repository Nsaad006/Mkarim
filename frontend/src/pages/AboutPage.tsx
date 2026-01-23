import { motion } from "framer-motion";
import { Award, Users, Shield, Truck, Target, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/api/stats";
import { settingsApi } from "@/api/settings";

const values = [
  {
    icon: Shield,
    title: "Confiance",
    description: "Nous construisons des relations durables basées sur la transparence et l'honnêteté.",
  },
  {
    icon: Award,
    title: "Qualité",
    description: "Chaque produit est soigneusement sélectionné pour garantir des performances optimales.",
  },
  {
    icon: Users,
    title: "Service Client",
    description: "Notre équipe est dédiée à votre satisfaction, avant et après l'achat.",
  },
  {
    icon: Truck,
    title: "Fiabilité",
    description: "Livraison rapide et sécurisée partout au Maroc.",
  },
];

const AboutPage = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const { data: summary } = useQuery({
    queryKey: ['public-stats'],
    queryFn: statsApi.getPublicSummary,
  });

  const kpis = {
    totalOrders: 0, // Not available publicly
    totalProducts: summary?.totalProducts || 500,
    totalCustomers: summary?.totalCustomers || 5000,
    totalCities: summary?.totalCities || 50
  };
  const citiesCount = 14; // Default known cities, but could be dynamic if we had cities stats. 
  // Wait, I can just hardcode 50+ as before or use real data.

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-card border-b border-border">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                À Propos de Nous
              </span>
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                {settings?.aboutTitle || (
                  <>
                    <span className="text-primary">M</span>KARIM SOLUTION
                  </>
                )}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {settings?.aboutDescription || "Votre partenaire de confiance pour les solutions PC et Gaming au Maroc. Depuis notre création, nous nous engageons à fournir des produits de qualité avec un service client exceptionnel."}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-primary" />
                  <h2 className="font-display text-3xl font-bold">Notre Mission</h2>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {settings?.aboutMission || "Rendre accessible à tous les Marocains des solutions informatiques et gaming de haute qualité. Nous croyons que chaque client mérite le meilleur, c'est pourquoi nous sélectionnons avec soin chaque produit de notre catalogue."}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Avec le paiement à la livraison, nous facilitons l'accès à la technologie
                  pour tous, partout au Maroc. Notre équipe passionnée est là pour vous
                  conseiller et vous accompagner dans vos choix.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-card border border-border">
                  <img
                    src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800"
                    alt="Gaming Setup"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                        <Heart className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-display font-bold text-xl">+5000</p>
                        <p className="text-sm text-muted-foreground">Clients Satisfaits</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding bg-card/50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Nos <span className="text-primary">Valeurs</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Les principes qui guident notre engagement envers vous
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-card border border-border"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: `${kpis.totalCustomers}+`, label: "Clients Satisfaits" },
                { value: `${kpis.totalProducts}+`, label: "Produits Disponibles" },
                { value: `${kpis.totalCities}+`, label: "Villes Desservies" },
                { value: "24h", label: "Délai de Réponse" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-card border border-border"
                >
                  <p className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
