import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  apiLogin,
  apiLogout,
  apiMe,
  apiRegister,
  type AuthUser,
  type CitizenRegistrationInput,
} from "./api";
import {
  clearLegacyAuthStorage,
  initActivityTracking,
  touchActivity,
} from "./auth-storage";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    mfaCode?: string,
  ) => Promise<AuthUser>;
  register: (input: CitizenRegistrationInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // The credential is HttpOnly; session state is resolved exclusively by the API.
  useEffect(() => {
    clearLegacyAuthStorage();
    setIsLoading(true);
    apiMe()
      .then((u) => {
        setUser(u);
        touchActivity();
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Auto logout on inactivity
  useEffect(() => {
    if (!user) return;
    return initActivityTracking(() => {
      apiLogout().catch(() => {});
      setUser(null);
      window.location.href = "/login";
    });
  }, [user]);

  const login = useCallback(
    async (email: string, password: string, mfaCode?: string) => {
      setIsLoading(true);
      try {
        const data = await apiLogin(email, password, mfaCode);
        setUser(data.user);
        touchActivity();
        return data.user;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const register = useCallback(async (input: CitizenRegistrationInput) => {
    setIsLoading(true);
    try {
      const data = await apiRegister(input);
      setUser(data.user);
      touchActivity();
      return data.user;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      /* ignore */
    }
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const u = await apiMe();
    setUser(u);
    touchActivity();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
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
