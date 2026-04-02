import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Package, ShoppingCart, Trash2, Edit, LogOut, X, Save, Clock, Truck, CheckCircle2, XCircle, Phone, MapPin } from "lucide-react";
import { Product, categories } from "@/data/products";
import { useProducts } from "@/context/ProductContext";
import { useOrders, Order } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { orders, fetchAllOrders, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "add">("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!isAdmin) navigate("/owner-login");
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) fetchAllOrders();
  }, [isAdmin]);

  const [newProduct, setNewProduct] = useState({
    title: "", category: "panjabi", year: 2025, price: 0,
    sizes: "S,M,L,XL", stock: 10, description: "", image: ""
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = {
      id: `custom-${Date.now()}`,
      title: newProduct.title, category: newProduct.category, year: newProduct.year, price: newProduct.price,
      sizes: newProduct.sizes.split(",").map(s => s.trim()), stock: newProduct.stock,
      description: newProduct.description,
      image: newProduct.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
    };
    addProduct(p);
    setNewProduct({ title: "", category: "panjabi", year: 2025, price: 0, sizes: "S,M,L,XL", stock: 10, description: "", image: "" });
    toast.success("Product added successfully!");
    setActiveTab("products");
  };

  const handleDelete = (id: string) => { deleteProduct(id); toast.success("Product deleted"); };
  const handleLogout = async () => { await logout(); navigate("/login"); };

  const handleSaveEdit = () => {
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
    toast.success("Product updated!");
  };

  const statusIcon: Record<string, React.ReactNode> = {
    pending: <Clock className="w-3.5 h-3.5" />,
    processing: <Package className="w-3.5 h-3.5" />,
    shipped: <Truck className="w-3.5 h-3.5" />,
    delivered: <CheckCircle2 className="w-3.5 h-3.5" />,
    cancelled: <XCircle className="w-3.5 h-3.5" />,
  };

  const statusColor: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    processing: "text-blue-600 bg-blue-50 border-blue-200",
    shipped: "text-purple-600 bg-purple-50 border-purple-200",
    delivered: "text-emerald-600 bg-emerald-50 border-emerald-200",
    cancelled: "text-red-600 bg-red-50 border-red-200",
  };

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.totalPrice, 0);

  const tabs = [
    { id: "products" as const, label: "Products", icon: Package },
    { id: "orders" as const, label: "Orders", icon: ShoppingCart, count: orders.length },
    { id: "add" as const, label: "Add Product", icon: Plus },
  ];

  const inputCls = "w-full bg-white/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300";

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome, {user?.name || "Admin"}</p>
        </div>
        <button onClick={handleLogout} className="neon-button-outline px-4 py-2 text-sm flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Products", value: products.length },
          { label: "Categories", value: categories.length },
          { label: "Orders", value: orders.length },
          { label: "Revenue", value: `৳${totalRevenue}` },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-2xl p-4 text-center">
            <p className="text-2xl font-heading font-bold text-primary">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-8">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === t.id ? "neon-button" : "glass-panel text-muted-foreground hover:text-foreground"}`}>
            <t.icon className="w-4 h-4" /> {t.label}
            {t.count !== undefined && <span className="text-xs font-mono">({t.count})</span>}
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
                <button onClick={() => setEditingProduct(p)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors duration-300"><Edit className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors duration-300"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet.</p>
            </div>
          ) : (
            orders.map(order => (
              <motion.div key={order.id} layout className="glass-panel rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-mono text-xs text-primary">{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-mono capitalize border flex items-center gap-1.5 ${statusColor[order.status] || ""}`}>
                    {statusIcon[order.status]} {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3" /> {order.phone}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {order.address}, {order.city}</p>
                    <p className="text-xs font-mono text-muted-foreground">{order.deliveryType === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</p>
                  </div>
                  <div className="space-y-1.5">
                    {(order.items as any[]).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <img src={item.product?.image} alt={item.product?.title} className="w-8 h-8 rounded object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground truncate">{item.product?.title}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{item.size} × {item.quantity}</p>
                        </div>
                        <p className="text-xs font-mono text-primary">৳{(item.product?.price || 0) * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {(["pending", "processing", "shipped", "delivered", "cancelled"] as const).map(s => (
                      <button key={s} onClick={() => updateOrderStatus(order.id, s)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono capitalize transition-all duration-300 ${order.status === s ? statusColor[s] + " border" : "glass-panel text-muted-foreground hover:text-foreground"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="price-text text-lg">৳{order.totalPrice}</p>
                </div>
              </motion.div>
            ))
          )}
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-foreground/10 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-panel rounded-2xl p-6 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto bg-white/90 backdrop-blur-xl">
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
