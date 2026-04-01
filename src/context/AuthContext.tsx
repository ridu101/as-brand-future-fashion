import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface User {
  name: string;
  email: string;
  role: "customer" | "admin";
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loginCustomer: (name: string, email: string) => void;
  loginAdmin: () => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  requireAuth: (action?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("as_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("as_auth_user", JSON.stringify(user));
      // Keep legacy keys for backward compat
      if (user.role === "admin") localStorage.setItem("as_admin", "true");
      else localStorage.setItem("as_customer", JSON.stringify({ name: user.name, email: user.email }));
    } else {
      localStorage.removeItem("as_auth_user");
      localStorage.removeItem("as_admin");
      localStorage.removeItem("as_customer");
    }
  }, [user]);

  const loginCustomer = useCallback((name: string, email: string) => {
    setUser({ name, email, role: "customer", createdAt: new Date().toISOString() });
  }, []);

  const loginAdmin = useCallback(() => {
    setUser({ name: "Azharul Islam", email: "admin@asbrand.com", role: "admin", createdAt: new Date().toISOString() });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    toast.success("Profile updated!");
  }, []);

  const requireAuth = useCallback((action?: string): boolean => {
    if (user) return true;
    toast.error(`⚠️ Please login first${action ? ` to ${action}` : " to continue"}`, {
      action: { label: "Login", onClick: () => window.location.href = "/login" },
    });
    return false;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user, isAdmin: user?.role === "admin",
      loginCustomer, loginAdmin, logout, updateProfile, requireAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
