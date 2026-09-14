import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { CartItem } from "@/features/cart/types";
import type {
  ApiCheckoutPreviewData,
  ApiPlaceOrderData,
  ApiResponse,
} from "../types/api";
import type {
  CheckoutPreviewResult,
  PlaceOrderInput,
  PlaceOrderResult,
} from "../types";
import { mapCartItemsToApi, mapApiOrderToSummary } from "../utils/map-checkout";
import { toApiPaymentMethod } from "@/features/orders/utils/map-payment-method";

const PREVIEW_PATH = "/api/v1/checkout/preview";
const CHECKOUT_PATH = "/api/v1/checkout";

function requireToken(token: string) {
  if (!getApiBaseUrl()) {
    throw new Error("API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  if (!token) {
    throw new Error("Authentication required");
  }
}

function buildHeaders(
  locale?: string,
  currency?: string,
): Record<string, string> {
  const headers: Record<string, string> = {};
  if (locale) headers["Accept-Language"] = locale;
  if (currency) headers["X-Currency"] = currency;
  return headers;
}

function extractFieldErrors(data: unknown): Record<string, string[]> | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const d = data as {
    errors?: Record<string, string[]>;
    data?: Record<string, string[]>;
  };
  return (
    d.errors ||
    (d.data && typeof d.data === "object" && !Array.isArray(d.data)
      ? d.data
      : undefined)
  );
}

function throwWithApiError(error: unknown, fallbackMessage: string): never {
  if (error instanceof ApiError) {
    const fieldErrors = extractFieldErrors(error.data);
    const serverMessage =
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data &&
      typeof (error.data as { message?: unknown }).message === "string"
        ? (error.data as { message: string }).message
        : undefined;

    const message = serverMessage || error.message || fallbackMessage;
    const enriched = new Error(message) as Error & {
      fieldErrors?: Record<string, string[]>;
    };
    if (fieldErrors) enriched.fieldErrors = fieldErrors;
    throw enriched;
  }
  throw error instanceof Error ? error : new Error(fallbackMessage);
}

export interface FetchCheckoutPreviewOptions {
  token: string;
  items: CartItem[];
  addressId?: string;
  couponCode?: string;
  locale?: string;
  currency?: string;
}

/**
 * Preview checkout endpoint (POST /api/v1/checkout/preview).
 * Quotes items, coupon, shipping, and totals without creating an order.
 */
export async function previewCheckout({
  token,
  items,
  addressId,
  couponCode,
  locale,
  currency,
}: FetchCheckoutPreviewOptions): Promise<CheckoutPreviewResult> {
  requireToken(token);

  const payload: {
    items: ReturnType<typeof mapCartItemsToApi>;
    address_id?: number | string;
    coupon_code?: string;
  } = {
    items: mapCartItemsToApi(items),
  };

  if (addressId?.trim()) {
    const num = Number(addressId);
    payload.address_id = Number.isFinite(num) && !isNaN(num) ? num : addressId;
  }

  if (couponCode?.trim()) {
    payload.coupon_code = couponCode.trim();
  }

  try {
    const res = await http.post<ApiResponse<ApiCheckoutPreviewData>>(
      PREVIEW_PATH,
      payload,
      {
        token,
        headers: buildHeaders(locale, currency),
      },
    );

    if (!res?.success || !res.data) {
      throw new ApiError(
        500,
        "Invalid Payload",
        res,
        res?.message || "Failed to preview checkout",
      );
    }

    return {
      items: res.data.items || [],
      pricing: res.data.pricing,
      shippingAddress: res.data.shipping_address,
      coupon: res.data.coupon,
    };
  } catch (error) {
    throwWithApiError(error, "Failed to calculate checkout preview");
  }
}

export interface PlaceOrderApiOptions {
  token: string;
  input: PlaceOrderInput;
  locale?: string;
  currency?: string;
}

/**
 * Place order endpoint (POST /api/v1/checkout).
 * Creates a pending order and shipment. Requires addressId owned by the user.
 */
export async function placeOrder({
  token,
  input,
  locale,
  currency,
}: PlaceOrderApiOptions): Promise<PlaceOrderResult> {
  requireToken(token);

  if (!input.addressId?.trim()) {
    throw new Error("A shipping address is required to place the order.");
  }

  const numAddr = Number(input.addressId);
  const address_id =
    Number.isFinite(numAddr) && !isNaN(numAddr) ? numAddr : input.addressId;

  const payload: {
    items: ReturnType<typeof mapCartItemsToApi>;
    address_id: number | string;
    coupon_code?: string;
    payment_method: string;
  } = {
    items: mapCartItemsToApi(input.items),
    address_id,
    payment_method: toApiPaymentMethod(input.paymentMethod),
  };

  if (input.couponCode?.trim()) {
    payload.coupon_code = input.couponCode.trim();
  }

  try {
    const res = await http.post<ApiResponse<ApiPlaceOrderData>>(
      CHECKOUT_PATH,
      payload,
      {
        token,
        headers: buildHeaders(locale, currency),
      },
    );

    if (!res?.success || !res.data) {
      throw new ApiError(
        500,
        "Invalid Payload",
        res,
        res?.message || "Failed to place order",
      );
    }

    const order = mapApiOrderToSummary(res.data, input.paymentMethod);
    return { order };
  } catch (error) {
    throwWithApiError(error, "Failed to place order");
  }
}
