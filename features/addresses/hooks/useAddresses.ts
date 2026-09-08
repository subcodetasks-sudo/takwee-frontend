"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Address, AddressFormData } from "../types";
import { getInitialAddresses } from "../utils/mock-addresses";

const ADDRESSES_QUERY_KEY = ["user-addresses"];

export function useAddresses() {
  const queryClient = useQueryClient();

  const { data: addresses = [], isLoading } = useQuery<Address[]>({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: () => getInitialAddresses(),
    initialData: () => getInitialAddresses(),
    staleTime: Infinity,
  });

  const addMutation = useMutation({
    mutationFn: async (formData: AddressFormData) => {
      const newAddress: Address = {
        ...formData,
        id: `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
      };
      return newAddress;
    },
    onSuccess: (newAddress) => {
      queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old = []) => {
        // If this is the first address or marked as default, adjust others
        const shouldBeDefault = newAddress.isDefault || old.length === 0;
        const normalizedNew = { ...newAddress, isDefault: shouldBeDefault };

        if (shouldBeDefault) {
          return [
            normalizedNew,
            ...old.map((addr) => ({ ...addr, isDefault: false })),
          ];
        }
        return [...old, normalizedNew];
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: AddressFormData;
    }) => {
      return { id, formData };
    },
    onSuccess: ({ id, formData }) => {
      queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old = []) => {
        const isCurrentDefault = old.find((a) => a.id === id)?.isDefault;
        // If user explicitly set default, unmark others.
        // If user tried to uncheck default on the only default address, keep it default.
        const effectiveDefault = formData.isDefault || isCurrentDefault;

        return old.map((addr) => {
          if (addr.id === id) {
            return {
              ...addr,
              ...formData,
              isDefault: effectiveDefault ?? false,
            };
          }
          if (formData.isDefault) {
            return { ...addr, isDefault: false };
          }
          return addr;
        });
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: (idToDelete) => {
      queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old = []) => {
        const remaining = old.filter((addr) => addr.id !== idToDelete);
        const hadDefault = old.find((addr) => addr.id === idToDelete)?.isDefault;

        // If the deleted address was the default, appoint the first remaining address as default
        if (hadDefault && remaining.length > 0) {
          return remaining.map((addr, idx) =>
            idx === 0 ? { ...addr, isDefault: true } : addr
          );
        }
        return remaining;
      });
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: (defaultId) => {
      queryClient.setQueryData<Address[]>(ADDRESSES_QUERY_KEY, (old = []) =>
        old.map((addr) => ({
          ...addr,
          isDefault: addr.id === defaultId,
        }))
      );
    },
  });

  return {
    addresses,
    isLoading,
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

