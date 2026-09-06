"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TbCurrencyLira } from "react-icons/tb";

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

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  currencyConfig: CurrencyConfig;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "TRY",
  setCurrency: () => {},
  currencyConfig: CURRENCY_CONFIGS.TRY,
});

const CURRENCY_STORAGE_KEY = "linen_line_selected_currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("TRY");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null;
      if (saved && CURRENCY_CONFIGS[saved]) {
        setCurrencyState(saved);
      } else {
        setCurrencyState("TRY");
      }
    } catch {
      setCurrencyState("TRY");
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setCurrency = (nextCurrency: CurrencyCode) => {
    setCurrencyState(nextCurrency);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, nextCurrency);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: isInitialized ? currency : "TRY",
        setCurrency,
        currencyConfig: CURRENCY_CONFIGS[isInitialized ? currency : "TRY"],
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
