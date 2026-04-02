import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { isLoggedIn, isAdmin, loading } = useAuth();
  const toastShown = useRef(false);

  useEffect(() => {
    if (!loading && !isLoggedIn && !toastShown.current) {
      toastShown.current = true;
      toast.error("⚠️ Please login first to continue");
    }
  }, [isLoggedIn, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
