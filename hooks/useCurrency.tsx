"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCurrencies, type Currency } from "@/features/currencies";

export type CurrencyCode =
  | "TRY"
  | "SAR"
  | "AED"
  | "USD"
  | "QAR"
  | "KWD"
  | (string & {});

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstTRY: number;
  name?: string;
  isDefault?: boolean;
  id?: number;
}

export const DEFAULT_CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  TRY: { code: "TRY", symbol: "₺", rateAgainstTRY: 1.0, name: "Turkish Lira", isDefault: true },
  AED: { code: "AED", symbol: "د.إ", rateAgainstTRY: 0.979, name: "UAE Dirham" },
  SAR: { code: "SAR", symbol: "ر.س", rateAgainstTRY: 1.0, name: "Saudi Riyal" },
  USD: { code: "USD", symbol: "$", rateAgainstTRY: 0.266667, name: "US Dollar" },
  QAR: { code: "QAR", symbol: "ر.ق", rateAgainstTRY: 1.0, name: "Qatari Riyal" },
  KWD: { code: "KWD", symbol: "د.ك", rateAgainstTRY: 0.08, name: "Kuwaiti Dinar" },
};

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> =
  DEFAULT_CURRENCY_CONFIGS;

export const ALL_CURRENCY_CODES = Object.keys(DEFAULT_CURRENCY_CONFIGS) as CurrencyCode[];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return typeof value === "string" && value.trim().length > 0;
}

/** Keep only known storefront currency codes from an API list. */
export function filterSupportedCurrencies(
  codes: string[] | null | undefined,
  fallback: CurrencyCode[] = ["TRY", "AED", "SAR", "USD"],
): CurrencyCode[] {
  const filtered = (codes ?? [])
    .map((code) => code.trim().toUpperCase())
    .filter(isCurrencyCode);
  return filtered.length > 0 ? filtered : fallback;
}

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  currencyConfig: CurrencyConfig;
  supportedCurrencies: CurrencyCode[];
  defaultCurrency: CurrencyCode;
  currencies: Currency[];
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "TRY",
  setCurrency: () => {},
  currencyConfig: DEFAULT_CURRENCY_CONFIGS.TRY,
  supportedCurrencies: ["TRY", "AED", "SAR", "USD"],
  defaultCurrency: "TRY",
  currencies: [],
  isLoading: false,
});

const CURRENCY_STORAGE_KEY = "linen_line_selected_currency";

type CurrencyProviderProps = {
  children: React.ReactNode;
  /** From app settings `default_currency` (RSC). */
  defaultCurrency?: string;
  /** From app settings `supported_currencies` (RSC). */
  supportedCurrencies?: string[];
  /** Prefetched currencies from RSC `getCurrencies()`. */
  initialCurrencies?: Currency[];
};

export function CurrencyProvider({
  children,
  defaultCurrency: defaultCurrencyProp,
  supportedCurrencies: supportedCurrenciesProp,
  initialCurrencies,
}: CurrencyProviderProps) {
  const { currencies, isLoading } = useCurrencies(initialCurrencies);

  // Dynamic currency configs merging defaults with live API data
  const currencyConfigs = useMemo(() => {
    const map: Record<string, CurrencyConfig> = { ...DEFAULT_CURRENCY_CONFIGS };
    for (const c of currencies) {
      map[c.code] = {
        code: c.code,
        symbol: c.symbol,
        rateAgainstTRY: c.exchangeRate,
        name: c.name,
        isDefault: c.isDefault,
        id: c.id,
      };
    }
    return map;
  }, [currencies]);

  const supportedCurrencies = useMemo(() => {
    if (currencies.length > 0) {
      const apiCodes = currencies.map((c) => c.code);
      if (supportedCurrenciesProp && supportedCurrenciesProp.length > 0) {
        const filtered = supportedCurrenciesProp
          .map((code) => code.trim().toUpperCase())
          .filter((code) => apiCodes.includes(code));
        if (filtered.length > 0) return filtered;
      }
      return apiCodes;
    }
    return filterSupportedCurrencies(supportedCurrenciesProp);
  }, [currencies, supportedCurrenciesProp]);

  const defaultCurrency = useMemo(() => {
    if (defaultCurrencyProp) {
      const upper = defaultCurrencyProp.trim().toUpperCase();
      if (supportedCurrencies.includes(upper)) {
        return upper;
      }
    }
    const apiDefault = currencies.find(
      (c) => c.isDefault && supportedCurrencies.includes(c.code),
    );
    if (apiDefault) {
      return apiDefault.code;
    }
    return supportedCurrencies[0] ?? "TRY";
  }, [defaultCurrencyProp, currencies, supportedCurrencies]);

  const [currency, setCurrencyState] = useState<CurrencyCode>(defaultCurrency);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved && isCurrencyCode(saved) && supportedCurrencies.includes(saved)) {
        setCurrencyState(saved);
      } else {
        setCurrencyState(defaultCurrency);
        if (
          saved &&
          (!isCurrencyCode(saved) ||
            !supportedCurrencies.includes(saved as CurrencyCode))
        ) {
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
  const activeCurrencyConfig =
    currencyConfigs[activeCurrency] ??
    DEFAULT_CURRENCY_CONFIGS[activeCurrency] ?? {
      code: activeCurrency,
      symbol: activeCurrency,
      rateAgainstTRY: 1.0,
    };

  return (
    <CurrencyContext.Provider
      value={{
        currency: activeCurrency,
        setCurrency,
        currencyConfig: activeCurrencyConfig,
        supportedCurrencies,
        defaultCurrency,
        currencies,
        isLoading,
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

