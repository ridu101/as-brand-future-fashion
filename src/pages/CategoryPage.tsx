import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { getProductsByCategory, categories } from "@/data/products";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find(c => c.slug === slug);
  const products = getProductsByCategory(slug || "");

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">Category not found</h1>
          <Link to="/" className="neon-button-outline px-6 py-2 mt-4 inline-block text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/categories" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </Link>

        <div className="mb-10">
          <h1 className="section-title text-foreground">{category.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryPage;
