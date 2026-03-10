import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { getTrendingProducts } from "@/data/products";

const TrendingPage = () => {
  const trending = getTrendingProducts();

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="section-title text-foreground mb-2">Trending Now</h1>
        <p className="text-sm text-muted-foreground mb-10">The most popular picks this season</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {trending.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </motion.div>
    </div>
  );
};

export default TrendingPage;
