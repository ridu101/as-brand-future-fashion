import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminReturns = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { orders, fetchAllOrders } = useOrders();

  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin]);
  useEffect(() => { if (isAdmin) fetchAllOrders(); }, [isAdmin]);

  const returnOrders = orders.filter(o => o.returnStatus);

  const handleReturnAction = async (orderId: string, action: "accepted" | "rejected") => {
    const { error } = await supabase.from("orders").update({ return_status: action } as any).eq("id", orderId);
    if (error) { toast.error("Failed to update return status"); return; }
    toast.success(`Return ${action}`);
    fetchAllOrders();
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      requested: "bg-amber-50 text-amber-600 border-amber-200",
      accepted: "bg-emerald-50 text-emerald-600 border-emerald-200",
      rejected: "bg-red-50 text-red-600 border-red-200",
    };
    return styles[status] || styles.requested;
  };

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
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-mono text-xs text-primary">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.phone}</p>
                  <p className="text-xs text-muted-foreground">{order.address}, {order.city}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono border capitalize ${statusBadge(order.returnStatus || "")}`}>
                  {order.returnStatus}
                </span>
              </div>

              <div className="space-y-2 mb-4">
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

              <div className="glass-panel rounded-xl p-3 bg-amber-50/50 mb-3">
                <p className="text-xs font-semibold text-foreground mb-1">Return Reason:</p>
                <p className="text-sm text-muted-foreground">{order.returnReason || "No reason provided"}</p>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Requested: {order.returnRequestedAt ? new Date(order.returnRequestedAt).toLocaleString() : "N/A"}
              </p>

              {order.returnStatus === "requested" && (
                <div className="flex gap-2">
                  <button onClick={() => handleReturnAction(order.id, "accepted")}
                    className="neon-button px-4 py-2 text-sm flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Accept
                  </button>
                  <button onClick={() => handleReturnAction(order.id, "rejected")}
                    className="neon-button-outline px-4 py-2 text-sm flex items-center gap-1.5 !border-destructive !text-destructive">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReturns;
