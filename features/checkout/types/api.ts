export interface ApiCheckoutItemInput {
  product_id: number | string;
  quantity: number;
  options?: {
    color?: string;
    size?: string;
    [key: string]: unknown;
  } | null;
}

export interface ApiCheckoutPreviewInput {
  items: ApiCheckoutItemInput[];
  address_id?: number | string;
  coupon_code?: string;
}

export interface ApiPlaceOrderInput {
  items: ApiCheckoutItemInput[];
  address_id: number | string;
  coupon_code?: string;
}

export interface ApiCheckoutItemData {
  id?: number;
  product_id: number;
  name: string;
  sku?: string;
  image?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax: number;
  total_price: number;
  options?: {
    size?: string;
    color?: string;
    [key: string]: unknown;
  } | null;
}

export interface ApiCheckoutPricing {
  subtotal: number;
  discount: number;
  coupon?: string | null;
  shipping_cost: number;
  tax: number;
  total: number;
  currency: string;
  currency_symbol?: string;
}

export interface ApiCheckoutShippingAddress {
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

export interface ApiCheckoutCoupon {
  id: number;
  code: string;
  name: string;
  type: "percentage" | "fixed" | string;
  value: string | number;
}

export interface ApiCheckoutPreviewData {
  items: ApiCheckoutItemData[];
  pricing: ApiCheckoutPricing;
  shipping_address?: ApiCheckoutShippingAddress | null;
  coupon?: ApiCheckoutCoupon | null;
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

export interface ApiPlaceOrderData {
  id: number;
  order_number: string;
  date: string;
  status: string;
  payment_status: string;
  shipping_status: string;
  can_cancel: boolean;
  items: ApiCheckoutItemData[];
  pricing: ApiCheckoutPricing;
  shipping_address?: ApiCheckoutShippingAddress | null;
  shipment?: ApiShipmentInfo | null;
  tracking?: ApiTrackingInfo | null;
  coupon?: ApiCheckoutCoupon | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Record<string, string[]>;
}
