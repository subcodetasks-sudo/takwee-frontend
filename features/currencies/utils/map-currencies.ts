import type { ApiCurrencyItem, Currency } from "../types";

export function mapCurrency(item: ApiCurrencyItem): Currency {
  const rawRate =
    typeof item.exchange_rate === "number"
      ? item.exchange_rate
      : parseFloat(String(item.exchange_rate));

  const exchangeRate = Number.isFinite(rawRate) && rawRate > 0 ? rawRate : 1;

  return {
    id: item.id,
    name: item.name?.trim() || "",
    code: (item.code ?? "").trim().toUpperCase(),
    symbol: item.symbol?.trim() || "",
    exchangeRate,
    isDefault: Boolean(item.is_default),
  };
}

export function mapCurrencies(items: ApiCurrencyItem[] | undefined | null): Currency[] {
  if (!Array.isArray(items)) return [];
  return items.map(mapCurrency);
}
