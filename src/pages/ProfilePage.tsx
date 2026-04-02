import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { User, Package, Heart, Settings, Mail, Edit2, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, updateProfile } = useAuth();
  const { getOrdersByUser } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "settings">("orders");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (user) setEditForm({ name: user.name, email: user.email });
  }, [user]);

  if (!user) return null;

  const userOrders = getOrdersByUser();
  const statusColor: Record<string, string> = {
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    processing: "text-blue-600 bg-blue-50 border-blue-200",
    shipped: "text-purple-600 bg-purple-50 border-purple-200",
    delivered: "text-emerald-600 bg-emerald-50 border-emerald-200",
    cancelled: "text-red-600 bg-red-50 border-red-200",
  };

  const handleSaveProfile = async () => {
    if (!editForm.name || !editForm.email) { toast.error("Fields cannot be empty"); return; }
    await updateProfile({ name: editForm.name, email: editForm.email });
    setEditing(false);
  };

  const tabs = [
    { id: "orders" as const, label: "Orders", icon: Package, count: userOrders.length },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart, count: wishlistItems.length },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-28 px-6 max-w-5xl mx-auto pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="glass-card p-6 md:p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeTab === t.id ? "neon-button" : "glass-panel text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
              {t.count !== undefined && <span className="text-xs font-mono">({t.count})</span>}
            </button>
          ))}
        </div>

        {activeTab === "orders" && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-heading text-lg font-bold text-foreground mb-2">No orders yet</h2>
                <p className="text-sm text-muted-foreground mb-4">Start shopping to see your orders here</p>
                <Link to="/shop" className="neon-button px-6 py-2.5 text-sm inline-block">Browse Shop</Link>
              </div>
            ) : (
              userOrders.map(order => (
                <motion.div key={order.id} layout className="glass-panel rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-xs text-primary">{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono capitalize border ${statusColor[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-3">
                    {(order.items as any[]).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <img src={item.product?.image} alt={item.product?.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{item.product?.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.size} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-mono text-primary">৳{(item.product?.price || 0) * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between text-sm">
                    <span className="text-muted-foreground">{order.deliveryType === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</span>
                    <span className="price-text font-bold">৳{order.totalPrice}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === "wishlist" && (
          wishlistItems.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-heading text-lg font-bold text-foreground mb-2">Wishlist is empty</h2>
              <Link to="/shop" className="neon-button px-6 py-2.5 text-sm inline-block mt-4">Browse Shop</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )
        )}

        {activeTab === "settings" && (
          <div className="glass-panel rounded-2xl p-6 max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-lg">Account Settings</h3>
              {!editing && (
                <button onClick={() => setEditing(true)} className="neon-button-outline px-3 py-1.5 text-xs flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-mono">Name</label>
                  <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white/50 rounded-xl px-4 py-3 text-sm text-foreground outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block font-mono">Email</label>
                  <input value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-white/50 rounded-xl px-4 py-3 text-sm text-foreground outline-none border border-border focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-300" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSaveProfile} className="neon-button px-4 py-2 text-sm flex items-center gap-1.5"><Save className="w-4 h-4" /> Save</button>
                  <button onClick={() => setEditing(false)} className="neon-button-outline px-4 py-2 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div><p className="text-xs text-muted-foreground font-mono">Name</p><p className="text-sm text-foreground font-medium mt-0.5">{user.name}</p></div>
                <div><p className="text-xs text-muted-foreground font-mono">Email</p><p className="text-sm text-foreground font-medium mt-0.5">{user.email}</p></div>
                <div><p className="text-xs text-muted-foreground font-mono">Role</p><p className="text-sm text-foreground font-medium mt-0.5 capitalize">{user.role}</p></div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
