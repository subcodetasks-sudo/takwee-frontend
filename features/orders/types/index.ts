export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItemSummary {
  /** API product id — used for PDP links and post-purchase ratings. */
  productId?: string;
  name: string;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  priceTRY?: number;
  slug?: string;
}

/** Linear tracker steps (cancelled is an exception state, not a step). */
export type TrackingStepKey =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered";

export interface OrderTrackingStep {
  key: TrackingStepKey;
  date?: string;
  completed: boolean;
  current: boolean;
}

export interface OrderTrackingInfo {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery?: string;
  currentStep: number;
  steps: OrderTrackingStep[];
  trackingUrl?: string;
}

export interface OrderShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
  phone?: string;
}

/** Storefront payment method ids (camelCase). API uses snake_case, e.g. `bank_transfer`. */
export type OrderPaymentMethod = "bankTransfer" | "card" | "cashOnDelivery";

export type OrderPaymentStatus =
  | "pending"
  | "under_review"
  | "paid"
  | "failed"
  | "refunded"
  | (string & {});

export interface OrderPaymentInfo {
  method: OrderPaymentMethod;
  status?: OrderPaymentStatus;
  /** Last 4 digits when method is card (legacy) */
  last4?: string;
  brand?: string;
  transferHolderName?: string;
  transferDate?: string;
  receiptUrl?: string | null;
  submittedAt?: string | null;
  paidAt?: string | null;
  canSubmitProof?: boolean;
}

export interface OrderSummary {
  id: string;
  /** Human-facing order number, e.g. LL-2048 */
  number: string;
  placedAt: string;
  status: OrderStatus;
  totalTRY: number;
  itemCount: number;
  items: OrderItemSummary[];
  tracking?: OrderTrackingInfo;
  shippingAddress?: OrderShippingAddress;
  payment?: OrderPaymentInfo;
  /** Merchandise subtotal in TRY (before shipping/tax/discount) */
  subtotalTRY?: number;
  /** Shipping fee in TRY (0 = complimentary) */
  shippingTRY?: number;
  discountTRY?: number;
  taxTRY?: number;
  couponCode?: string;
  deliveredAt?: string;
  /** From API `cancelled_at` when status is cancelled */
  cancelledAt?: string;
  /** From API `cancellation_reason` — already localized by Accept-Language */
  cancellationReason?: string;
  /** From API `can_cancel` — pending/confirmed and not yet shipped */
  canCancel?: boolean;
  paymentStatus?: string;
  shippingStatus?: string;
}

export type { ApiOrderDetail, ApiOrderListItem, ApiOrderTrackingData } from "./api";
