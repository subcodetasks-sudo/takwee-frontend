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
  ApiOrderPayment,
  ApiOrderShippingAddress,
  ApiOrderTrackingData,
  ApiShipmentInfo,
  ApiTrackingInfo,
  ApiTrackingStep,
} from "../types/api";
import { mapApiPaymentMethod } from "./map-payment-method";

export function mapOrderStatus(status?: string): OrderStatus {
  const s = (status || "").toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (s === "pending" || s === "placed" || s === "unpaid" || s === "awaiting_payment") return "pending";
  if (s === "confirmed") return "confirmed";
  if (s === "processing" || s === "tailoring" || s === "in_production") return "processing";
  if (
    s === "shipped" ||
    s === "dispatched" ||
    s === "in_transit" ||
    s === "intransit" ||
    s === "transit" ||
    s === "out_for_delivery" ||
    s === "outfordelivery" ||
    s === "out_delivery"
  ) {
    return "shipped";
  }
  if (s === "delivered" || s === "completed" || s === "received") return "delivered";
  if (
    s === "cancelled" ||
    s === "canceled" ||
    s === "void" ||
    s === "failed" ||
    s === "delivery_failed" ||
    s === "failed_delivery" ||
    s === "returned" ||
    s === "refunded" ||
    s === "return_completed"
  ) {
    return "cancelled";
  }
  return "pending";
}

const STEP_KEY_MAP: Record<string, TrackingStepKey> = {
  pending: "pending",
  placed: "pending",
  confirmed: "confirmed",
  processing: "processing",
  tailoring: "processing",
  shipped: "shipped",
  dispatched: "shipped",
  in_transit: "shipped",
  intransit: "shipped",
  "in transit": "shipped",
  out_for_delivery: "shipped",
  outfordelivery: "shipped",
  "out for delivery": "shipped",
  delivered: "delivered",
  completed: "delivered",
};

function mapTrackingSteps(
  steps: ApiTrackingStep[],
  orderDate?: string,
): OrderTrackingStep[] {
  if (!steps.length) {
    return [
      { key: "pending", date: orderDate, completed: true, current: true },
      { key: "confirmed", completed: false, current: false },
      { key: "processing", completed: false, current: false },
      { key: "shipped", completed: false, current: false },
      { key: "delivered", completed: false, current: false },
    ];
  }

  return steps.map((st) => ({
    key: STEP_KEY_MAP[st.status] || "pending",
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

function mapPaymentBlock(
  payment?: ApiOrderPayment | null,
  paymentMethodRaw?: string | null,
  paymentStatus?: string | null,
  fallbackMethod?: OrderPaymentMethod,
): OrderPaymentInfo | undefined {
  const method =
    mapApiPaymentMethod(payment?.method) ||
    mapApiPaymentMethod(paymentMethodRaw) ||
    fallbackMethod ||
    mapPaymentMethodFromStatus(paymentStatus);

  if (!method) return undefined;

  const receiptRaw = payment?.receipt_url;
  const receiptUrl = receiptRaw ? resolveImageUrl(receiptRaw) || receiptRaw : null;

  return {
    method,
    status: payment?.status || paymentStatus || undefined,
    transferHolderName: payment?.transfer_holder_name || undefined,
    transferDate: payment?.transfer_date || undefined,
    receiptUrl,
    submittedAt: payment?.submitted_at || undefined,
    paidAt: payment?.paid_at || undefined,
    canSubmitProof: payment?.can_submit_proof,
  };
}

/** Legacy list rows may only expose payment_status — default boutique method is bank transfer. */
function mapPaymentMethodFromStatus(
  paymentStatus?: string | null,
): OrderPaymentMethod | undefined {
  if (!paymentStatus) return undefined;
  const s = paymentStatus.toLowerCase();
  if (s.includes("cod") || s.includes("cash")) return "cashOnDelivery";
  if (s.includes("transfer") || s.includes("bank")) return "bankTransfer";
  if (
    s === "pending" ||
    s === "under_review" ||
    s === "paid" ||
    s === "failed" ||
    s === "refunded"
  ) {
    return "bankTransfer";
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
      productId:
        it.product_id != null && Number.isFinite(it.product_id)
          ? String(it.product_id)
          : undefined,
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
      case "confirmed":
        return 2;
      case "processing":
        return 3;
      case "shipped":
        return 4;
      case "delivered":
        return 5;
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

  const cancelledAt =
    status === "cancelled"
      ? item.cancelled_at?.trim() || item.date
      : undefined;
  const cancellationReason =
    status === "cancelled"
      ? item.cancellation_reason?.trim() || undefined
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
    payment: mapPaymentBlock(null, null, item.payment_status),
    cancelledAt,
    cancellationReason,
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

  const payment = mapPaymentBlock(
    data.payment,
    data.payment_method,
    data.payment_status,
    paymentMethod,
  );

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
    cancelledAt:
      status === "cancelled"
        ? data.cancelled_at?.trim() || data.date
        : undefined,
    cancellationReason:
      status === "cancelled"
        ? data.cancellation_reason?.trim() || undefined
        : undefined,
    canCancel: Boolean(data.can_cancel),
    paymentStatus: data.payment_status,
    shippingStatus: data.shipping_status,
  };
}

/** @deprecated Prefer `mapOrderDetail` — kept as alias for checkout place-order. */
export function mapApiOrderToSummary(
  data: ApiOrderDetail,
  paymentMethod: OrderPaymentMethod = "bankTransfer",
): OrderSummary {
  return mapOrderDetail(data, paymentMethod);
}
