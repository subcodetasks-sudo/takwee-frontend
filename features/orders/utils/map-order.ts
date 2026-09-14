import { resolveImageUrl } from "@/lib/images";
import type {
  OrderItemSummary,
  OrderPaymentInfo,
  OrderPaymentMethod,
  OrderShippingAddress,
  OrderStatus,
  OrderSummary,
  OrderTrackingInfo,
  OrderTrackingStep,
  TrackingStepKey,
} from "../types";
import type {
  ApiOrderDetail,
  ApiOrderListItem,
  ApiOrderShippingAddress,
  ApiOrderTrackingData,
  ApiShipmentInfo,
  ApiTrackingInfo,
  ApiTrackingStep,
} from "../types/api";

export function mapOrderStatus(status?: string): OrderStatus {
  const s = (status || "").toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (s === "pending" || s === "placed" || s === "unpaid" || s === "awaiting_payment") return "pending";
  if (s === "processing" || s === "tailoring" || s === "confirmed" || s === "in_production") return "processing";
  if (s === "shipped" || s === "dispatched") return "shipped";
  if (s === "in_transit" || s === "intransit" || s === "transit") return "in_transit";
  if (s === "out_for_delivery" || s === "outfordelivery" || s === "out_delivery") return "out_for_delivery";
  if (s === "delivered" || s === "completed" || s === "received") return "delivered";
  if (s === "failed" || s === "delivery_failed" || s === "failed_delivery") return "failed";
  if (s === "returned" || s === "refunded" || s === "return_completed") return "returned";
  if (s === "cancelled" || s === "canceled" || s === "void") return "cancelled";
  return "pending";
}

const STEP_KEY_MAP: Record<string, TrackingStepKey> = {
  placed: "placed",
  pending: "placed",
  confirmed: "placed",
  processing: "processing",
  tailoring: "processing",
  shipped: "shipped",
  dispatched: "shipped",
  in_transit: "in_transit",
  intransit: "in_transit",
  "in transit": "in_transit",
  out_for_delivery: "out_for_delivery",
  outfordelivery: "out_for_delivery",
  "out for delivery": "out_for_delivery",
  delivered: "delivered",
  completed: "delivered",
};

function mapTrackingSteps(
  steps: ApiTrackingStep[],
  orderDate?: string,
): OrderTrackingStep[] {
  if (!steps.length) {
    return [
      { key: "placed", date: orderDate, completed: true, current: true },
      { key: "processing", completed: false, current: false },
      { key: "shipped", completed: false, current: false },
      { key: "in_transit", completed: false, current: false },
      { key: "out_for_delivery", completed: false, current: false },
      { key: "delivered", completed: false, current: false },
    ];
  }

  return steps.map((st) => ({
    key: STEP_KEY_MAP[st.status] || "placed",
    date: st.date || undefined,
    completed: Boolean(st.completed),
    current: Boolean(st.current),
  }));
}

function currentStepFromSteps(steps: OrderTrackingStep[]): number {
  const foundIdx = steps.findIndex((s) => s.current);
  if (foundIdx >= 0) {
    return foundIdx + 1;
  }
  if (steps.length > 0 && steps.every((s) => s.completed)) return steps.length;
  return 1;
}

export function mapTracking(
  shipment?: ApiShipmentInfo | null,
  tracking?: ApiTrackingInfo | null,
  orderDate?: string,
): OrderTrackingInfo | undefined {
  const hasShipment = Boolean(
    shipment &&
      (shipment.carrier ||
        shipment.tracking_number ||
        shipment.tracking_url ||
        shipment.estimated_delivery_date),
  );
  const hasTrackingSteps = Boolean(tracking?.steps?.length);

  if (!hasShipment && !hasTrackingSteps) {
    return undefined;
  }

  const steps = mapTrackingSteps(tracking?.steps ?? [], orderDate);

  return {
    carrier: shipment?.carrier?.trim() || "",
    trackingNumber: shipment?.tracking_number?.trim() || "",
    estimatedDelivery: shipment?.estimated_delivery_date || undefined,
    currentStep: currentStepFromSteps(steps),
    steps,
    trackingUrl: shipment?.tracking_url || undefined,
  };
}

/** Maps dedicated tracking endpoint payload onto `OrderTrackingInfo`. */
export function mapOrderTrackingData(
  data: ApiOrderTrackingData,
): OrderTrackingInfo {
  const steps = mapTrackingSteps(data.steps ?? []);

  return {
    carrier: data.carrier?.trim() || "",
    trackingNumber: data.tracking_number?.trim() || "",
    estimatedDelivery: data.estimated_delivery_date || undefined,
    currentStep: currentStepFromSteps(steps),
    steps,
    trackingUrl: data.tracking_url || undefined,
  };
}

function mapShippingAddress(
  raw?: ApiOrderShippingAddress | null,
): OrderShippingAddress | undefined {
  if (!raw) return undefined;

  const line1 =
    [raw.street || raw.address, raw.apartment].filter(Boolean).join(", ") ||
    raw.address ||
    "";

  return {
    fullName: raw.recipient_name,
    line1,
    line2:
      [raw.area, raw.district].filter(Boolean).join(", ") || undefined,
    city: raw.city || "",
    region: raw.region || undefined,
    postalCode: raw.postal_code || undefined,
    country: raw.country || "",
    phone:
      raw.full_phone ||
      (raw.phone_code && raw.phone
        ? `${raw.phone_code} ${raw.phone}`
        : raw.phone) ||
      undefined,
  };
}

function mapPaymentFromStatus(
  paymentStatus?: string,
): OrderPaymentInfo | undefined {
  if (!paymentStatus) return undefined;
  const s = paymentStatus.toLowerCase();
  // API list/detail do not always expose method; infer COD only when explicit.
  if (s.includes("cod") || s.includes("cash")) {
    return { method: "cashOnDelivery" };
  }
  if (s.includes("transfer") || s.includes("bank")) {
    return { method: "bankTransfer" };
  }
  if (s === "pending" || s === "paid" || s === "refunded") {
    return { method: "card" };
  }
  return undefined;
}

function mapDetailItems(data: ApiOrderDetail): OrderItemSummary[] {
  return (data.items || []).map((it) => {
    const rawImage = it.image;
    const resolvedImg = rawImage ? resolveImageUrl(rawImage) : null;
    const quantity = Math.max(1, it.quantity || 1);
    const unitPrice =
      typeof it.unit_price === "number"
        ? it.unit_price
        : typeof it.total_price === "number"
          ? it.total_price / quantity
          : undefined;

    return {
      name: it.name,
      quantity: it.quantity,
      image: resolvedImg || undefined,
      size: it.options?.size ? String(it.options.size) : undefined,
      color: it.options?.color ? String(it.options.color) : undefined,
      priceTRY: unitPrice,
      slug: undefined,
    };
  });
}

/**
 * Maps list-row payload (GET /api/v1/my/orders) into storefront `OrderSummary`.
 * Item lines are sparse — only a main thumbnail may be present.
 */
export function mapOrderListItem(item: ApiOrderListItem): OrderSummary {
  const status = mapOrderStatus(item.status);
  const rawImage = item.main_product_image;
  const image = rawImage ? resolveImageUrl(rawImage) || undefined : undefined;

  const items: OrderItemSummary[] =
    item.items_count > 0
      ? [
          {
            name: "",
            quantity: item.items_count,
            image,
          },
        ]
      : [];

  const hasTracking = Boolean(
    item.carrier || item.tracking_number || item.estimated_delivery_date,
  );

  const getStepNumber = (st: OrderStatus): number => {
    switch (st) {
      case "pending":
        return 1;
      case "processing":
        return 2;
      case "shipped":
        return 3;
      case "in_transit":
        return 4;
      case "out_for_delivery":
        return 5;
      case "delivered":
        return 6;
      default:
        return 1;
    }
  };

  const stepNumber = getStepNumber(status);

  const tracking: OrderTrackingInfo | undefined = hasTracking
    ? {
        carrier: item.carrier?.trim() || "",
        trackingNumber: item.tracking_number?.trim() || "",
        estimatedDelivery: item.estimated_delivery_date || undefined,
        currentStep: stepNumber,
        steps: mapTrackingSteps([], item.date).map((step, idx) => {
          return {
            ...step,
            completed: idx + 1 < stepNumber,
            current: idx + 1 === stepNumber,
            date: idx === 0 ? item.date : step.date,
          };
        }),
      }
    : undefined;

  return {
    id: String(item.id),
    number: item.order_number,
    placedAt: item.date,
    status,
    totalTRY: item.total ?? 0,
    itemCount: item.items_count ?? 0,
    items,
    tracking,
    payment: mapPaymentFromStatus(item.payment_status),
    canCancel: Boolean(item.can_cancel),
    paymentStatus: item.payment_status,
    shippingStatus: item.shipping_status,
  };
}

export function mapOrders(items: ApiOrderListItem[]): OrderSummary[] {
  return items.map(mapOrderListItem);
}

/**
 * Maps full order payload (show / cancel / place-order) into `OrderSummary`.
 */
export function mapOrderDetail(
  data: ApiOrderDetail,
  paymentMethod?: OrderPaymentMethod,
): OrderSummary {
  const items = mapDetailItems(data);
  const pricing = data.pricing;
  const couponCode =
    data.coupon?.code?.trim() || pricing?.coupon?.trim() || undefined;
  const status = mapOrderStatus(data.status);
  const shipment = data.shipment;

  const payment: OrderPaymentInfo | undefined = paymentMethod
    ? { method: paymentMethod }
    : mapPaymentFromStatus(data.payment_status);

  return {
    id: String(data.id),
    number: data.order_number,
    placedAt: data.date,
    status,
    subtotalTRY: pricing?.subtotal ?? undefined,
    totalTRY: pricing?.total ?? 0,
    shippingTRY: pricing?.shipping_cost ?? 0,
    discountTRY: pricing?.discount ?? 0,
    taxTRY: pricing?.tax ?? 0,
    couponCode,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    items,
    shippingAddress: mapShippingAddress(data.shipping_address),
    payment,
    tracking: mapTracking(shipment, data.tracking, data.date),
    deliveredAt: shipment?.delivered_at || undefined,
    cancelledAt: status === "cancelled" ? data.date : undefined,
    canCancel: Boolean(data.can_cancel),
    paymentStatus: data.payment_status,
    shippingStatus: data.shipping_status,
  };
}

/** @deprecated Prefer `mapOrderDetail` — kept as alias for checkout place-order. */
export function mapApiOrderToSummary(
  data: ApiOrderDetail,
  paymentMethod: OrderPaymentMethod = "card",
): OrderSummary {
  return mapOrderDetail(data, paymentMethod);
}
