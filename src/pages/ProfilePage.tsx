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

  const userOrders = getOrdersByUser(user.email);
  const statusColor: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    processing: "text-blue-400 bg-blue-400/10",
    shipped: "text-purple-400 bg-purple-400/10",
    delivered: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
  };

  const handleSaveProfile = () => {
    if (!editForm.name || !editForm.email) { toast.error("Fields cannot be empty"); return; }
    updateProfile({ name: editForm.name, email: editForm.email });
    setEditing(false);
  };

  const tabs = [
    { id: "orders" as const, label: "Orders", icon: Package, count: userOrders.length },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart, count: wishlistItems.length },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Profile Header */}
        <div className="glass-card p-8 mb-8 glow-behind">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
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

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === t.id ? "neon-button" : "glass-panel text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
              {t.count !== undefined && <span className="ml-1 text-xs font-mono">({t.count})</span>}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
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
                <motion.div key={order.id} layout className="glass-panel rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono capitalize ${statusColor[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img src={item.product.image} alt={item.product.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.product.title}</p>
                          <p className="text-xs text-muted-foreground font-mono">Size: {item.size} × {item.quantity}</p>
                        </div>
                        <p className="text-sm font-mono text-primary">৳{item.product.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border/30 pt-3 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{order.deliveryType === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"}</p>
                    <p className="price-text">৳{order.totalPrice}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          wishlistItems.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="font-heading text-lg font-bold text-foreground mb-2">Wishlist is empty</h2>
              <Link to="/shop" className="neon-button px-6 py-2.5 text-sm inline-block mt-4">Browse Shop</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlistItems.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )
        )}

        {/* Settings Tab */}
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
                  <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                  <input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <input value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSaveProfile} className="neon-button px-4 py-2 text-sm flex items-center gap-1.5">
                    <Save className="w-4 h-4" /> Save
                  </button>
                  <button onClick={() => setEditing(false)} className="neon-button-outline px-4 py-2 text-sm">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm text-foreground font-medium mt-0.5">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground font-medium mt-0.5">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm text-foreground font-medium mt-0.5 capitalize">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage;
