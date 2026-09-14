export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned"
  | "cancelled";

export interface OrderItemSummary {
  name: string;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
  priceTRY?: number;
  slug?: string;
}

export type TrackingStepKey =
  | "placed"
  | "processing"
  | "tailoring"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
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

export type OrderPaymentMethod = "card" | "cashOnDelivery" | "bankTransfer";

export interface OrderPaymentInfo {
  method: OrderPaymentMethod;
  /** Last 4 digits when method is card */
  last4?: string;
  brand?: string;
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
  cancelledAt?: string;
  cancelReasonKey?: string;
  /** From API `can_cancel` — pending/confirmed and not yet shipped */
  canCancel?: boolean;
  paymentStatus?: string;
  shippingStatus?: string;
}

export type { ApiOrderDetail, ApiOrderListItem, ApiOrderTrackingData } from "./api";


