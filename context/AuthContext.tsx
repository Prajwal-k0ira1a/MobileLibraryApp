import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../utils/token";

type AuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string) => void;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const stored = await getAuthToken();
        if (stored) setToken(stored);
      } catch (err) {
        console.error("Failed to load auth token:", err);
        setError("Failed to load authentication data");
        // Clear potentially corrupted token
        await clearAuthToken();
      } finally {
        setIsLoading(false);
        setIsReady(true);
      }
    })();
  }, []);

  const login = useCallback(async (newToken: string) => {
    try {
      setError(null);
      await setAuthToken(newToken);
      setToken(newToken);
    } catch (err) {
      console.error("Failed to save auth token:", err);
      setError("Failed to save authentication data");
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await clearAuthToken();
      setToken(null);
    } catch (err) {
      console.error("Failed to clear auth token:", err);
      setError("Failed to clear authentication data");
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      error,
      login,
      logout,
      clearError,
    }),
    [login, logout, clearError, token, isLoading, error]
  );

  if (!isReady) return null;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
