import type { CartItem } from "@/features/cart/types";
import { mapOrderDetail } from "@/features/orders/utils/map-order";
import type { ApiOrderDetail } from "@/features/orders/types/api";
import type { ApiCheckoutItemInput, ApiPlaceOrderData } from "../types/api";
import type { CheckoutPaymentMethod } from "../types";

/**
 * Transforms client CartItem array into the payload expected by the API
 * POST /v1/checkout/preview and POST /v1/checkout
 */
export function mapCartItemsToApi(items: CartItem[]): ApiCheckoutItemInput[] {
  return items.map((item) => {
    // Attempt parsing productId to number if it is a numeric string
    const numericId = Number(item.productId);
    const productId =
      Number.isFinite(numericId) && !isNaN(numericId)
        ? numericId
        : item.productId;

    const selectedColor =
      item.product.colors.find((c) => c.id === item.selectedColorId) ??
      item.product.colors[0];

    const colorName =
      selectedColor?.name ||
      selectedColor?.nameKey ||
      (selectedColor?.swatch ? String(selectedColor.swatch) : undefined);

    const options: { color?: string; size?: string } = {};
    if (colorName) options.color = colorName;
    if (item.selectedSize) options.size = String(item.selectedSize);

    return {
      product_id: productId,
      quantity: item.quantity,
      options: Object.keys(options).length > 0 ? options : null,
    };
  });
}

/**
 * Maps the API place-order response into the storefront `OrderSummary`.
 * Delegates to the shared orders mapper.
 */
export function mapApiOrderToSummary(
  data: ApiPlaceOrderData,
  paymentMethod: CheckoutPaymentMethod = "card",
) {
  return mapOrderDetail(data as ApiOrderDetail, paymentMethod);
}
