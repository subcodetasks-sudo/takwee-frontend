"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { THEME_STORAGE_KEY } from "../hooks/useGlobalTheme";

/**
 * App-wide theme via next-themes (`class` on <html>, system + light + dark).
 * Keep locale-dependent font classes on <body>, not <html>, so React does not
 * rewrite html className on language change and strip `dark`.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey={THEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
