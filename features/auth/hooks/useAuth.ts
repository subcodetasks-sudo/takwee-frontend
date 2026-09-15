"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { getSession } from "../api/session";
import { logoutAction } from "../api/actions";
import {
  UNAUTHENTICATED_SNAPSHOT,
  type AuthSession,
  type AuthSnapshot,
  type AuthUser,
} from "../types";

export const AUTH_SESSION_QUERY_KEY = ["auth-session"] as const;

export interface UseAuthReturn extends AuthSnapshot {
  isLoading: boolean;
  /** Invalidate and refetch auth session. */
  refresh: () => Promise<void>;
  /** Sign out from backend and reset session cache. */
  signOut: () => Promise<void>;
  /** Update cache directly with a new snapshot. */
  setSnapshot: (snapshot: AuthSnapshot) => void;
}

export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient();

  const { data: snapshot, isLoading } = useQuery<AuthSnapshot>({
    queryKey: AUTH_SESSION_QUERY_KEY,
    queryFn: () => getSession(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handleUnauthorized = () => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, UNAUTHENTICATED_SNAPSHOT);
      void queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      void queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      void queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
      void queryClient.invalidateQueries({ queryKey: ["user-notifications"] });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [queryClient]);

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_QUERY_KEY });
  }, [queryClient]);

  const signOut = useCallback(async () => {
    await logoutAction();
    queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, UNAUTHENTICATED_SNAPSHOT);
  }, [queryClient]);

  const setSnapshot = useCallback(
    (newSnapshot: AuthSnapshot) => {
      queryClient.setQueryData(AUTH_SESSION_QUERY_KEY, newSnapshot);
    },
    [queryClient],
  );

  return {
    user: snapshot?.user ?? null,
    session: snapshot?.session ?? null,
    isAuthenticated: snapshot?.isAuthenticated ?? false,
    isLoading,
    refresh,
    signOut,
    setSnapshot,
  };
}

export type { AuthSession, AuthUser, AuthSnapshot };
