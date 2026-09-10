export type { ApiCurrencyItem, ApiCurrenciesResponse } from "./api";

/** Storefront view model for a supported currency. */
export interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
}
