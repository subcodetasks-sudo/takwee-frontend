import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useAuth } from "@/features/auth";
import { useCart } from "@/features/cart";
import { useCurrency } from "@/hooks/useCurrency";
import {
  applyCouponAction,
  previewCheckoutAction,
  placeOrderAction,
  removeCouponAction,
  submitBankTransferProofAction,
} from "../api/actions";
import type {
  PlaceOrderInput,
  SubmitBankTransferProofInput,
} from "../types";

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

  const applyCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to apply a coupon");
      }
      if (items.length === 0) {
        throw new Error("Cart items are required to apply a coupon");
      }

      const res = await applyCouponAction({
        code,
        items,
        locale,
        currency,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to apply coupon");
      }

      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["checkout-preview"] });
    },
  });

  const removeCouponMutation = useMutation({
    mutationFn: async (code: string) => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to remove a coupon");
      }
      if (items.length === 0) {
        throw new Error("Cart items are required to remove a coupon");
      }

      const res = await removeCouponAction({
        code,
        items,
        locale,
        currency,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to remove coupon");
      }

      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["checkout-preview"] });
    },
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
  });

  const submitBankTransferProofMutation = useMutation({
    mutationFn: async (input: SubmitBankTransferProofInput) => {
      if (!isAuthenticated) {
        throw new Error("Authentication required to submit payment proof");
      }

      const formData = new FormData();
      formData.append("order_id", input.orderId);
      formData.append("transfer_holder_name", input.transferHolderName.trim());
      formData.append("transfer_date", input.transferDate);
      formData.append("receipt", input.receipt);
      if (locale) formData.append("locale", locale);
      if (currency) formData.append("currency", currency);

      const res = await submitBankTransferProofAction(formData);

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to submit bank transfer proof");
      }

      return res.data;
    },
  });

  return {
    preview: previewQuery.data ?? null,
    isPreviewLoading: previewQuery.isLoading,
    previewError: previewQuery.error,
    refetchPreview: previewQuery.refetch,
    applyCoupon: applyCouponMutation.mutateAsync,
    isApplyingCoupon: applyCouponMutation.isPending,
    applyCouponError: applyCouponMutation.error,
    removeCoupon: removeCouponMutation.mutateAsync,
    isRemovingCoupon: removeCouponMutation.isPending,
    removeCouponError: removeCouponMutation.error,
    placeOrder: placeOrderMutation.mutateAsync,
    isPlacingOrder:
      placeOrderMutation.isPending || submitBankTransferProofMutation.isPending,
    placeOrderError: placeOrderMutation.error,
    submitBankTransferProof: submitBankTransferProofMutation.mutateAsync,
    isSubmittingProof: submitBankTransferProofMutation.isPending,
    clearCartAfterCheckout: () => {
      clear();
      void queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      void queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      void queryClient.invalidateQueries({ queryKey: ["checkout-preview"] });
    },
  };
}
