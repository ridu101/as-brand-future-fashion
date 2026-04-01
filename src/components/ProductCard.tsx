import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { ShoppingBag, Heart, Zap, Eye } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { requireAuth } = useAuth();
  const wishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth("add to cart")) return;
    addItem(product, product.sizes[0]);
    toast.success(`${product.title} added to cart`, { description: `Size: ${product.sizes[0]}` });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth("use wishlist")) return;
    toggleWishlist(product);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="block group">
        <div className="relative rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.15),0_0_60px_rgba(0,240,255,0.05)] group-hover:-translate-y-2 group-hover:scale-[1.02]">
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.1) 0%, transparent 40%, transparent 60%, rgba(0,240,255,0.1) 100%)' }} />

          <button onClick={handleWishlist}
            className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${wishlisted ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_12px_rgba(0,240,255,0.3)]" : "bg-background/30 border-[var(--glass-border)] text-foreground/60 hover:text-primary hover:border-primary/50"}`}>
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-primary" : ""}`} />
          </button>

          {product.trending && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary">
              <Zap className="w-3 h-3 fill-primary" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Trending</span>
            </div>
          )}

          <div className="relative overflow-hidden aspect-[3/4]">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
              <button onClick={handleQuickAdd}
                className="flex-1 py-2.5 text-sm flex items-center justify-center gap-2 rounded-xl font-heading font-semibold bg-primary/90 backdrop-blur-md text-primary-foreground hover:bg-primary transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <Link to={`/product/${product.id}`} onClick={e => e.stopPropagation()}
                className="p-2.5 rounded-xl backdrop-blur-md bg-background/40 border border-[var(--glass-border)] hover:bg-primary/20 hover:border-primary/40 transition-all">
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="p-4 relative">
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <h3 className="font-heading font-semibold text-sm text-foreground truncate mt-1">{product.title}</h3>
            <div className="flex items-center justify-between mt-2.5">
              <span className="font-mono font-bold text-lg text-primary drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">৳{product.price}</span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map(s => (
                  <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-secondary/50 text-muted-foreground border border-border/50">{s}</span>
                ))}
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]' : 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.5)]'}`} />
              <span className="text-[10px] font-mono text-muted-foreground">{product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
