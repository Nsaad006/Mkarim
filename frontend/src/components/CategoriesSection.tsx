import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import * as icons from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

import { categoriesApi } from "@/api/categories";
import { settingsApi } from "@/api/settings";
import { useQuery } from "@tanstack/react-query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CategoriesSection = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const sectionTitle = settings?.categoriesTitle || "Nos Catégories";
  const sectionSubtitle = settings?.categoriesSubtitle || "Découvrez notre large sélection de produits IT et gaming de qualité supérieure";

  if (isLoading) return null;

  return (
    <section className="section-padding relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-20">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4 tracking-tight">
              {sectionTitle.includes("<") ? (
                <span dangerouslySetInnerHTML={{ __html: sectionTitle }} />
              ) : (
                sectionTitle
              )}
            </h2>
            <div className="w-24 h-1.5 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {sectionSubtitle}
            </p>
          </motion.div>
        </div>

        <div className="px-12 md:px-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: settings?.categoriesAutoPlayInterval || 3000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {categories.map((category) => {
                let IconComponent: LucideIcon | undefined;

                if (category.icon) {
                  const iconName = category.icon;
                  const normalizedInput = iconName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

                  const aliases: Record<string, string> = {
                    'motocycle': 'motorcycle',
                    'moto': 'motorcycle',
                    'scooter': 'bike',
                    'trottinette': 'bike',
                    'ecran': 'monitor',
                    'souris': 'mouse',
                    'clavier': 'keyboard',
                    'casque': 'headset'
                  };

                  const target = aliases[normalizedInput] || normalizedInput;
                  const foundKey = Object.keys(icons).find(
                    key => key.toLowerCase() === target
                  );
                  if (foundKey) {
                    IconComponent = icons[foundKey as keyof typeof icons] as LucideIcon;
                  }
                }

                if (!IconComponent) {
                  const slugMapping: Record<string, any> = {
                    'gaming-pc': icons.Gamepad2,
                    'laptops': icons.Laptop,
                    'gaming-monitors': icons.Tv,
                    'monitors': icons.Monitor,
                    'gaming-headsets': icons.Headset,
                    'gaming-mice': icons.Mouse,
                    'gaming-keyboards': icons.Keyboard,
                    'desktops': icons.Boxes,
                    'earphones': icons.Bluetooth,
                    'it-accessories': icons.Cable,
                    'components': icons.Cpu,
                    'trottinette': icons.Bike,
                    'all': icons.LayoutGrid
                  };
                  IconComponent = (slugMapping[category.slug] || icons.Package) as LucideIcon;
                }

                return (
                  <CarouselItem key={category.slug} className="pl-2 basis-1/2 md:basis-1/4 lg:basis-1/6">
                    <motion.div
                      variants={item}
                      whileHover={{ y: -5 }}
                      className="group h-full"
                    >
                      <Link
                        to={`/products?category=${category.slug}`}
                        className="relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl bg-card/50 border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden h-full aspect-square"
                      >
                        {/* Hover Background Glow */}
                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />

                        <div className="relative z-10 w-10 h-10 md:w-14 md:h-14 mb-3 rounded-xl bg-muted flex items-center justify-center border border-border group-hover:bg-primary group-hover:border-primary group-hover:rotate-6 transition-all duration-500 shadow-lg">
                          <IconComponent className="w-5 h-5 md:w-7 md:h-7 text-primary group-hover:text-primary-foreground transition-colors duration-500" />
                        </div>

                        <h3 className="relative z-10 font-bold text-[10px] md:text-[11px] lg:text-sm text-center group-hover:text-primary transition-colors duration-300 line-clamp-2 uppercase tracking-tighter leading-tight min-h-[2.2em] flex items-center justify-center px-1">
                          {category.name}
                        </h3>
                      </Link>
                    </motion.div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-12 md:-left-16" />
            <CarouselNext className="-right-12 md:-right-16" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
