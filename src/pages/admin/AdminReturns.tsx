import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";

const AdminReturns = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { orders, fetchAllOrders } = useOrders();

  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin]);
  useEffect(() => { if (isAdmin) fetchAllOrders(); }, [isAdmin]);

  const returnOrders = orders.filter(o => (o as any).returnStatus);

  return (
    <div className="min-h-screen pt-28 px-6 max-w-5xl mx-auto pb-20">
      <button onClick={() => navigate("/admin-dashboard")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-300">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-8">Return Orders</h1>

      {returnOrders.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center">
          <RotateCcw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No return requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returnOrders.map(order => (
            <motion.div key={order.id} layout className="glass-panel rounded-2xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-primary">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.phone}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-50 text-amber-600 border border-amber-200">
                  {(order as any).returnStatus}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                {(order.items as any[]).map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <img src={item.product?.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm text-foreground">{item.product?.title}</p>
                      <p className="text-xs text-muted-foreground font-mono">{item.size} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-panel rounded-xl p-3 bg-amber-50/50">
                <p className="text-xs font-semibold text-foreground mb-1">Return Reason:</p>
                <p className="text-sm text-muted-foreground">{(order as any).returnReason || "No reason provided"}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Requested: {(order as any).returnRequestedAt ? new Date((order as any).returnRequestedAt).toLocaleString() : "N/A"}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReturns;
