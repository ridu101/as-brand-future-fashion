import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  const toastShown = useRef(false);

  useEffect(() => {
    if (!isLoggedIn && !toastShown.current) {
      toastShown.current = true;
      toast.error("⚠️ Please login first to continue");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
