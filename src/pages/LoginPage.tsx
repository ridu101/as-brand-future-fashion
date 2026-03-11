import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Shield, ArrowRight } from "lucide-react";

const LoginPage = () => (
  <div className="min-h-screen pt-28 px-6 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl w-full"
    >
      <div className="text-center mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-gradient mb-4">Welcome to AS Brand</h1>
        <p className="text-muted-foreground">Choose how you'd like to continue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link to="/customer-login">
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-8 text-center cursor-pointer glow-behind group"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">Login as Customer</h2>
            <p className="text-sm text-muted-foreground mb-4">Browse, shop & track your orders</p>
            <span className="inline-flex items-center gap-1 text-primary text-sm font-mono">
              Continue <ArrowRight className="w-4 h-4" />
            </span>
          </motion.div>
        </Link>

        <Link to="/owner-login">
          <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-8 text-center cursor-pointer glow-behind group"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-2">Login as Owner</h2>
            <p className="text-sm text-muted-foreground mb-4">Manage products, orders & dashboard</p>
            <span className="inline-flex items-center gap-1 text-primary text-sm font-mono">
              Continue <ArrowRight className="w-4 h-4" />
            </span>
          </motion.div>
        </Link>
      </div>
    </motion.div>
  </div>
);

export default LoginPage;
