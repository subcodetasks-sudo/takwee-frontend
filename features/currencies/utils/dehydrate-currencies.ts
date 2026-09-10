import { QueryClient, dehydrate, type DehydratedState } from "@tanstack/react-query";
import type { Currency } from "../types";
import { currenciesQueryKey } from "../hooks/useCurrencies";

/** Prefill React Query with RSC currencies so client consumers skip duplicate fetching. */
export function dehydrateCurrencies(
  currencies: Currency[] | null,
  locale?: string,
): DehydratedState {
  const queryClient = new QueryClient();
  if (currencies && currencies.length > 0) {
    queryClient.setQueryData(currenciesQueryKey(locale), currencies);
  }
  return dehydrate(queryClient);
}
