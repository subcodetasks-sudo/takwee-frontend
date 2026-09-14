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
  SubmitBankTransferProofResult,
} from "../types";
import { mapCartItemsToApi, mapApiOrderToSummary } from "../utils/map-checkout";
import { toApiPaymentMethod } from "@/features/orders/utils/map-payment-method";
import { mapOrderDetail } from "@/features/orders/utils/map-order";
import type { ApiOrderDetail } from "@/features/orders/types/api";

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
      payment_method: string;
    } = {
      items: mapCartItemsToApi(input.items),
      address_id,
      payment_method: toApiPaymentMethod(input.paymentMethod),
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

/**
 * Submit bank-transfer payment proof
 * (POST /api/v1/my/orders/{orderId}/bank-transfer — multipart).
 */
export async function submitBankTransferProofAction(
  formData: FormData,
): Promise<ActionState<SubmitBankTransferProofResult>> {
  return safeServerAction(async () => {
    const orderId = String(formData.get("order_id") || "").trim();
    const transferHolderName = String(
      formData.get("transfer_holder_name") || "",
    ).trim();
    const transferDate = String(formData.get("transfer_date") || "").trim();
    const receipt = formData.get("receipt");
    const locale = String(formData.get("locale") || "").trim() || undefined;
    const currency =
      String(formData.get("currency") || "").trim() || undefined;

    if (!orderId) {
      throw new Error("Order id is required.");
    }
    if (!transferHolderName) {
      throw new Error("Transfer holder name is required.");
    }
    if (!transferDate) {
      throw new Error("Transfer date is required.");
    }
    if (!(receipt instanceof File) || receipt.size === 0) {
      throw new Error("A receipt file is required.");
    }

    const body = new FormData();
    body.append("transfer_holder_name", transferHolderName);
    body.append("transfer_date", transferDate);
    body.append("receipt", receipt);

    const res = await serverFetch<ApiResponse<ApiOrderDetail>>(
      `/api/v1/my/orders/${encodeURIComponent(orderId)}/bank-transfer`,
      {
        method: "POST",
        body,
        headers: buildHeaders(locale, currency),
        autoAuth: true,
      },
    );

    if (!res?.success || !res.data) {
      throw new Error(res?.message || "Failed to submit bank transfer proof");
    }

    return {
      order: mapOrderDetail(res.data, "bankTransfer"),
    };
  });
}

