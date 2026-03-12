import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, ShoppingBag, Heart, Minus, Plus, Check } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, getProductsByCategory } = useProducts();
  const product = getProductById(id || "");
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold">Product not found</h1>
          <Link to="/shop" className="neon-button-outline px-6 py-2 mt-4 inline-block text-sm">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const related = getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    for (let i = 0; i < qty; i++) addItem(product, selectedSize);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Link to={`/${product.category}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="glass-card overflow-hidden rounded-3xl">
            <div className="aspect-[3/4] overflow-hidden">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-xs font-mono text-primary uppercase tracking-widest mb-2">{product.category}</span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{product.title}</h1>
            <p className="price-text text-3xl mt-4">৳{product.price}</p>
            <p className="text-sm text-muted-foreground mt-1 font-mono">Year: {product.year}</p>
            <p className="text-muted-foreground mt-6 leading-relaxed">{product.description}</p>

            <div className="flex items-center gap-2 mt-6">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-mono">{product.stock} in stock</span>
            </div>

            <div className="mt-6">
              <p className="text-sm font-heading font-semibold mb-3">Select Size</p>
              <div className="flex gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-xl font-mono text-sm transition-all ${selectedSize === s ? "neon-button" : "glass-panel hover:border-primary/50"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <p className="text-sm font-heading font-semibold">Quantity</p>
              <div className="flex items-center gap-3 glass-panel rounded-xl px-3 py-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-1 hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="font-mono w-8 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="p-1 hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={handleAddToCart} className="neon-button flex-1 py-3.5 flex items-center justify-center gap-2 text-base">
                <ShoppingBag className="w-5 h-5" /> Add To Cart
              </button>
              <button
                onClick={() => { toggleWishlist(product); toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!"); }}
                className={`glass-panel rounded-xl px-4 transition-colors ${wishlisted ? "bg-primary/20 text-primary" : "hover:bg-primary/10"}`}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-primary" : ""}`} />
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="section-title text-foreground mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductPage;
