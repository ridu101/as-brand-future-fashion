import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  name: string;
  email: string;
  role: "customer" | "admin";
  avatar?: string;
  createdAt: string;
}

interface RegisteredUser {
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loginCustomer: (name: string, email: string) => void;
  registerCustomer: (name: string, email: string, password: string) => boolean;
  loginWithCredentials: (email: string, password: string) => boolean;
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
      localStorage.setItem("as_auth_token", btoa(JSON.stringify({ email: user.email, role: user.role, exp: Date.now() + 86400000 })));
    } else {
      localStorage.removeItem("as_auth_user");
      localStorage.removeItem("as_auth_token");
      localStorage.removeItem("as_admin");
      localStorage.removeItem("as_customer");
    }
  }, [user]);

  const getRegisteredUsers = (): RegisteredUser[] => {
    try {
      return JSON.parse(localStorage.getItem("as_registered_users") || "[]");
    } catch { return []; }
  };

  const saveRegisteredUsers = (users: RegisteredUser[]) => {
    localStorage.setItem("as_registered_users", JSON.stringify(users));
  };

  const registerCustomer = useCallback((name: string, email: string, password: string): boolean => {
    const users = getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("An account with this email already exists");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    const newUser: RegisteredUser = { name, email: email.toLowerCase(), password, createdAt: new Date().toISOString() };
    saveRegisteredUsers([...users, newUser]);
    setUser({ name, email: email.toLowerCase(), role: "customer", createdAt: newUser.createdAt });
    return true;
  }, []);

  const loginWithCredentials = useCallback((email: string, password: string): boolean => {
    const users = getRegisteredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) {
      toast.error("Invalid email or password");
      return false;
    }
    setUser({ name: found.name, email: found.email, role: "customer", createdAt: found.createdAt });
    return true;
  }, []);

  const loginCustomer = useCallback((name: string, email: string) => {
    setUser({ name, email, role: "customer", createdAt: new Date().toISOString() });
  }, []);

  const loginAdmin = useCallback(() => {
    setUser({ name: "Azharul Islam", email: "admin@asbrand.com", role: "admin", createdAt: new Date().toISOString() });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Clear all session data
    localStorage.removeItem("as_auth_user");
    localStorage.removeItem("as_auth_token");
    localStorage.removeItem("as_admin");
    localStorage.removeItem("as_customer");
    toast.success("Logged out successfully");
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
    toast.success("Profile updated!");
  }, []);

  const requireAuth = useCallback((action?: string): boolean => {
    if (user) return true;
    toast.error(`⚠️ Please login first${action ? ` to ${action}` : " to continue"}`, {
      duration: 4000,
      action: { label: "Login", onClick: () => { window.location.href = "/login"; } },
    });
    return false;
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user, isAdmin: user?.role === "admin",
      loginCustomer, registerCustomer, loginWithCredentials, loginAdmin,
      logout, updateProfile, requireAuth,
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
