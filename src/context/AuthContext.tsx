import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export interface User {
  id: string;
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
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  requireAuth: (action?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUser = async (su: SupabaseUser): Promise<User> => {
  // Check if user is admin
  const { data: roles } = await supabase.rpc("has_role", { _user_id: su.id, _role: "admin" });
  
  return {
    id: su.id,
    name: su.user_metadata?.full_name || su.user_metadata?.name || su.email?.split("@")[0] || "",
    email: su.email || "",
    role: roles ? "admin" : "customer",
    avatar: su.user_metadata?.avatar_url,
    createdAt: su.created_at,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const mapped = await mapUser(session.user);
        setUser(mapped);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const mapped = await mapUser(session.user);
        setUser(mapped);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success("Welcome back!");
    return true;
  }, []);

  const registerWithEmail = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success("Account created successfully!");
    return true;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const { lovable } = await import("@/integrations/lovable");
    const result = await lovable.auth.signInWithOAuth("google");
    if (result.error) {
      toast.error("Google login failed");
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      name: data.name,
      email: data.email,
    }).eq("user_id", user.id);
    if (error) { toast.error("Update failed"); return; }
    setUser(prev => prev ? { ...prev, ...data } : null);
    toast.success("Profile updated!");
  }, [user]);

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
      user, isLoggedIn: !!user, isAdmin: user?.role === "admin", loading,
      loginWithEmail, registerWithEmail, loginWithGoogle,
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
