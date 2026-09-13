"use server";

import { safeServerAction, serverFetch, type ActionState } from "@/lib/api-server";
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

const PREVIEW_PATH = "/api/v1/checkout/preview";
const CHECKOUT_PATH = "/api/v1/checkout";

function buildHeaders(
  locale?: string,
  currency?: string,
): Record<string, string> {
  const headers: Record<string, string> = {};
  if (locale) headers["Accept-Language"] = locale;
  if (currency) headers["X-Currency"] = currency;
  return headers;
}

export interface ServerCheckoutPreviewInput {
  items: CartItem[];
  addressId?: string;
  couponCode?: string;
  locale?: string;
  currency?: string;
}

/**
 * Server action / server-fetch for Checkout Preview (POST /api/v1/checkout/preview).
 * Automatically passes the session cookie token via serverFetch.
 */
export async function previewCheckoutAction(
  input: ServerCheckoutPreviewInput,
): Promise<ActionState<CheckoutPreviewResult>> {
  return safeServerAction(async () => {
    const payload: {
      items: ReturnType<typeof mapCartItemsToApi>;
      address_id?: number | string;
      coupon_code?: string;
    } = {
      items: mapCartItemsToApi(input.items),
    };

    if (input.addressId?.trim()) {
      const num = Number(input.addressId);
      payload.address_id = Number.isFinite(num) && !isNaN(num) ? num : input.addressId;
    }

    if (input.couponCode?.trim()) {
      payload.coupon_code = input.couponCode.trim();
    }

    const res = await serverFetch<ApiResponse<ApiCheckoutPreviewData>>(
      PREVIEW_PATH,
      {
        method: "POST",
        body: payload,
        headers: buildHeaders(input.locale, input.currency),
        autoAuth: true,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to calculate checkout preview");
    }

    return {
      items: res.data.items || [],
      pricing: res.data.pricing,
      shippingAddress: res.data.shipping_address,
      coupon: res.data.coupon,
    };
  });
}

export interface ServerPlaceOrderInput extends PlaceOrderInput {
  locale?: string;
  currency?: string;
}

/**
 * Server action / server-fetch for Place Order (POST /api/v1/checkout).
 * Executes on the server and automatically injects authentication cookies.
 */
export async function placeOrderAction(
  input: ServerPlaceOrderInput,
): Promise<ActionState<PlaceOrderResult>> {
  return safeServerAction(async () => {
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
    } = {
      items: mapCartItemsToApi(input.items),
      address_id,
    };

    if (input.couponCode?.trim()) {
      payload.coupon_code = input.couponCode.trim();
    }

    const res = await serverFetch<ApiResponse<ApiPlaceOrderData>>(
      CHECKOUT_PATH,
      {
        method: "POST",
        body: payload,
        headers: buildHeaders(input.locale, input.currency),
        autoAuth: true,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to place order");
    }

    const order = mapApiOrderToSummary(res.data, input.paymentMethod);
    return { order };
  });
}
