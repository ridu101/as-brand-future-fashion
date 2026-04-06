import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, BarChart3, RotateCcw, LogOut, Leaf } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductContext";
import { toast } from "sonner";

const seasons = [
  { value: "eid", label: "🌙 Eid" },
  { value: "winter", label: "❄️ Winter" },
  { value: "summer", label: "☀️ Summer" },
];

const cards = [
  { label: "Orders", icon: ShoppingCart, path: "/admin/orders", color: "from-blue-500/10 to-cyan-500/10", iconColor: "text-blue-500" },
  { label: "Products", icon: Package, path: "/admin/products", color: "from-emerald-500/10 to-teal-500/10", iconColor: "text-emerald-500" },
  { label: "Sells", icon: BarChart3, path: "/admin/sells", color: "from-violet-500/10 to-purple-500/10", iconColor: "text-violet-500" },
  { label: "Return Orders", icon: RotateCcw, path: "/admin/returns", color: "from-amber-500/10 to-orange-500/10", iconColor: "text-amber-500" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { orders } = useOrders();
  const { products } = useProducts();
  const [selectedSeason, setSelectedSeason] = useState(() => localStorage.getItem("clothify_season") || "");

  useEffect(() => {
    if (!isAdmin) navigate("/login");
  }, [isAdmin, navigate]);

  const handleLogout = async () => { await logout(); navigate("/login"); };

  const handleSeasonChange = (season: string) => {
    if (selectedSeason === season) {
      setSelectedSeason("");
      localStorage.removeItem("clothify_season");
      toast.success("Seasonal collection cleared");
    } else {
      setSelectedSeason(season);
      localStorage.setItem("clothify_season", season);
      toast.success(`${season.charAt(0).toUpperCase() + season.slice(1)} collection activated`);
    }
  };

  const counts: Record<string, number | string> = {
    Orders: orders.length,
    Products: products.length,
    Sells: `৳${orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.totalPrice, 0)}`,
    "Return Orders": orders.filter(o => o.returnStatus).length,
  };

  return (
    <div className="min-h-screen pt-28 px-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome, {user?.name || "Admin"}</p>
        </div>
        <button onClick={handleLogout} className="neon-button-outline px-4 py-2 text-sm flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {cards.map((card, i) => (
          <motion.button
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            onClick={() => navigate(card.path)}
            className={`glass-card p-8 text-left bg-gradient-to-br ${card.color} hover:shadow-lg group`}
          >
            <card.icon className={`w-10 h-10 ${card.iconColor} mb-4 transition-transform duration-300 group-hover:scale-110`} />
            <h2 className="font-heading text-xl font-bold text-foreground">{card.label}</h2>
            <p className="text-2xl font-mono font-bold text-primary mt-2">{counts[card.label]}</p>
          </motion.button>
        ))}
      </div>

      {/* Seasonal Collection Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-bold text-foreground">Seasonal Collection</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Select a season to feature on the homepage. Click again to deselect.</p>
        <div className="flex gap-3">
          {seasons.map(s => (
            <button key={s.value} onClick={() => handleSeasonChange(s.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all duration-300 ${selectedSeason === s.value ? "neon-button" : "glass-panel hover:bg-primary/5"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
