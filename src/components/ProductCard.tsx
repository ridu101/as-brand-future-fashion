import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0]);
    toast.success(`${product.title} added to cart`, {
      description: `Size: ${product.sizes[0]}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="block group">
        <div className="glass-card overflow-hidden glow-behind">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[3/4]">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Quick actions */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={handleQuickAdd}
                className="neon-button flex-1 py-2 text-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toast.info("Added to wishlist!"); }}
                className="glass-panel rounded-xl p-2 hover:bg-primary/20 transition-colors"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-heading font-semibold text-sm text-foreground truncate">{product.title}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="price-text text-lg">৳{product.price}</span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map(s => (
                  <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-secondary/50 text-muted-foreground">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
