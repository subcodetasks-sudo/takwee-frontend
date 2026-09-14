/**
 * Raw backend DTOs for customer orders (GET/POST /api/v1/my/orders…).
 */

export interface ApiOrderListItem {
  id: number;
  order_number: string;
  date: string;
  status: string;
  payment_status?: string;
  shipping_status?: string;
  total: number;
  currency?: string;
  items_count: number;
  main_product_image?: string | null;
  tracking_number?: string | null;
  carrier?: string | null;
  estimated_delivery_date?: string | null;
  can_cancel?: boolean;
}

export interface ApiOrderItem {
  id?: number;
  product_id: number;
  name: string;
  sku?: string;
  image?: string | null;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax?: number;
  total_price: number;
  options?: {
    size?: string;
    color?: string;
    [key: string]: unknown;
  } | null;
}

export interface ApiOrderPricing {
  subtotal: number;
  discount: number;
  coupon?: string | null;
  shipping_cost: number;
  tax: number;
  total: number;
  currency: string;
  currency_symbol?: string;
}

export interface ApiOrderShippingAddress {
  recipient_name: string;
  phone_code?: string;
  phone?: string;
  full_phone?: string;
  country?: string;
  city?: string;
  area?: string;
  region?: string;
  district?: string;
  address?: string;
  street?: string;
  apartment?: string;
  postal_code?: string;
  delivery_instructions?: string | null;
}

export interface ApiOrderCoupon {
  id: number;
  code: string;
  name: string;
  type: "percentage" | "fixed" | string;
  value: string | number;
}

export interface ApiShipmentInfo {
  carrier?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  status?: string;
  estimated_delivery_date?: string | null;
  shipped_at?: string | null;
  delivered_at?: string | null;
}

export interface ApiTrackingStep {
  status: string;
  label: string;
  completed: boolean;
  current: boolean;
  date?: string | null;
}

export interface ApiTrackingInfo {
  current_status: string;
  steps: ApiTrackingStep[];
}

/** Full order payload from show / cancel / place-order. */
export interface ApiOrderDetail {
  id: number;
  order_number: string;
  date: string;
  status: string;
  payment_status: string;
  shipping_status: string;
  can_cancel: boolean;
  items: ApiOrderItem[];
  pricing: ApiOrderPricing;
  shipping_address?: ApiOrderShippingAddress | null;
  shipment?: ApiShipmentInfo | null;
  tracking?: ApiTrackingInfo | null;
  coupon?: ApiOrderCoupon | null;
}

export interface ApiTrackingEvent {
  id: number;
  status: string;
  title: string;
  description?: string | null;
  location?: string | null;
  event_date?: string | null;
  date?: string | null;
}

/** GET /api/v1/my/orders/{id}/tracking */
export interface ApiOrderTrackingData {
  order_number: string;
  carrier?: string | null;
  tracking_number?: string | null;
  tracking_url?: string | null;
  estimated_delivery_date?: string | null;
  current_status: string;
  events?: ApiTrackingEvent[];
  steps: ApiTrackingStep[];
}

export interface ApiPaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiPaginatedOrders {
  data: ApiOrderListItem[];
  meta?: ApiPaginationMeta;
  links?: {
    next?: string | null;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}
