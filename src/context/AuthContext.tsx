import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";

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
  loginWithEmail: (email: string, password: string) => Promise<AuthResult>;
  registerWithEmail: (name: string, email: string, password: string) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  requireAuth: (action?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthResult {
  success: boolean;
  redirectTo?: string;
  role?: User["role"];
}

const authStorageMatchers = ["-auth-token", "supabase.auth.token"];
const profileSyncCache = new Map<string, Promise<void>>();

const clearStoredAuthState = () => {
  if (typeof window === "undefined") return;

  Object.keys(window.localStorage).forEach((key) => {
    if (authStorageMatchers.some((matcher) => key.includes(matcher))) {
      window.localStorage.removeItem(key);
    }
  });
};

const getFriendlyAuthError = (message?: string) => {
  const normalized = (message || "").toLowerCase();

  if (normalized.includes("invalid login credentials")) return "Incorrect email or password.";
  if (normalized.includes("user already registered")) return "An account with this email already exists.";
  if (normalized.includes("email not confirmed")) return "Email confirmation is disabled, please try signing in again.";
  if (normalized.includes("password should be at least")) return "Password must be at least 6 characters long.";
  if (normalized.includes("unable to validate email") || normalized.includes("invalid email")) return "Please enter a valid email address.";
  if (normalized.includes("refresh token") || normalized.includes("jwt")) return "Your session expired. Please sign in again.";

  return message || "Something went wrong. Please try again.";
};

const getDisplayName = (su: SupabaseUser, fallbackName?: string) => {
  return (
    fallbackName?.trim() ||
    su.user_metadata?.full_name ||
    su.user_metadata?.name ||
    su.email?.split("@")[0] ||
    "Customer"
  );
};

const ensureProfileRecord = async (su: SupabaseUser, fallbackName?: string) => {
  const pendingSync = profileSyncCache.get(su.id);
  if (pendingSync) {
    await pendingSync;
    return;
  }

  const syncPromise = (async () => {
    const name = getDisplayName(su, fallbackName);
    const email = su.email || "";

    const { data: profiles, error: fetchError } = await supabase
      .from("profiles")
      .select("id, name, email")
      .eq("user_id", su.id)
      .order("created_at", { ascending: true })
      .limit(1);

    if (fetchError) throw fetchError;

    const existingProfile = profiles?.[0];

    if (!existingProfile) {
      const { error: insertError } = await supabase.from("profiles").insert({
        user_id: su.id,
        name,
        email,
      });

      if (insertError) throw insertError;
      return;
    }

    if (existingProfile.name !== name || existingProfile.email !== email) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ name, email })
        .eq("id", existingProfile.id);

      if (updateError) throw updateError;
    }
  })().finally(() => {
    profileSyncCache.delete(su.id);
  });

  profileSyncCache.set(su.id, syncPromise);
  await syncPromise;
};

const mapUser = async (su: SupabaseUser): Promise<User> => {
  const [{ data: isAdmin }, { data: profiles }] = await Promise.all([
    supabase.rpc("has_role", { _user_id: su.id, _role: "admin" }),
    supabase
      .from("profiles")
      .select("name, email, avatar_url, created_at")
      .eq("user_id", su.id)
      .order("created_at", { ascending: true })
      .limit(1),
  ]);

  const profile = profiles?.[0];

  return {
    id: su.id,
    name: profile?.name || getDisplayName(su),
    email: profile?.email || su.email || "",
    role: isAdmin ? "admin" : "customer",
    avatar: profile?.avatar_url || su.user_metadata?.avatar_url,
    createdAt: profile?.created_at || su.created_at,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const syncAuthenticatedUser = useCallback(async (authUser: SupabaseUser, fallbackName?: string) => {
    await ensureProfileRecord(authUser, fallbackName);
    const mappedUser = await mapUser(authUser);
    setUser(mappedUser);
    return mappedUser;
  }, []);

  const applySession = useCallback(
    async (session: Session | null, fallbackName?: string) => {
      if (!session?.user) {
        setUser(null);
        return null;
      }

      return syncAuthenticatedUser(session.user, fallbackName);
    },
    [syncAuthenticatedUser],
  );

  useEffect(() => {
    let active = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      void (async () => {
        if (!active) return;

        try {
          await applySession(session);
        } finally {
          if (active) setLoading(false);
        }
      })();
    });

    void (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          clearStoredAuthState();
          setUser(null);
          return;
        }

        await applySession(data.session);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [applySession]);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    clearStoredAuthState();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      toast.error(getFriendlyAuthError(error.message));
      return { success: false };
    }

    if (!data.user) {
      toast.error("Unable to sign you in right now. Please try again.");
      return { success: false };
    }

    const mappedUser = await syncAuthenticatedUser(data.user);
    toast.success(mappedUser.role === "admin" ? "Admin login successful" : "Welcome back!");

    return {
      success: true,
      role: mappedUser.role,
      redirectTo: mappedUser.role === "admin" ? "/admin-dashboard" : "/",
    };
  }, [syncAuthenticatedUser]);

  const registerWithEmail = useCallback(async (name: string, email: string, password: string): Promise<AuthResult> => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      toast.error("Name is required.");
      return { success: false };
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return { success: false };
    }

    clearStoredAuthState();

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        data: {
          full_name: trimmedName,
          name: trimmedName,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast.error(getFriendlyAuthError(error.message));
      return { success: false };
    }

    if (!data.user) {
      toast.error("Could not create your account. Please try again.");
      return { success: false };
    }

    try {
      await ensureProfileRecord(data.user, trimmedName);
    } catch {
      toast.error("Your account was created, but your profile could not be saved.");
      return { success: false };
    }

    await supabase.auth.signOut({ scope: "local" });
    clearStoredAuthState();
    toast.success("Account created successfully");

    return {
      success: true,
      role: "customer",
      redirectTo: "/login",
    };
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const { lovable } = await import("@/integrations/lovable");
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });

    if (result.error) {
      toast.error(getFriendlyAuthError(result.error.message));
    }
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    clearStoredAuthState();
    setUser(null);

    if (error) {
      toast.error("Logout failed. Please try again.");
      return;
    }

    toast.success("Logged out successfully");
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!user) return;

    const name = data.name?.trim() || user.name;
    const email = data.email?.trim() || user.email;

    const { data: profiles, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1);

    if (fetchError) {
      toast.error("Update failed");
      return;
    }

    const profile = profiles?.[0];

    const { error } = profile
      ? await supabase.from("profiles").update({ name, email }).eq("id", profile.id)
      : await supabase.from("profiles").insert({ user_id: user.id, name, email });

    if (error) {
      toast.error("Update failed");
      return;
    }

    setUser((prev) => (prev ? { ...prev, name, email } : null));
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
