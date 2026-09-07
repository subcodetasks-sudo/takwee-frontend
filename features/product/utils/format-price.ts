import type { CurrencyConfig } from "@/hooks/useCurrency";

export function formatPrice(
  amountTRY: number,
  currency: CurrencyConfig,
): string {
  const converted = amountTRY * currency.rateAgainstTRY;
  const fractionDigits =
    currency.code === "KWD" ? 3 : currency.code === "USD" ? 2 : 0;

  return new Intl.NumberFormat("en-US", {
    useGrouping: true,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(converted);
}
