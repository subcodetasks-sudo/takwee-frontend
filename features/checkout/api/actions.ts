"use server";

import { safeServerAction, serverFetch, type ActionState } from "@/lib/api-server";
import type { CartItem } from "@/features/cart/types";
import type {
  ApiApplyCouponData,
  ApiCheckoutPreviewData,
  ApiPlaceOrderData,
  ApiResponse,
} from "../types/api";
import type {
  ApplyCouponResult,
  CheckoutPreviewResult,
  PlaceOrderInput,
  PlaceOrderResult,
} from "../types";
import { mapCartItemsToApi, mapApiOrderToSummary } from "../utils/map-checkout";

const PREVIEW_PATH = "/api/v1/checkout/preview";
const CHECKOUT_PATH = "/api/v1/checkout";
const APPLY_COUPON_PATH = "/api/v1/coupons/apply";

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

export interface ServerApplyCouponInput {
  code: string;
  items: CartItem[];
  locale?: string;
  currency?: string;
}

/**
 * Server action / server-fetch for Apply Coupon (POST /api/v1/coupons/apply).
 * Validates the promo against cart line items via session-authenticated serverFetch.
 */
export async function applyCouponAction(
  input: ServerApplyCouponInput,
): Promise<ActionState<ApplyCouponResult>> {
  return safeServerAction(async () => {
    const code = input.code.trim();
    if (!code) {
      throw new Error("A coupon code is required.");
    }
    if (!input.items.length) {
      throw new Error("Cart items are required to apply a coupon.");
    }

    const payload = {
      code,
      items: mapCartItemsToApi(input.items).map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    const res = await serverFetch<ApiResponse<ApiApplyCouponData>>(
      APPLY_COUPON_PATH,
      {
        method: "POST",
        body: payload,
        headers: buildHeaders(input.locale, input.currency),
        autoAuth: true,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to apply coupon");
    }

    const data = res.data;
    const appliedCode =
      (typeof data.code === "string" && data.code.trim()) ||
      (typeof data.coupon?.code === "string" && data.coupon.code.trim()) ||
      code;

    const discountRaw = data.discount_amount ?? data.discount ?? 0;
    const discount =
      typeof discountRaw === "number"
        ? discountRaw
        : Number(discountRaw) || 0;

    return {
      code: appliedCode,
      discount,
      coupon: data.coupon ?? null,
    };
  });
}

export interface ServerRemoveCouponInput {
  code: string;
  items: CartItem[];
  locale?: string;
  currency?: string;
}

/**
 * Server action / server-fetch for Remove Coupon (DELETE /api/v1/coupons/apply).
 * Clears the promo against cart line items via session-authenticated serverFetch.
 */
export async function removeCouponAction(
  input: ServerRemoveCouponInput,
): Promise<ActionState<{ code: string }>> {
  return safeServerAction(async () => {
    const code = input.code.trim();
    if (!code) {
      throw new Error("A coupon code is required.");
    }
    if (!input.items.length) {
      throw new Error("Cart items are required to remove a coupon.");
    }

    const payload = {
      code,
      items: mapCartItemsToApi(input.items).map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    const res = await serverFetch<ApiResponse<ApiApplyCouponData | null> | undefined>(
      APPLY_COUPON_PATH,
      {
        method: "DELETE",
        body: payload,
        headers: buildHeaders(input.locale, input.currency),
        autoAuth: true,
      },
    );

    // 204 No Content or empty body counts as success
    if (res == null) {
      return { code };
    }

    if (res.success === false) {
      throw new Error(res.message || "Failed to remove coupon");
    }

    return { code };
  });
}
