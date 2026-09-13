"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  createAddress,
  deleteAddress,
  fetchAddresses,
  setDefaultAddress,
  updateAddress,
} from "../api/get-addresses";
import type { Address, AddressFormData } from "../types";

export const ADDRESSES_QUERY_KEY = ["user-addresses"] as const;

export const addressesQueryKey = (locale: string) =>
  [...ADDRESSES_QUERY_KEY, locale] as const;

export function useAddresses() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const token = session?.token;
  const queryKey = addressesQueryKey(locale);

  const query = useQuery<Address[]>({
    queryKey,
    queryFn: () => fetchAddresses(token!, locale),
    enabled: isAuthenticated && Boolean(token),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  const invalidateAddresses = () =>
    queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });

  const addMutation = useMutation({
    mutationFn: (formData: AddressFormData) =>
      createAddress(token!, formData, locale),
    onSuccess: () => {
      void invalidateAddresses();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: AddressFormData;
    }) => updateAddress(token!, id, formData, locale),
    onSuccess: () => {
      void invalidateAddresses();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteAddress(token!, id, locale);
      return id;
    },
    onSuccess: () => {
      void invalidateAddresses();
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => setDefaultAddress(token!, id, locale),
    onSuccess: () => {
      void invalidateAddresses();
    },
  });

  return {
    addresses: query.data ?? [],
    isLoading: isAuthLoading || (isAuthenticated && query.isLoading),
    isError: query.isError,
    refetch: query.refetch,
    addAddress: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateAddress: (id: string, formData: AddressFormData) =>
      updateMutation.mutateAsync({ id, formData }),
    isUpdating: updateMutation.isPending,
    deleteAddress: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    setDefaultAddress: setDefaultMutation.mutateAsync,
    isSettingDefault: setDefaultMutation.isPending,
  };
}
