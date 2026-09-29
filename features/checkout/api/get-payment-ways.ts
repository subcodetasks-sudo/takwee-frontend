import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { PaymentWay } from "../types";
import type { ApiPaymentWaysResponse } from "../types/api";
import { mapPaymentWays } from "../utils/map-payment-ways";

const PAYMENT_WAYS_PATH = "/api/v1/payment-ways";

/**
 * Public payment accounts (`GET /api/v1/payment-ways`).
 * Throws on failure — intended as a React Query `queryFn`.
 */
export async function fetchPaymentWays(locale?: string): Promise<PaymentWay[]> {
  if (!getApiBaseUrl()) {
    throw new Error(
      "API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured",
    );
  }

  const json = await http.get<ApiPaymentWaysResponse>(PAYMENT_WAYS_PATH, {
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    next: {
      revalidate: 60,
      tags: [
        "payment-ways",
        locale ? `payment-ways:${locale}` : "payment-ways:default",
      ],
    },
  });

  if (!json?.success || !Array.isArray(json.data)) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Payment methods response missing data",
    );
  }

  return mapPaymentWays(json.data);
}
