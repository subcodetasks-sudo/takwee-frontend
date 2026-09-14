import type {
  OrderPaymentMethod,
  OrderShippingAddress,
  OrderSummary,
} from "@/features/orders/types";
import type { CartItem } from "@/features/cart/types";
import type {
  ApiCheckoutCoupon,
  ApiCheckoutItemData,
  ApiCheckoutPricing,
  ApiCheckoutShippingAddress,
} from "./api";

export type CheckoutPaymentMethod = OrderPaymentMethod;

export interface CheckoutLineLabel {
  id: string;
  name: string;
  color?: string;
}

export interface CheckoutPreviewResult {
  items: ApiCheckoutItemData[];
  pricing: ApiCheckoutPricing;
  shippingAddress?: ApiCheckoutShippingAddress | null;
  coupon?: ApiCheckoutCoupon | null;
}

export interface PlaceOrderInput {
  items: CartItem[];
  labels?: CheckoutLineLabel[];
  addressId: string;
  paymentMethod: CheckoutPaymentMethod;
  couponCode?: string;
  shippingAddress?: OrderShippingAddress;
  subtotalTRY?: number;
  taxTRY?: number;
}

export interface PlaceOrderResult {
  order: OrderSummary;
}

export interface SubmitBankTransferProofInput {
  orderId: string;
  transferHolderName: string;
  transferDate: string;
  receipt: File;
}

export interface SubmitBankTransferProofResult {
  order: OrderSummary;
}

export interface ApplyCouponResult {
  code: string;
  discount: number;
  coupon?: ApiCheckoutCoupon | null;
}

export * from "./api";
