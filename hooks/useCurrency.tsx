"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCurrencies, type Currency } from "@/features/currencies";

export type CurrencyCode = string;

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateAgainstTRY: number;
  name?: string;
  isDefault?: boolean;
  id?: number;
}

const EMPTY_CURRENCY_CONFIG: CurrencyConfig = {
  code: "",
  symbol: "",
  rateAgainstTRY: 1,
};

export function isCurrencyCode(value: string): value is CurrencyCode {
  return typeof value === "string" && value.trim().length > 0;
}

function toCurrencyConfig(currency: Currency): CurrencyConfig {
  return {
    code: currency.code,
    symbol: currency.symbol,
    rateAgainstTRY: currency.exchangeRate,
    name: currency.name,
    isDefault: currency.isDefault,
    id: currency.id,
  };
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
  currency: "",
  setCurrency: () => {},
  currencyConfig: EMPTY_CURRENCY_CONFIG,
  supportedCurrencies: [],
  defaultCurrency: "",
  currencies: [],
  isLoading: true,
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

  const currencyConfigs = useMemo(() => {
    const map: Record<string, CurrencyConfig> = {};
    for (const currency of currencies) {
      if (!currency.code) continue;
      map[currency.code] = toCurrencyConfig(currency);
    }
    return map;
  }, [currencies]);

  const supportedCurrencies = useMemo(() => {
    const apiCodes = currencies.map((currency) => currency.code).filter(Boolean);
    if (apiCodes.length === 0) return [];

    if (supportedCurrenciesProp && supportedCurrenciesProp.length > 0) {
      const filtered = supportedCurrenciesProp
        .map((code) => code.trim().toUpperCase())
        .filter((code) => apiCodes.includes(code));
      if (filtered.length > 0) return filtered;
    }

    return apiCodes;
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
    return supportedCurrencies[0] ?? "";
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
    currencyConfigs[activeCurrency] ?? EMPTY_CURRENCY_CONFIG;

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

