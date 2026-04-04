import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle, isLoggedIn, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    if (!email.trim()) nextErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address";
    if (!password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    const result = await loginWithEmail(email, password);
    setSubmitting(false);
    if (result.success) {
      navigate(result.redirectTo || "/", { replace: true });
    }
  };

  const handleGoogleLogin = async () => {
    if (submitting) return;
    setSubmitting(true);
    await loginWithGoogle();
    setSubmitting(false);
  };

  const inputClassName = (hasError?: boolean) =>
    `glass-panel w-full rounded-xl border px-10 py-3 text-sm text-foreground outline-none transition-all duration-300 ${hasError ? "border-destructive" : "border-border focus:border-primary focus:ring-1 focus:ring-primary/20"}`;

  return (
    <div className="min-h-screen pt-28 px-6 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors duration-300">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Login to your account</h1>
            <p className="text-sm text-muted-foreground">Use email, password, or Google to continue.</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="glass-panel w-full rounded-xl border border-border py-3 flex items-center justify-center gap-3 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground font-mono">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" placeholder="Email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "" })); }}
                  className={inputClassName(!!errors.email)} />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: "" })); }}
                  className={`${inputClassName(!!errors.password)} pr-10`} />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1 ml-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={submitting} className="neon-button w-full py-3 text-sm font-heading font-semibold disabled:opacity-60">
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">Create one</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
