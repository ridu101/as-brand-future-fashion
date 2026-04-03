import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerWithEmail, isLoggedIn, isAdmin, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate(isAdmin ? "/admin-dashboard" : "/", { replace: true });
    }
  }, [isAdmin, isLoggedIn, loading, navigate]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) nextErrors.name = "Name is required";

    if (!form.email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address";

    if (!form.password) nextErrors.password = "Password is required";
    else if (form.password.length < 6) nextErrors.password = "Password must be at least 6 characters";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    const result = await registerWithEmail(form.name, form.email, form.password);
    setSubmitting(false);

    if (result.success) {
      navigate(result.redirectTo || "/login", { replace: true });
    }
  };

  const inputClassName = (hasError?: boolean) =>
    `glass-panel w-full rounded-xl border px-10 py-3 text-sm text-foreground outline-none transition-all duration-300 ${hasError ? "border-destructive" : "border-border focus:border-primary focus:ring-1 focus:ring-primary/20"}`;

  return (
    <div className="min-h-screen pt-28 px-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-300">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Create your account</h1>
            <p className="text-sm text-muted-foreground">Sign up with email and password to start shopping.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, name: e.target.value }));
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={inputClassName(!!errors.name)}
                />
              </div>
              {errors.name && <p className="text-xs text-destructive mt-1 ml-1">{errors.name}</p>}
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, email: e.target.value }));
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={inputClassName(!!errors.email)}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, password: e.target.value }));
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`${inputClassName(!!errors.password)} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1 ml-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={submitting} className="neon-button w-full py-3 text-sm font-heading font-semibold disabled:opacity-60">
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? {" "}
            <Link to="/login" className="text-primary hover:underline font-medium">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;