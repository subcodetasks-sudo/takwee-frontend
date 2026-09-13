import type { CartItem } from "@/features/cart/types";
import type {
  OrderItemSummary,
  OrderStatus,
  OrderSummary,
  OrderTrackingInfo,
  OrderTrackingStep,
  TrackingStepKey,
} from "@/features/orders/types";
import { resolveImageUrl } from "@/lib/images";
import type {
  ApiCheckoutItemInput,
  ApiPlaceOrderData,
  ApiShipmentInfo,
  ApiTrackingInfo,
} from "../types/api";
import type { CheckoutPaymentMethod } from "../types";

/**
 * Transforms client CartItem array into the payload expected by the API
 * POST /v1/checkout/preview and POST /v1/checkout
 */
export function mapCartItemsToApi(items: CartItem[]): ApiCheckoutItemInput[] {
  return items.map((item) => {
    // Attempt parsing productId to number if it is a numeric string
    const numericId = Number(item.productId);
    const productId = Number.isFinite(numericId) && !isNaN(numericId) ? numericId : item.productId;

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

function mapStatusToStorefront(status?: string): OrderStatus {
  const s = (status || "").toLowerCase();
  if (s === "shipped" || s === "in_transit") return "shipped";
  if (s === "delivered" || s === "completed") return "delivered";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return "processing";
}

function mapTracking(
  shipment?: ApiShipmentInfo | null,
  tracking?: ApiTrackingInfo | null,
  orderDate?: string,
): OrderTrackingInfo | undefined {
  const carrier = shipment?.carrier || "Express Delivery";
  const trackingNumber = shipment?.tracking_number || "";
  const trackingUrl = shipment?.tracking_url || undefined;
  const estimatedDelivery = shipment?.estimated_delivery_date || undefined;

  const defaultSteps: OrderTrackingStep[] = [
    { key: "placed", date: orderDate, completed: true, current: true },
    { key: "tailoring", completed: false, current: false },
    { key: "shipped", completed: false, current: false },
    { key: "delivered", completed: false, current: false },
  ];

  if (!tracking?.steps || tracking.steps.length === 0) {
    return {
      carrier,
      trackingNumber,
      estimatedDelivery,
      currentStep: 1,
      trackingUrl,
      steps: defaultSteps,
    };
  }

  const stepKeyMap: Record<string, TrackingStepKey> = {
    confirmed: "placed",
    placed: "placed",
    processing: "tailoring",
    tailoring: "tailoring",
    in_transit: "shipped",
    shipped: "shipped",
    delivered: "delivered",
  };

  const steps: OrderTrackingStep[] = tracking.steps.map((st) => ({
    key: stepKeyMap[st.status] || "placed",
    date: st.date || undefined,
    completed: Boolean(st.completed),
    current: Boolean(st.current),
  }));

  let currentStepIdx: 1 | 2 | 3 | 4 = 1;
  const foundIdx = steps.findIndex((s) => s.current);
  if (foundIdx >= 0) {
    currentStepIdx = Math.min(4, Math.max(1, foundIdx + 1)) as 1 | 2 | 3 | 4;
  } else if (steps.every((s) => s.completed)) {
    currentStepIdx = 4;
  }

  return {
    carrier,
    trackingNumber,
    estimatedDelivery,
    currentStep: currentStepIdx,
    steps,
    trackingUrl,
  };
}

/**
 * Maps the API place-order response into the storefront `OrderSummary`
 */
export function mapApiOrderToSummary(
  data: ApiPlaceOrderData,
  paymentMethod: CheckoutPaymentMethod = "card",
): OrderSummary {
  const items: OrderItemSummary[] = (data.items || []).map((it) => {
    const rawImage = it.image;
    const resolvedImg = rawImage ? resolveImageUrl(rawImage) : undefined;

    return {
      name: it.name,
      quantity: it.quantity,
      image: resolvedImg || undefined,
      size: it.options?.size ? String(it.options.size) : undefined,
      color: it.options?.color ? String(it.options.color) : undefined,
      priceTRY: it.unit_price ?? it.total_price,
      slug: undefined,
    };
  });

  const rawAddr = data.shipping_address;
  const shippingAddress = rawAddr
    ? {
        fullName: rawAddr.recipient_name,
        line1: [rawAddr.street || rawAddr.address, rawAddr.apartment]
          .filter(Boolean)
          .join(", ") || (rawAddr.address || ""),
        line2: [rawAddr.area, rawAddr.district].filter(Boolean).join(", ") || undefined,
        city: rawAddr.city || "",
        region: rawAddr.region || undefined,
        postalCode: rawAddr.postal_code || undefined,
        country: rawAddr.country || "",
        phone: rawAddr.full_phone || (rawAddr.phone_code && rawAddr.phone ? `${rawAddr.phone_code} ${rawAddr.phone}` : rawAddr.phone) || undefined,
      }
    : undefined;

  const payment =
    paymentMethod === "card"
      ? { method: "card" as const, brand: "Card", last4: "····" }
      : { method: paymentMethod };

  return {
    id: String(data.id),
    number: data.order_number,
    placedAt: data.date,
    status: mapStatusToStorefront(data.status),
    totalTRY: data.pricing?.total ?? 0,
    shippingTRY: data.pricing?.shipping_cost ?? 0,
    discountTRY: data.pricing?.discount ?? 0,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    items,
    shippingAddress,
    payment,
    tracking: mapTracking(data.shipment, data.tracking, data.date),
  };
}
