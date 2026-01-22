import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Laptop,
  Monitor,
  Gamepad2,
  Headphones,
  Mouse,
  Keyboard,
  Tv,
  Cpu,
  Headset,
  Cable,
  Zap,
  Bluetooth,
  icons,
  type LucideIcon,
} from "lucide-react";

import { categoriesApi } from "@/api/categories";
import { settingsApi } from "@/api/settings";
import { useQuery } from "@tanstack/react-query";

const slugToIcon: Record<string, LucideIcon> = {
  "laptops": Laptop,
  "desktops": Cpu,
  "gaming-pc": Gamepad2,
  "monitors": Monitor,
  "gaming-monitors": Tv,
  "gaming-mice": Mouse,
  "gaming-keyboards": Keyboard,
  "gaming-headsets": Headset,
  "gaming-accessories": Gamepad2,
  "earphones": Bluetooth,
  "it-accessories": Cable,
  "electronics": Zap,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

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
    queryKey: ['categories', 'active'],
    queryFn: () => categoriesApi.getAll(),
  });

  const sectionTitle = settings?.categoriesTitle || "Nos Catégories";
  const sectionSubtitle = settings?.categoriesSubtitle || "Découvrez notre large sélection de produits IT et gaming de qualité supérieure";

  if (isLoading) return null;

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            {sectionTitle.includes("<span") ? (
              <span dangerouslySetInnerHTML={{ __html: sectionTitle }} />
            ) : sectionTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base px-4">
            {sectionSubtitle}
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 px-4 md:px-0"
        >
          {categories.map((category) => {
            const iconName = category.icon as keyof typeof icons;
            const IconComponent = (category.icon && icons[iconName])
              ? icons[iconName] as LucideIcon
              : (slugToIcon[category.slug] || Laptop);

            return (
              <motion.div key={category.slug} variants={item}>
                <Link
                  to={`/products?category=${category.slug}`}
                  className="group block p-4 md:p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 text-center hover:glow-primary h-[140px] md:h-[160px] flex flex-col items-center justify-center"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm md:text-base mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {category.productsCount || 0} produit{(category.productsCount || 0) !== 1 ? 's' : ''}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
