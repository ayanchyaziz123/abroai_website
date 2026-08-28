"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api, setTokens, clearTokens, getTokens } from "./api";

export type AbrofyUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  name?: string;
};

type AuthContextValue = {
  user: AbrofyUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AbrofyUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const { access } = getTokens();
    if (!access) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = (await api("/auth/me/")) as AbrofyUser;
      setUser(me);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    // Django SimpleJWT expects the `username` field — the backend's accounts
    // app sends the email address as the username value (see the mobile
    // app's authStore.js login(), same pattern here).
    const data = (await api("/auth/login/", {
      method: "POST",
      body: { username: email, password },
      auth: false,
    })) as { access: string; refresh: string };
    setTokens(data.access, data.refresh);
    await refreshUser();
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
