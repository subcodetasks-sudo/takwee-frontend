"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CurrencyCode = "TRY" | "SAR" | "AED" | "USD" | "QAR" | "KWD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstTRY: number; // For future conversions
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  TRY: { code: "TRY", symbol: "₺", rateAgainstTRY: 1.0 },
  SAR: { code: "SAR", symbol: "ر.س", rateAgainstTRY: 0.1 },
  AED: { code: "AED", symbol: "د.إ", rateAgainstTRY: 0.1 },
  USD: { code: "USD", symbol: "$", rateAgainstTRY: 0.026 },
  QAR: { code: "QAR", symbol: "ر.ق", rateAgainstTRY: 0.1 },
  KWD: { code: "KWD", symbol: "د.ك", rateAgainstTRY: 0.008 },
};

export const ALL_CURRENCY_CODES = Object.keys(CURRENCY_CONFIGS) as CurrencyCode[];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in CURRENCY_CONFIGS;
}

/** Keep only known storefront currency codes from an API list. */
export function filterSupportedCurrencies(
  codes: string[] | null | undefined,
  fallback: CurrencyCode[] = ["TRY", "SAR", "USD", "AED"],
): CurrencyCode[] {
  const filtered = (codes ?? [])
    .map((code) => code.trim().toUpperCase())
    .filter(isCurrencyCode);
  return filtered.length > 0 ? filtered : fallback;
}

function resolveDefaultCurrency(
  preferred: string | null | undefined,
  supported: CurrencyCode[],
): CurrencyCode {
  if (preferred) {
    const upper = preferred.trim().toUpperCase();
    if (isCurrencyCode(upper) && supported.includes(upper)) {
      return upper;
    }
  }
  return supported[0] ?? "TRY";
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  currencyConfig: CurrencyConfig;
  supportedCurrencies: CurrencyCode[];
  defaultCurrency: CurrencyCode;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "TRY",
  setCurrency: () => {},
  currencyConfig: CURRENCY_CONFIGS.TRY,
  supportedCurrencies: ["TRY", "SAR", "USD", "AED"],
  defaultCurrency: "TRY",
});

const CURRENCY_STORAGE_KEY = "linen_line_selected_currency";

type CurrencyProviderProps = {
  children: React.ReactNode;
  /** From app settings `default_currency` (RSC). */
  defaultCurrency?: string;
  /** From app settings `supported_currencies` (RSC). */
  supportedCurrencies?: string[];
};

export function CurrencyProvider({
  children,
  defaultCurrency: defaultCurrencyProp,
  supportedCurrencies: supportedCurrenciesProp,
}: CurrencyProviderProps) {
  const supportedCurrencies = useMemo(
    () => filterSupportedCurrencies(supportedCurrenciesProp),
    [supportedCurrenciesProp],
  );

  const defaultCurrency = useMemo(
    () => resolveDefaultCurrency(defaultCurrencyProp, supportedCurrencies),
    [defaultCurrencyProp, supportedCurrencies],
  );

  const [currency, setCurrencyState] = useState<CurrencyCode>(defaultCurrency);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved && isCurrencyCode(saved) && supportedCurrencies.includes(saved)) {
        setCurrencyState(saved);
      } else {
        setCurrencyState(defaultCurrency);
        if (saved && (!isCurrencyCode(saved) || !supportedCurrencies.includes(saved as CurrencyCode))) {
          localStorage.setItem(CURRENCY_STORAGE_KEY, defaultCurrency);
        }
      }
    } catch {
      setCurrencyState(defaultCurrency);
    } finally {
      setIsInitialized(true);
    }
  }, [defaultCurrency, supportedCurrencies]);

  const setCurrency = (nextCurrency: CurrencyCode) => {
    if (!supportedCurrencies.includes(nextCurrency)) return;
    setCurrencyState(nextCurrency);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, nextCurrency);
    } catch {
      // Ignore storage errors
    }
  };

  const activeCurrency = isInitialized ? currency : defaultCurrency;

  return (
    <CurrencyContext.Provider
      value={{
        currency: activeCurrency,
        setCurrency,
        currencyConfig: CURRENCY_CONFIGS[activeCurrency],
        supportedCurrencies,
        defaultCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
