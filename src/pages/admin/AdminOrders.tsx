import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Package, Truck, CheckCircle2, XCircle, Phone, MapPin } from "lucide-react";
import { useOrders, Order } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";

type Section = "pending" | "ongoing" | "completed" | "cancelled";

const sections: { id: Section; label: string; icon: React.ReactNode; statuses: string[] }[] = [
  { id: "pending", label: "Pending Orders", icon: <Clock className="w-4 h-4" />, statuses: ["pending"] },
  { id: "ongoing", label: "Ongoing Orders", icon: <Truck className="w-4 h-4" />, statuses: ["processing", "shipped"] },
  { id: "completed", label: "Completed Orders", icon: <CheckCircle2 className="w-4 h-4" />, statuses: ["delivered"] },
  { id: "cancelled", label: "Cancelled Orders", icon: <XCircle className="w-4 h-4" />, statuses: ["cancelled"] },
];

const statusColor: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  processing: "text-blue-600 bg-blue-50 border-blue-200",
  shipped: "text-purple-600 bg-purple-50 border-purple-200",
  delivered: "text-emerald-600 bg-emerald-50 border-emerald-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { orders, fetchAllOrders, updateOrderStatus } = useOrders();
  const [activeSection, setActiveSection] = useState<Section>("pending");

  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin]);
  useEffect(() => { if (isAdmin) fetchAllOrders(); }, [isAdmin]);

  const filtered = orders.filter(o => sections.find(s => s.id === activeSection)?.statuses.includes(o.status));

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-20">
      <button onClick={() => navigate("/admin-dashboard")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-300">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Orders</h1>

      <div className="flex gap-2 mb-8 flex-wrap">
        {sections.map(s => {
          const count = orders.filter(o => s.statuses.includes(o.status)).length;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeSection === s.id ? "neon-button" : "glass-panel text-muted-foreground hover:text-foreground"}`}>
              {s.icon} {s.label} <span className="text-xs font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No orders in this section.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <motion.div key={order.id} layout className="glass-panel rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-primary">{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono capitalize border ${statusColor[order.status] || ""}`}>
                  {order.status}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3" /> {order.phone}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {order.address}, {order.city}</p>
                </div>
                <div className="space-y-1.5">
                  {(order.items as any[]).map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <img src={item.product?.image} alt="" className="w-8 h-8 rounded object-cover" />
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
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
