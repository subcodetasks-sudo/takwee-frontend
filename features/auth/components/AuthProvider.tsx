"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { clearSession, ensureMockSession, getSession } from "../api/session";
import type { AuthSession, AuthSnapshot, AuthUser } from "../types";
import { getMockAuthSnapshot } from "../utils/mock-auth";

interface AuthContextValue extends AuthSnapshot {
  isLoading: boolean;
  /** Refresh auth state from the server session helpers. */
  refresh: () => Promise<void>;
  /** Clear the session cookie and mark signed out. */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<AuthSnapshot>(() =>
    getMockAuthSnapshot()
  );
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const next = await getSession();
    setSnapshot(next);
  }, []);

  const signOut = useCallback(async () => {
    const next = await clearSession();
    setSnapshot(next);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        // Aligns cookie + snapshot with DEV_MOCK_AUTHENTICATED.
        const next = await ensureMockSession();
        if (!cancelled) {
          setSnapshot(next);
        }
      } catch {
        if (!cancelled) {
          setSnapshot(getMockAuthSnapshot());
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...snapshot,
      isLoading,
      refresh,
      signOut,
    }),
    [snapshot, isLoading, refresh, signOut]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export type { AuthSession, AuthUser };
