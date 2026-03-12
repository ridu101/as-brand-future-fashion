import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Package, ShoppingCart, Trash2, Edit, LogOut, X, Save } from "lucide-react";
import { Product, categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "add">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (localStorage.getItem("as_admin") !== "true") {
      navigate("/owner-login");
    }
  }, [navigate]);

  const [newProduct, setNewProduct] = useState({
    title: "", category: "panjabi", year: 2025, price: 0,
    sizes: "S,M,L,XL", stock: 10, description: "", image: ""
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = {
      id: `custom-${Date.now()}`,
      title: newProduct.title,
      category: newProduct.category,
      year: newProduct.year,
      price: newProduct.price,
      sizes: newProduct.sizes.split(",").map(s => s.trim()),
      stock: newProduct.stock,
      description: newProduct.description,
      image: newProduct.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
    };
    addProduct(p);
    setNewProduct({ title: "", category: "panjabi", year: 2025, price: 0, sizes: "S,M,L,XL", stock: 10, description: "", image: "" });
    toast.success("Product added successfully!");
    setActiveTab("products");
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success("Product deleted");
  };

  const handleLogout = () => {
    localStorage.removeItem("as_admin");
    navigate("/login");
  };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
    toast.success("Product updated!");
  };

  const tabs = [
    { id: "products" as const, label: "Products", icon: Package },
    { id: "orders" as const, label: "Orders", icon: ShoppingCart },
    { id: "add" as const, label: "Add Product", icon: Plus },
  ];

  const inputCls = "w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary/50";

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome, Azharul Islam</p>
        </div>
        <button onClick={handleLogout} className="neon-button-outline px-4 py-2 text-sm flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Products", value: products.length },
          { label: "Categories", value: categories.length },
          { label: "Orders", value: 0 },
          { label: "Revenue", value: "৳0" },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-2xl p-4 text-center">
            <p className="text-2xl font-heading font-bold text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === t.id ? "neon-button" : "glass-panel text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "products" && (
        <div className="space-y-3">
          {products.slice(0, 20).map(p => (
            <motion.div key={p.id} layout className="glass-panel rounded-xl p-4 flex items-center gap-4">
              <img src={p.image} alt={p.title} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{p.title}</h3>
                <p className="text-xs text-muted-foreground font-mono">{p.category} · ৳{p.price} · Stock: {p.stock}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingProduct(p)} className="p-2 rounded-lg hover:bg-primary/20 text-primary"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="glass-panel rounded-2xl p-8 text-center">
          <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No orders yet. Orders will appear here.</p>
        </div>
      )}

      {activeTab === "add" && (
        <form onSubmit={handleAddProduct} className="glass-panel rounded-2xl p-6 space-y-4 max-w-2xl">
          <input placeholder="Product Title" value={newProduct.title} onChange={e => setNewProduct(p => ({ ...p, title: e.target.value }))} className={inputCls} required />
          <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} className={inputCls}>
            {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Price" value={newProduct.price || ""} onChange={e => setNewProduct(p => ({ ...p, price: Number(e.target.value) }))} className={inputCls} required />
            <input type="number" placeholder="Year" value={newProduct.year} onChange={e => setNewProduct(p => ({ ...p, year: Number(e.target.value) }))} className={inputCls} />
          </div>
          <input placeholder="Sizes (comma separated)" value={newProduct.sizes} onChange={e => setNewProduct(p => ({ ...p, sizes: e.target.value }))} className={inputCls} />
          <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: Number(e.target.value) }))} className={inputCls} />
          <input placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))} className={inputCls} />
          <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} className={`${inputCls} min-h-[100px]`} />
          <button type="submit" className="neon-button px-6 py-3 text-sm font-heading font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </form>
      )}

      <AnimatePresence>
        {editingProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-panel rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold">Edit Product</h2>
                <button onClick={() => setEditingProduct(null)}><X className="w-5 h-5" /></button>
              </div>
              <input value={editingProduct.title} onChange={e => setEditingProduct(p => p ? { ...p, title: e.target.value } : null)} className={inputCls} />
              <input type="number" value={editingProduct.price} onChange={e => setEditingProduct(p => p ? { ...p, price: Number(e.target.value) } : null)} className={inputCls} />
              <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct(p => p ? { ...p, stock: Number(e.target.value) } : null)} className={inputCls} />
              <textarea value={editingProduct.description} onChange={e => setEditingProduct(p => p ? { ...p, description: e.target.value } : null)} className={`${inputCls} min-h-[80px]`} />
              <button onClick={handleSaveEdit} className="neon-button px-6 py-2.5 text-sm flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
