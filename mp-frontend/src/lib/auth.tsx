import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiLogin, apiLogout, apiMe, apiRegister, type AuthUser } from "./api";
import {
  clearStoredAuth,
  getStoredAuth,
  initActivityTracking,
  setStoredAuth,
  touchActivity,
} from "./auth-storage";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
  ) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stored = getStoredAuth();
  const [user, setUser] = useState<AuthUser | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);
  const [isLoading, setIsLoading] = useState(!!stored.token);

  // Always validate token with server on mount
  useEffect(() => {
    const { token: storedToken } = getStoredAuth();
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    apiMe()
      .then((u) => {
        setUser(u);
        setToken(storedToken);
        setStoredAuth(storedToken, u);
        touchActivity();
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        clearStoredAuth();
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Auto logout on inactivity
  useEffect(() => {
    if (!token) return;
    return initActivityTracking(() => {
      apiLogout().catch(() => {});
      setToken(null);
      setUser(null);
      clearStoredAuth();
      window.location.href = "/login";
    });
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await apiLogin(email, password);
      setStoredAuth(data.access_token, data.user);
      setToken(data.access_token);
      setUser(data.user);
      touchActivity();
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      password_confirmation: string,
    ) => {
      setIsLoading(true);
      try {
        const data = await apiRegister(
          name,
          email,
          password,
          password_confirmation,
        );
        setStoredAuth(data.access_token, data.user);
        setToken(data.access_token);
        setUser(data.user);
        touchActivity();
        return data.user;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      /* ignore */
    }
    setToken(null);
    setUser(null);
    clearStoredAuth();
  }, []);

  const refreshUser = useCallback(async () => {
    const u = await apiMe();
    setUser(u);
    if (token) setStoredAuth(token, u);
    touchActivity();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
