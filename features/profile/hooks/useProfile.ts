"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useLocale } from "next-intl";
import { AUTH_SESSION_QUERY_KEY, useAuth } from "@/features/auth/hooks/useAuth";
import type { AuthSnapshot } from "@/features/auth/types";
import {
  deleteAvatarAction,
  updatePasswordAction,
  updateProfileAction,
  uploadAvatarAction,
} from "../api/actions";
import { fetchProfile } from "../api/get-profile";
import type { PasswordFormData, ProfileDetailsFormData, ProfileUser } from "../types";

export const PROFILE_QUERY_KEY = ["user-profile"] as const;

export const profileQueryKey = (locale: string) =>
  [...PROFILE_QUERY_KEY, locale] as const;

export function useProfile() {
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { session, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const token = session?.token;
  const queryKey = profileQueryKey(locale);

  const query = useQuery<ProfileUser>({
    queryKey,
    queryFn: () => fetchProfile(token!, locale),
    enabled: isAuthenticated && Boolean(token),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const syncAuthCache = useCallback(
    (user: ProfileUser) => {
      queryClient.setQueryData<ProfileUser>(queryKey, user);
      queryClient.setQueryData<AuthSnapshot | undefined>(
        AUTH_SESSION_QUERY_KEY,
        (prev) => {
          if (!prev || !prev.isAuthenticated) return prev;
          return {
            ...prev,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              mobile: user.mobile,
              avatarUrl: user.avatarUrl,
              active: user.active,
              roles: user.roles,
            },
          };
        },
      );
    },
    [queryClient, queryKey],
  );

  const updateDetailsMutation = useMutation({
    mutationFn: async (formData: ProfileDetailsFormData) => {
      const res = await updateProfileAction({
        name: formData.name,
        mobile: formData.mobile,
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to update profile details");
      }

      return res.data;
    },
    onSuccess: (updatedUser) => {
      syncAuthCache(updatedUser);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadAvatarAction(formData);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to upload avatar");
      }

      return res.data;
    },
    onSuccess: (updatedUser) => {
      syncAuthCache(updatedUser);
    },
  });

  const removeAvatarMutation = useMutation({
    mutationFn: async () => {
      const res = await deleteAvatarAction();
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to remove avatar");
      }

      return res.data;
    },
    onSuccess: (updatedUser) => {
      syncAuthCache(updatedUser);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (formData: PasswordFormData) => {
      const res = await updatePasswordAction({
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword,
      });

      if (!res.success) {
        const error = new Error(res.message || "Failed to update password");
        (error as any).fieldErrors = res.fieldErrors;
        throw error;
      }

      return true;
    },
  });

  return {
    user: query.data ?? null,
    isLoading: isAuthLoading || (isAuthenticated && query.isLoading),
    refetch: query.refetch,
    updateDetails: updateDetailsMutation.mutateAsync,
    isUpdatingDetails: updateDetailsMutation.isPending,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    removeAvatar: removeAvatarMutation.mutateAsync,
    isRemovingAvatar: removeAvatarMutation.isPending,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
  };
}
