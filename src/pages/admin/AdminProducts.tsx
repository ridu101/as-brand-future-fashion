import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { products } = useProducts();

  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin]);

  return (
    <div className="min-h-screen pt-28 px-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={() => navigate("/admin-dashboard")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors duration-300">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <h1 className="font-heading text-3xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Select a category to manage products</p>
        </div>
        <button onClick={() => navigate("/admin/products/add")} className="neon-button px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => {
          const count = products.filter(p => p.category === cat.slug).length;
          return (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => navigate(`/admin/products/${cat.slug}`)}
              className="glass-card overflow-hidden text-left group"
            >
              <div className="aspect-square overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-4">
                <h3 className="font-heading font-semibold text-foreground">{cat.name}</h3>
                <p className="text-xs font-mono text-muted-foreground mt-1">{count} products</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminProducts;
