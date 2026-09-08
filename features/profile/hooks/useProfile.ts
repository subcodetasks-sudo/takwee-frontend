"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { PasswordFormData, ProfileDetailsFormData, ProfileUser } from "../types";
import { getInitialsFromName, getMockProfileUser } from "../utils/mock-profile";

export const PROFILE_QUERY_KEY = ["user-profile"] as const;

export function useProfile() {
  const queryClient = useQueryClient();

  const { data: user = getMockProfileUser(), isLoading } = useQuery<ProfileUser>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => getMockProfileUser(),
    initialData: () => getMockProfileUser(),
    staleTime: Infinity,
  });

  const updateDetailsMutation = useMutation({
    mutationFn: async (formData: ProfileDetailsFormData) => {
      // Simulate network latency until a real auth API exists.
      await new Promise((resolve) => setTimeout(resolve, 450));
      return formData;
    },
    onSuccess: (formData) => {
      queryClient.setQueryData<ProfileUser>(PROFILE_QUERY_KEY, (old) => {
        const base = old ?? getMockProfileUser();
        return {
          ...base,
          name: formData.name,
          email: formData.email,
          avatarUrl: formData.avatarUrl,
          initials: getInitialsFromName(formData.name) || base.initials,
        };
      });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (_formData: PasswordFormData) => {
      await new Promise((resolve) => setTimeout(resolve, 450));
      return true;
    },
  });

  return {
    user,
    isLoading,
    updateDetails: updateDetailsMutation.mutateAsync,
    isUpdatingDetails: updateDetailsMutation.isPending,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
}
