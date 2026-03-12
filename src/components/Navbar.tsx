import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/data/products";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Categories", path: "/categories" },
  { label: "Trending", path: "/trending" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { searchProducts } = useProducts();
  const { items: wishlistItems } = useWishlist();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length > 1) {
      setSearchResults(searchProducts(searchQuery).slice(0, 6));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchProducts]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-4 right-4 z-50 glass-navbar rounded-2xl px-6 py-3"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-heading font-bold text-gradient">AS Brand</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`text-sm font-medium transition-colors duration-300 hover:text-primary ${location.pathname === link.path ? "text-primary" : "text-foreground/70"}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div ref={searchRef} className="relative">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 rounded-xl hover:bg-primary/10 transition-colors">
              <Search className="w-5 h-5 text-foreground/70" />
            </button>
            <AnimatePresence>
              {searchOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-12 w-80 glass-panel rounded-2xl p-4">
                  <input type="text" placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus
                    className="w-full bg-secondary/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50" />
                  {searchResults.length > 0 && (
                    <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                      {searchResults.map(p => (
                        <Link key={p.id} to={`/product/${p.id}`}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 transition-colors"
                          onClick={() => { setSearchOpen(false); setSearchQuery(""); }}>
                          <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{p.title}</p>
                            <p className="text-xs font-mono text-primary">৳{p.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/wishlist" className="p-2 rounded-xl hover:bg-primary/10 transition-colors relative">
            <Heart className="w-5 h-5 text-foreground/70" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-mono font-bold">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          <button onClick={() => setIsCartOpen(true)} className="p-2 rounded-xl hover:bg-primary/10 transition-colors relative">
            <ShoppingBag className="w-5 h-5 text-foreground/70" />
            {totalItems > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-mono font-bold">
                {totalItems}
              </motion.span>
            )}
          </button>

          <Link to="/login" className="hidden md:block neon-button-outline px-4 py-1.5 text-sm">Login</Link>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-primary/10">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden mt-4">
            <div className="flex flex-col gap-2 py-2">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className="px-4 py-2 rounded-xl text-sm hover:bg-primary/10 transition-colors text-foreground/70">{link.label}</Link>
              ))}
              <Link to="/login" className="neon-button-outline px-4 py-2 text-sm text-center mt-2">Login</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
