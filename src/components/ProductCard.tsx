import { Link, useNavigate } from "react-router-dom";
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
  const { requireAuth, isAdmin } = useAuth();
  const wishlisted = isInWishlist(product.id);
  const navigate = useNavigate();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth("add to cart")) return;
    addItem(product, product.sizes[0]);
    toast.success(`${product.title} added to cart`, { description: `Size: ${product.sizes[0]}` });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuth("buy this product")) return;
    addItem(product, product.sizes[0]);
    navigate("/cart");
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
        <div className="relative rounded-2xl overflow-hidden glass-panel transition-all duration-300 group-hover:shadow-[0_15px_40px_rgba(0,120,255,0.12)] group-hover:-translate-y-2">
          {!isAdmin && (
            <button onClick={handleWishlist}
              className={`absolute top-3 right-3 z-20 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${wishlisted ? "bg-primary/10 border-primary/30 text-primary" : "bg-white/60 border-border text-foreground/50 hover:text-primary hover:border-primary/30"}`}>
              <Heart className={`w-4 h-4 ${wishlisted ? "fill-primary" : ""}`} />
            </button>
          )}

          {product.trending && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 backdrop-blur-md border border-primary/20 text-primary">
              <Zap className="w-3 h-3 fill-primary" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Trending</span>
            </div>
          )}

          <div className="relative overflow-hidden aspect-[3/4]">
            <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent opacity-60" />

            {!isAdmin && (
              <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <button onClick={handleQuickAdd}
                  className="flex-1 py-2.5 text-sm flex items-center justify-center gap-2 rounded-xl font-heading font-semibold neon-button">
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <Link to={`/product/${product.id}`} onClick={e => e.stopPropagation()}
                  className="p-2.5 rounded-xl backdrop-blur-md bg-white/60 border border-border hover:bg-primary/5 hover:border-primary/20 transition-all duration-300">
                  <Eye className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-heading font-semibold text-sm text-foreground truncate">{product.title}</h3>
            <div className="flex items-center justify-between mt-2.5">
              <span className="font-mono font-bold text-lg text-primary">৳{product.price}</span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map(s => (
                  <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">{s}</span>
                ))}
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="text-[10px] font-mono text-muted-foreground">{product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
