import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/context/ProductContext";
import { useState } from "react";

const ShopPage = () => {
  const { products } = useProducts();
  const [sortBy, setSortBy] = useState("latest");

  const sorted = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="section-title text-foreground">Shop All</h1>
            <p className="text-sm text-muted-foreground mt-1">{products.length} products</p>
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="glass-panel rounded-xl px-4 py-2 text-sm font-mono bg-white/50 text-foreground outline-none cursor-pointer border border-border">
            <option value="latest">Latest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {sorted.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </motion.div>
    </div>
  );
};

export default ShopPage;
