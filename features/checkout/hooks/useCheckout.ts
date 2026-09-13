import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useAuth } from "@/features/auth";
import { useCart } from "@/features/cart";
import { useCurrency } from "@/hooks/useCurrency";
import { previewCheckoutAction, placeOrderAction } from "../api/actions";
import type { PlaceOrderInput } from "../types";

export interface UseCheckoutOptions {
  addressId?: string;
  couponCode?: string;
}

export function useCheckout(options?: UseCheckoutOptions) {
  const { addressId, couponCode } = options || {};
  const { isAuthenticated } = useAuth();
  const locale = useLocale();
  const { currency } = useCurrency();
  const { items, clear } = useCart();
  const queryClient = useQueryClient();

  const previewQuery = useQuery({
    queryKey: ["checkout-preview", locale, currency, addressId, couponCode, items],
    queryFn: async () => {
      if (!isAuthenticated || items.length === 0) return null;
      const res = await previewCheckoutAction({
        items,
        addressId,
        couponCode,
        locale,
        currency,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to calculate checkout preview");
      }

      return res.data;
    },
    enabled: Boolean(isAuthenticated && items.length > 0),
    staleTime: 30 * 1000,
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (input: PlaceOrderInput) => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to place order");
      }

      const res = await placeOrderAction({
        ...input,
        locale,
        currency,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to place order");
      }

      return res.data;
    },
    onSuccess: () => {
      clear();
      void queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      void queryClient.invalidateQueries({ queryKey: ["checkout-preview"] });
    },
  });

  return {
    preview: previewQuery.data ?? null,
    isPreviewLoading: previewQuery.isLoading,
    previewError: previewQuery.error,
    refetchPreview: previewQuery.refetch,
    placeOrder: placeOrderMutation.mutateAsync,
    isPlacingOrder: placeOrderMutation.isPending,
    placeOrderError: placeOrderMutation.error,
  };
}
