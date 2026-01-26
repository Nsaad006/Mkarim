import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ShoppingCart, Phone, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/api/settings";

const navLinks = [
  { name: "Accueil", path: "/" },
  { name: "Produits", path: "/products" },
  { name: "À Propos", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { getItemCount, lastAddedTime } = useCart();
  const cartCount = getItemCount();
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (lastAddedTime > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [lastAddedTime]);

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
  });

  const storeName = settings?.storeName || "MKARIM SOLUTION";
  const whatsappNumber = settings?.whatsappNumber || "+212 6 00 00 00 00";

  const executeSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const handleButtonClick = () => {
    if (!isSearchOpen) {
      setIsSearchOpen(true);
    } else {
      executeSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-glass border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl md:text-2xl font-bold">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div ref={searchRef} className={`relative flex items-center justify-end transition-all duration-300 ${isSearchOpen ? "w-48 md:w-64" : "w-10"}`}>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "100%" }}
                    exit={{ opacity: 0, width: 0 }}
                    onSubmit={handleSearch}
                    className="absolute right-0 flex items-center w-full"
                  >
                    <input
                      type="text"
                      autoFocus
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-secondary/50 border border-border rounded-full py-1.5 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    />
                  </motion.form>
                )}
              </AnimatePresence>
              <Button
                variant="ghost"
                size="icon"
                className="relative z-10"
                onClick={handleButtonClick}
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <Link to="/cart" className="relative group">
              <motion.div
                animate={isPulsing ? {
                  scale: [1, 1.3, 1],
                  rotate: [0, 10, -10, 0],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
                  <ShoppingCart className={`w-6 h-6 transition-colors ${isPulsing ? 'text-primary' : ''}`} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_10px_rgba(235,68,50,0.5)] border-2 border-zinc-950">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* +1 Animation */}
              <AnimatePresence>
                {isPulsing && (
                  <motion.span
                    initial={{ opacity: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, y: -40, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-0 right-0 text-primary font-black italic pointer-events-none text-sm z-50 pointer-events-none"
                  >
                    +1
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <a href={`tel:${whatsappNumber.replace(/\s+/g, "")}`} className="hidden md:flex">
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                <span>{whatsappNumber}</span>
              </Button>
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border shadow-xl relative z-50"
          >
            <div className="container-custom py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a href={`tel:${whatsappNumber.replace(/\s+/g, "")}`} className="block py-2">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{whatsappNumber}</span>
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
