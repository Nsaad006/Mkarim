import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ShoppingCart, Phone, Search, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/api/settings";

const navLinks = [
  { name: "Nos Produits", path: "/products" },
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

  const { toggleTheme, theme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Glow Effect under the navbar */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_20px_rgba(235,68,50,0.3)]" />

      <div className="bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container-custom">
          <div className="flex items-center h-16 md:h-24 relative">

            {/* Left Section: Search & Nav Links */}
            <div className="flex flex-1 items-center gap-2 md:gap-6">
              {/* Search Block - Now on the left for all views */}
              <div ref={searchRef} className={`relative flex items-center transition-all duration-300 ${isSearchOpen ? "w-32 md:w-48" : "w-10"}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative z-10 text-muted-foreground hover:text-foreground"
                  onClick={handleButtonClick}
                >
                  <Search className="w-5 h-5" />
                </Button>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onSubmit={handleSearch}
                      className="absolute left-0 flex items-center w-full"
                    >
                      <input
                        type="text"
                        autoFocus
                        placeholder="RECHERCHE..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary/50 text-[10px] font-bold text-foreground tracking-widest uppercase"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Desktop-only Nav Links */}
              <div className="hidden md:flex items-center gap-6 lg:gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="group relative px-2 py-1 overflow-hidden"
                  >
                    <span className="text-[10px] lg:text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                      {link.name}
                    </span>
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Center Section: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <Link to="/" className="relative flex items-center justify-center group">
                {/* Futuristic Hexagon/Orb Background behind logo */}
                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500 scale-75 group-hover:scale-100" />
                <div className="absolute -inset-1 border border-primary/20 rounded-lg skew-x-[-15deg] group-hover:border-primary/50 transition-all duration-500" />

                <span className="font-display text-xl md:text-3xl font-black italic uppercase tracking-tighter relative">
                  {storeName.split(" ").length > 1 ? (
                    <>
                      <span className="text-primary drop-shadow-[0_0_10px_rgba(235,68,50,0.5)]">{storeName.split(" ")[0]}</span>
                      <span className="text-foreground ml-2 opacity-90">{storeName.split(" ").slice(1).join(" ")}</span>
                    </>
                  ) : (
                    <span className="text-primary drop-shadow-[0_0_10px_rgba(235,68,50,0.5)]">{storeName}</span>
                  )}
                </span>
              </Link>
            </div>

            {/* Right Section: Actions */}
            <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
              {/* Theme Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 rounded-xl hover:bg-foreground/5"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              <Link to="/cart" className="hidden md:block relative group p-2">
                <motion.div
                  animate={isPulsing ? {
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <div className="relative">
                    <ShoppingCart className={`w-6 h-6 transition-colors ${isPulsing ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                    {cartCount > 0 && (
                      <span className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-[9px] font-black rounded-lg w-5 h-5 flex items-center justify-center shadow-[0_0_15px_rgba(235,68,50,0.6)] border border-background skew-x-[-10deg]">
                        <span className="skew-x-[10deg]">{cartCount}</span>
                      </span>
                    )}
                  </div>
                </motion.div>

                <AnimatePresence>
                  {isPulsing && (
                    <motion.span
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -30 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-0 right-[-10px] text-primary font-black italic text-xs tracking-tighter"
                    >
                      +1
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Phone Icon for Action */}
              <a href={`tel:${whatsappNumber.replace(/\s+/g, "")}`} className="hidden lg:flex">
                <div className="px-4 py-2 bg-muted hover:bg-accent border border-border rounded-xl transition-all group flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  <span className="text-[10px] font-black text-muted-foreground group-hover:text-foreground tracking-widest uppercase">LIGNE DIRECTE</span>
                </div>
              </a>

              {/* Mobile Menu Button - Futuristic Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-foreground ml-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Tech Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden bg-background/95 backdrop-blur-2xl flex flex-col pt-24 px-6 gap-8 border-l border-border shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
          >
            {/* Background pattern for futuristic look */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--primary)_1px,_transparent_1px)] bg-[size:30px_30px]" />
            </div>

            <div className="space-y-6 relative z-10">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className="flex items-center justify-between py-4 border-b border-border"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-3xl font-black text-foreground italic uppercase tracking-tighter shadow-sm">{link.name}</span>
                    <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-auto pb-12 space-y-4"
            >
              <div className="flex gap-4">
                <Button className="flex-1 bg-primary text-primary-foreground font-black uppercase tracking-widest h-16 rounded-2xl italic shadow-[0_0_20px_rgba(235,68,50,0.3)]" onClick={toggleTheme}>
                  {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </Button>
                <a href={`tel:${whatsappNumber.replace(/\s+/g, "")}`} className="flex-[3]">
                  <Button className="w-full bg-foreground text-background font-black uppercase tracking-widest h-16 rounded-2xl italic">
                    APPELER LE SUPPORT
                  </Button>
                </a>
              </div>
              <p className="text-[10px] font-black text-muted-foreground text-center uppercase tracking-[0.3em]">MKARIM SOLUTION GEAR © 2026</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Mobile Floating Cart Bubble */}
      <div className="md:hidden fixed bottom-6 right-6 z-[60]">
        <Link to="/cart">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(235,68,50,0.4)] border border-white/20 skew-x-[-4deg]"
          >
            <motion.div
              animate={isPulsing ? {
                scale: [1, 1.3, 1],
                rotate: [0, 15, -15, 0],
              } : {}}
            >
              <ShoppingCart className="w-7 h-7" />
            </motion.div>

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-primary text-[11px] font-black rounded-lg w-7 h-7 flex items-center justify-center shadow-lg border-2 border-primary skew-x-[4deg]">
                {cartCount}
              </span>
            )}

            {/* Pulsing Ring Effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-primary animate-ping opacity-20" />
          </motion.div>
        </Link>
      </div>

    </nav>
  );
};

export default Navbar;
