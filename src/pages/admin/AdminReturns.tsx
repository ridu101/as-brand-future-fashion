import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useReturns, ReturnStatus, RETURN_STATUS_LABELS } from "@/context/ReturnContext";

const STATUS_OPTIONS: ReturnStatus[] = [
  "requested",
  "parcel_received",
  "reviewing",
  "approved_refund",
  "exchange_sent",
  "rejected",
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    requested: "bg-amber-50 text-amber-600 border-amber-200",
    parcel_received: "bg-blue-50 text-blue-600 border-blue-200",
    reviewing: "bg-violet-50 text-violet-600 border-violet-200",
    approved_refund: "bg-emerald-50 text-emerald-600 border-emerald-200",
    exchange_sent: "bg-cyan-50 text-cyan-600 border-cyan-200",
    rejected: "bg-red-50 text-red-600 border-red-200",
  };
  return styles[status] || styles.requested;
};

const AdminReturns = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { returns, updateReturnStatus, refresh } = useReturns();

  useEffect(() => { if (!isAdmin) navigate("/login"); }, [isAdmin, navigate]);
  useEffect(() => { if (isAdmin) refresh(); }, [isAdmin]);

  return (
    <div className="min-h-screen pt-28 px-6 max-w-5xl mx-auto pb-20">
      <button
        onClick={() => navigate("/admin-dashboard")}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-300"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Return Orders</h1>
      <p className="text-sm text-muted-foreground mb-8">Live updates via realtime sync.</p>

      {returns.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl p-12 text-center">
          <RotateCcw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No return requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map(r => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <img
                    src={r.productImage}
                    alt={r.productTitle}
                    className="w-16 h-16 rounded-xl object-cover border border-white/40"
                  />
                  <div>
                    <p className="font-mono text-xs text-primary">Order #{r.orderId.slice(0, 8)}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{r.productTitle}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      Size {r.productSize} × {r.productQuantity}
                    </p>
                    {r.customerName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {r.customerName} · {r.customerPhone}
                      </p>
                    )}
                    {r.customerAddress && (
                      <p className="text-xs text-muted-foreground">{r.customerAddress}</p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono border whitespace-nowrap ${statusBadge(r.status)}`}
                >
                  {RETURN_STATUS_LABELS[r.status]}
                </span>
              </div>

              <div className="bg-amber-50/60 backdrop-blur-sm border border-amber-100 rounded-xl p-3 mb-4">
                <p className="text-xs font-semibold text-foreground mb-1">Return Reason:</p>
                <p className="text-sm text-muted-foreground">{r.reason || "No reason provided"}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Requested: {new Date(r.createdAt).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground">Update status:</label>
                  <select
                    value={r.status}
                    onChange={e => updateReturnStatus(r.id, e.target.value as ReturnStatus)}
                    className="bg-white/70 backdrop-blur-md border border-white/40 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{RETURN_STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReturns;
