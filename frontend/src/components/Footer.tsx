import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/api/settings";
import { categoriesApi } from "@/api/categories";

const quickLinks = [
  { name: "Accueil", path: "/" },
  { name: "Nos Produits", path: "/products" },
  { name: "À Propos", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Footer = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'active'],
    queryFn: () => categoriesApi.getAll(),
  });

  const storeName = settings?.storeName || "MKARIM SOLUTION";
  const whatsappNumber = settings?.whatsappNumber || "+212 6 00 00 00 00";
  const codEnabled = settings?.codEnabled ?? true;
  return (
    <footer className="bg-card border-t border-border">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display text-xl font-bold">
                {storeName.split(" ").length > 1 ? (
                  <>
                    <span className="text-primary">{storeName.split(" ")[0]}</span>
                    <span className="text-foreground"> {storeName.split(" ").slice(1).join(" ")}</span>
                  </>
                ) : (
                  <span className="text-primary">{storeName}</span>
                )}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {settings?.footerDescription || "Votre partenaire de confiance pour les solutions PC & Gaming au Maroc. Qualité, performance et service client exceptionnel."}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Catégories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products?category=${category.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{settings?.contactAddress || "Casablanca, Maroc"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`tel:${whatsappNumber.replace(/\s+/g, "")}`} className="hover:text-primary transition-colors">
                  {whatsappNumber}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`mailto:${settings?.contactEmail || "contact@mkarim.ma"}`} className="hover:text-primary transition-colors">
                  {settings?.contactEmail || "contact@mkarim.ma"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              {settings?.footerCopyright || `© 2025 ${storeName} – Tous droits réservés`}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {codEnabled && (
                <>
                  <span className="flex items-center gap-1">
                    ✅ Paiement à la livraison
                  </span>
                  <span className="text-border">|</span>
                </>
              )}
              <span>🚚 Livraison partout au Maroc</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
