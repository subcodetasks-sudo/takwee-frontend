import type {
  OrderPaymentMethod,
  OrderShippingAddress,
  OrderSummary,
} from "@/features/orders/types";
import type { CartItem } from "@/features/cart/types";

export type CheckoutPaymentMethod = OrderPaymentMethod;

export interface CheckoutLineLabel {
  id: string;
  name: string;
  color?: string;
}

export interface PlaceOrderInput {
  items: CartItem[];
  labels: CheckoutLineLabel[];
  shippingAddress: OrderShippingAddress;
  paymentMethod: CheckoutPaymentMethod;
  subtotalTRY: number;
  taxTRY: number;
}

export interface PlaceOrderResult {
  order: OrderSummary;
}
