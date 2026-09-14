"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  cancelOrder,
  fetchOrderById,
  fetchOrders,
  fetchOrderTracking,
  type OrderApiStatusFilter,
} from "../api/get-orders";
import type { OrderSummary } from "../types";

export const ORDERS_QUERY_KEY = ["user-orders"] as const;

export const ordersQueryKey = (
  locale: string,
  status: OrderApiStatusFilter = "all",
) => [...ORDERS_QUERY_KEY, locale, status] as const;

export const orderQueryKey = (locale: string, orderId: string) =>
  [...ORDERS_QUERY_KEY, locale, "detail", orderId] as const;

export const orderTrackingQueryKey = (locale: string, orderId: string) =>
  [...ORDERS_QUERY_KEY, locale, "tracking", orderId] as const;

export function useOrders(status: OrderApiStatusFilter = "all") {
  const locale = useLocale();
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const token = session?.token;
  const queryKey = ordersQueryKey(locale, status);

  const query = useQuery<OrderSummary[]>({
    queryKey,
    queryFn: () => fetchOrders(token!, locale, status),
    enabled: isAuthenticated && Boolean(token),
    staleTime: 0,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    orders: query.data ?? [],
    isLoading: isAuthLoading || (isAuthenticated && query.isLoading),
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isAuthenticated,
  };
}

export function useOrder(orderId: string) {
  const locale = useLocale();
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const token = session?.token;
  const queryKey = orderQueryKey(locale, orderId);

  const query = useQuery<OrderSummary>({
    queryKey,
    queryFn: () => fetchOrderById(token!, orderId, locale),
    enabled: isAuthenticated && Boolean(token) && Boolean(orderId),
    staleTime: 0,
    // Live tracker while this page is open (FCM still accelerates when present).
    refetchInterval: 3000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  return {
    order: query.data,
    isLoading: isAuthLoading || (isAuthenticated && query.isLoading),
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isAuthenticated,
  };
}

export function useOrderTracking(orderId: string, enabled = true) {
  const locale = useLocale();
  const { session, isAuthenticated } = useAuth();
  const token = session?.token;

  const query = useQuery({
    queryKey: orderTrackingQueryKey(locale, orderId),
    queryFn: () => fetchOrderTracking(token!, orderId, locale),
    enabled:
      enabled && isAuthenticated && Boolean(token) && Boolean(orderId),
    staleTime: 1000 * 60,
  });

  return {
    tracking: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useCancelOrder() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const token = session?.token;

  const mutation = useMutation({
    mutationFn: (orderId: string) => cancelOrder(token!, orderId, locale),
    onSuccess: (order) => {
      void queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.setQueryData(orderQueryKey(locale, order.id), order);
    },
  });

  return {
    cancelOrder: mutation.mutateAsync,
    isCancelling: mutation.isPending,
    error: mutation.error,
  };
}
