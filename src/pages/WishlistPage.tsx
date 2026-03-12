import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";

const WishlistPage = () => {
  const { items } = useWishlist();

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title text-foreground mb-8">Your Wishlist</h1>
        {items.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground text-sm mb-6">Browse products and add your favorites here</p>
            <Link to="/shop" className="neon-button px-6 py-2.5 text-sm inline-block">Browse Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WishlistPage;
