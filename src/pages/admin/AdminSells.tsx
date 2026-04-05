import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, DollarSign, Calendar, BarChart3 } from "lucide-react";
import { isThisMonth } from "date-fns";
import { useOrders } from "@/context/OrderContext";
import { useProducts } from "@/context/ProductContext";
import { useAuth } from "@/context/AuthContext";

const AdminSells = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { orders, fetchAllOrders } = useOrders();
  const { products } = useProducts();

  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin]);
  useEffect(() => { if (isAdmin) fetchAllOrders(); }, [isAdmin]);

  const deliveredOrders = orders.filter(o => o.status === "delivered");
  const monthlyDelivered = deliveredOrders.filter(o => isThisMonth(new Date(o.createdAt)));

  const totalSell = deliveredOrders.reduce((s, o) => s + o.totalPrice, 0);
  const monthlySell = monthlyDelivered.reduce((s, o) => s + o.totalPrice, 0);

  const calcProfit = (orderList: typeof deliveredOrders) =>
    orderList.reduce((s, o) => {
      const items = o.items as any[];
      const cost = items.reduce((c: number, item: any) => {
        const product = products.find(p => p.id === item.product?.id);
        const costPrice = product?.costPrice || Math.round((item.product?.price || 0) * 0.5);
        return c + costPrice * (item.quantity || 1);
      }, 0);
      return s + (o.totalPrice - cost);
    }, 0);

  const totalProfit = calcProfit(deliveredOrders);
  const monthlyProfit = calcProfit(monthlyDelivered);

  const metrics = [
    { label: "Total Sell", value: `৳${totalSell.toLocaleString()}`, icon: TrendingUp, color: "from-blue-500/10 to-cyan-500/10", iconColor: "text-blue-500" },
    { label: "Monthly Sell", value: `৳${monthlySell.toLocaleString()}`, icon: Calendar, color: "from-emerald-500/10 to-teal-500/10", iconColor: "text-emerald-500" },
    { label: "Total Profit", value: `৳${totalProfit.toLocaleString()}`, icon: DollarSign, color: "from-violet-500/10 to-purple-500/10", iconColor: "text-violet-500" },
    { label: "Monthly Profit", value: `৳${monthlyProfit.toLocaleString()}`, icon: BarChart3, color: "from-amber-500/10 to-orange-500/10", iconColor: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen pt-28 px-6 max-w-5xl mx-auto pb-20">
      <button onClick={() => navigate("/admin-dashboard")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-300">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Sales Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`glass-card p-8 bg-gradient-to-br ${m.color}`}
          >
            <m.icon className={`w-8 h-8 ${m.iconColor} mb-3`} />
            <p className="text-sm text-muted-foreground font-medium">{m.label}</p>
            <p className="text-3xl font-heading font-bold text-foreground mt-1">{m.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl p-6">
        <h2 className="font-heading text-lg font-bold text-foreground mb-4">Delivered Orders ({deliveredOrders.length})</h2>
        {deliveredOrders.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No delivered orders yet.</p>
        ) : (
          <div className="space-y-3">
            {deliveredOrders.slice(0, 20).map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="price-text">৳{order.totalPrice}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSells;
