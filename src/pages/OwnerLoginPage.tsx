import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Shield, User, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const OwnerLoginPage = () => {
  const navigate = useNavigate();
  const { loginWithEmail, isAdmin, isLoggedIn, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate(isAdmin ? "/admin-dashboard" : "/", { replace: true });
    }
  }, [isAdmin, isLoggedIn, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!email || !password) { toast.error("Please fill in all fields"); return; }

    setSubmitting(true);
    const result = await loginWithEmail(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(result.redirectTo || "/", { replace: true });
    }
  };

  const inputClassName =
    "glass-panel w-full rounded-xl border border-border px-10 py-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary/20";

  return (
    <div className="min-h-screen pt-28 px-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-300">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="glass-card p-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground text-center mb-2">Admin Login</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">Owner access only</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)}
                className={inputClassName} />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                className={inputClassName} />
            </div>
            <button type="submit" disabled={submitting} className="neon-button w-full py-3 text-sm font-heading font-semibold disabled:opacity-60">
              {submitting ? "Logging in..." : "Access Dashboard"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default OwnerLoginPage;
