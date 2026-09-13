"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

export type ThemeMode = "system" | "light" | "dark";

export const THEME_STORAGE_KEY = "linen_theme";
export const COMPACT_STORAGE_KEY = "linen_compact_mode";

export function applyCompactMode(compact: boolean) {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (compact) {
    root.classList.add("compact-density");
  } else {
    root.classList.remove("compact-density");
  }
}

function getStoredCompact(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(COMPACT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

const compactListeners = new Set<() => void>();

function subscribeCompact(callback: () => void) {
  compactListeners.add(callback);
  return () => {
    compactListeners.delete(callback);
  };
}

function notifyCompact() {
  compactListeners.forEach((listener) => listener());
}

const emptySubscribe = () => () => {};

/**
 * Boutique theme + compact density. Theme is owned by next-themes;
 * compact mode stays on a small localStorage helper.
 */
export function useGlobalTheme() {
  const { theme, setTheme: setNextTheme } = useTheme();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const compactMode = useSyncExternalStore<boolean>(
    subscribeCompact,
    getStoredCompact,
    () => false,
  );

  useEffect(() => {
    applyCompactMode(getStoredCompact());

    const handleStorage = (e: StorageEvent) => {
      if (e.key === COMPACT_STORAGE_KEY) {
        applyCompactMode(e.newValue === "true");
        notifyCompact();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setTheme = useCallback(
    (newTheme: ThemeMode) => {
      setNextTheme(newTheme);
    },
    [setNextTheme],
  );

  const setCompactMode = useCallback((newCompact: boolean) => {
    try {
      localStorage.setItem(COMPACT_STORAGE_KEY, String(newCompact));
    } catch {
      // Storage unavailable
    }
    applyCompactMode(newCompact);
    notifyCompact();
  }, []);

  const resolved: ThemeMode =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  return {
    theme: resolved,
    setTheme,
    compactMode,
    setCompactMode,
    isMounted,
  };
}
