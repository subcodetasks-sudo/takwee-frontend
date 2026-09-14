import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { OrderSummary, OrderTrackingInfo } from "../types";
import type {
  ApiOrderDetail,
  ApiOrderListItem,
  ApiOrderTrackingData,
  ApiPaginatedOrders,
  ApiResponse,
} from "../types/api";
import {
  mapOrderDetail,
  mapOrderTrackingData,
  mapOrders,
} from "../utils/map-order";

const ORDERS_PATH = "/api/v1/my/orders";
const LIST_PER_PAGE = 100;

export type OrderApiStatusFilter =
  | "all"
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned"
  | "cancelled";

function requireApiAndToken(token: string) {
  if (!getApiBaseUrl()) {
    throw new Error("API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured");
  }
  if (!token) {
    throw new Error("Authentication required");
  }
}

function localeHeaders(locale?: string): Record<string, string> {
  return locale ? { "Accept-Language": locale } : {};
}

function unwrapOrdersPage(
  res: ApiResponse<ApiPaginatedOrders | ApiOrderListItem[]>,
): { items: ApiOrderListItem[]; lastPage: number } {
  if (Array.isArray(res.data)) {
    return { items: res.data, lastPage: 1 };
  }

  const page = res.data;
  const items = Array.isArray(page?.data) ? page.data : [];
  const lastPage = page?.meta?.last_page ?? 1;
  return { items, lastPage };
}

async function fetchOrdersPage(
  token: string,
  page: number,
  locale?: string,
  status: OrderApiStatusFilter = "all",
): Promise<ApiResponse<ApiPaginatedOrders | ApiOrderListItem[]>> {
  return http.get<ApiResponse<ApiPaginatedOrders | ApiOrderListItem[]>>(
    ORDERS_PATH,
    {
      token,
      params: {
        per_page: LIST_PER_PAGE,
        sort: "-id",
        page,
        status,
      },
      headers: localeHeaders(locale),
    },
  );
}

/**
 * Client-side orders list (GET /api/v1/my/orders).
 * Walks paginated results. Throws on failure — use as React Query queryFn.
 */
export async function fetchOrders(
  token: string,
  locale?: string,
  status: OrderApiStatusFilter = "all",
): Promise<OrderSummary[]> {
  requireApiAndToken(token);

  const first = await fetchOrdersPage(token, 1, locale, status);

  if (!first?.success || first.data == null) {
    throw new ApiError(
      500,
      "Invalid Payload",
      first,
      first?.message || "Failed to load orders",
    );
  }

  const { items, lastPage } = unwrapOrdersPage(first);
  const collected = [...items];

  for (let page = 2; page <= lastPage; page += 1) {
    const next = await fetchOrdersPage(token, page, locale, status);
    if (next?.success && next.data != null) {
      collected.push(...unwrapOrdersPage(next).items);
    }
  }

  return mapOrders(collected);
}

/**
 * Order detail (GET /api/v1/my/orders/{id}).
 */
export async function fetchOrderById(
  token: string,
  orderId: string,
  locale?: string,
): Promise<OrderSummary> {
  requireApiAndToken(token);

  const res = await http.get<ApiResponse<ApiOrderDetail>>(
    `${ORDERS_PATH}/${orderId}`,
    {
      token,
      headers: localeHeaders(locale),
    },
  );

  if (!res?.success || !res.data) {
    throw new ApiError(
      404,
      "Not Found",
      res,
      res?.message || "Order not found",
    );
  }

  return mapOrderDetail(res.data);
}

/**
 * Tracking-only payload (GET /api/v1/my/orders/{id}/tracking).
 */
export async function fetchOrderTracking(
  token: string,
  orderId: string,
  locale?: string,
): Promise<OrderTrackingInfo> {
  requireApiAndToken(token);

  const res = await http.get<ApiResponse<ApiOrderTrackingData>>(
    `${ORDERS_PATH}/${orderId}/tracking`,
    {
      token,
      headers: localeHeaders(locale),
    },
  );

  if (!res?.success || !res.data) {
    throw new ApiError(
      500,
      "Invalid Payload",
      res,
      res?.message || "Failed to load tracking",
    );
  }

  return mapOrderTrackingData(res.data);
}

/**
 * Cancel order (POST /api/v1/my/orders/{id}/cancel).
 * Allowed only for pending/confirmed orders that are not shipped.
 */
export async function cancelOrder(
  token: string,
  orderId: string,
  locale?: string,
): Promise<OrderSummary> {
  requireApiAndToken(token);

  const res = await http.post<ApiResponse<ApiOrderDetail>>(
    `${ORDERS_PATH}/${orderId}/cancel`,
    undefined,
    {
      token,
      headers: localeHeaders(locale),
    },
  );

  if (!res?.success || !res.data) {
    throw new ApiError(
      400,
      "Cancel Failed",
      res,
      res?.message || "This order cannot be cancelled.",
    );
  }

  return mapOrderDetail(res.data);
}
