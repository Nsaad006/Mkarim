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

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-primary selection:text-white">
      <Navbar />
      <main className="pt-24 lg:pt-32">
        {/* Hero Section */}
        <section className="relative section-padding overflow-hidden">
          <div className="container-custom relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 skew-x-[-12deg]">
                <span className="skew-x-[12deg]">NOTRE HISTOIRE</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-black mb-8 tracking-tighter text-white uppercase italic leading-[0.9]">
                {settings?.aboutTitle || (
                  <>
                    L'EXCELLENCE <span className="text-primary italic">GAMING</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                {settings?.aboutDescription || "Votre destination ultime pour le gaming au Maroc. Performance, passion et innovation au service des gamers."}
              </p>
            </motion.div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        </section>

        {/* Mission Section */}
        <section className="section-padding relative">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="font-display text-4xl font-black text-white uppercase italic tracking-tighter">Notre Mission</h2>
                </div>
                <div className="space-y-6">
                  <p className="text-zinc-300 text-xl font-medium leading-relaxed italic border-l-4 border-primary pl-6">
                    {settings?.aboutMission || "Rendre accessible à tous les Marocains des solutions informatiques et gaming de haute qualité. Nous croyons que chaque client mérite le meilleur."}
                  </p>
                  <p className="text-zinc-500 text-lg leading-relaxed">
                    Avec le paiement à la livraison, nous facilitons l'accès à la technologie
                    pour tous, partout au Maroc. Notre équipe passionnée est là pour vous
                    conseiller et vous accompagner dans vos choix.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-square md:aspect-video rounded-3xl overflow-hidden bg-zinc-900 border border-white/5 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200"
                    alt="Gaming Setup"
                    className="w-full h-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(235,68,50,0.5)]">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="font-display font-black text-3xl text-white tracking-tighter italic">+{kpis.totalCustomers}</p>
                        <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">Clients Satisfaits</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative glow */}
                <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding relative overflow-hidden">
          <div className="absolute inset-0 bg-zinc-900/30" />
          <div className="container-custom relative z-10">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">
                Nos <span className="text-primary">Valeurs</span>
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-8 rounded-3xl bg-zinc-950 border border-white/5 hover:border-primary/50 transition-all duration-500 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-black text-white text-xl uppercase italic tracking-tighter mb-4">{value.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-medium">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="section-padding relative">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { value: `${kpis.totalCustomers}+`, label: "Clients Satisfaits" },
                { value: `${kpis.totalProducts}+`, label: "Produits Disponibles" },
                { value: `${kpis.totalCities}+`, label: "Villes Desservies" },
                { value: "24h", label: "Délai de Réponse" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl text-center group hover:bg-zinc-900 transition-colors duration-500"
                >
                  <p className="font-display text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-2 group-hover:text-primary transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">{stat.label}</p>
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
