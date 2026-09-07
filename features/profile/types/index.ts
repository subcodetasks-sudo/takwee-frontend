export type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled";

export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  /** Display initial for avatar fallback. */
  initials: string;
  /** ISO date string used for “member since”. */
  memberSince: string;
}

export interface OrderItemSummary {
  name: string;
  quantity: number;
}

export interface OrderSummary {
  id: string;
  /** Human-facing order number, e.g. LL-1042 */
  number: string;
  placedAt: string;
  status: OrderStatus;
  totalTRY: number;
  itemCount: number;
  items: OrderItemSummary[];
}
