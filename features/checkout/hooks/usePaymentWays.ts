"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchPaymentWays } from "../api/get-payment-ways";

export const paymentWaysQueryKey = (locale: string) =>
  ["payment-ways", locale] as const;

/** Shared checkout payment accounts. One request per locale session. */
export function usePaymentWays() {
  const locale = useLocale();
  const query = useQuery({
    queryKey: paymentWaysQueryKey(locale),
    queryFn: () => fetchPaymentWays(locale),
  });

  return {
    ...query,
    paymentWays: Array.isArray(query.data) ? query.data : [],
  };
}
