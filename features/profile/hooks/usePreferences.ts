"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { getPreferencesAction, updatePreferencesAction } from "../api/actions";
import type { ProfilePreferencesData } from "../types";

export const PREFERENCES_QUERY_KEY = ["user-preferences"] as const;

export const DEFAULT_PREFERENCES: ProfilePreferencesData = {
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  ui: {
    theme: "system",
    compactMode: false,
  },
};

export function usePreferences() {
  const queryClient = useQueryClient();
  const { setTheme } = useTheme();

  const query = useQuery<ProfilePreferencesData>({
    queryKey: PREFERENCES_QUERY_KEY,
    queryFn: async () => {
      const res = await getPreferencesAction();
      if (!res.success || !res.data) {
        return DEFAULT_PREFERENCES;
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const preferences = query.data ?? DEFAULT_PREFERENCES;

  // Sync server preferences into next-themes when they load
  useEffect(() => {
    if (query.data?.ui?.theme) {
      setTheme(query.data.ui.theme);
    }
  }, [query.data?.ui?.theme, setTheme]);

  const updateMutation = useMutation({
    mutationFn: async (newPreferences: ProfilePreferencesData) => {
      const res = await updatePreferencesAction(newPreferences);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to save preferences");
      }
      return res.data;
    },
    onMutate: async (newPreferences) => {
      await queryClient.cancelQueries({ queryKey: PREFERENCES_QUERY_KEY });
      const previousPreferences =
        queryClient.getQueryData<ProfilePreferencesData>(PREFERENCES_QUERY_KEY);

      queryClient.setQueryData<ProfilePreferencesData>(
        PREFERENCES_QUERY_KEY,
        newPreferences,
      );
      setTheme(newPreferences.ui.theme);

      return { previousPreferences };
    },
    onError: (_err, _newPreferences, context) => {
      if (context?.previousPreferences) {
        queryClient.setQueryData<ProfilePreferencesData>(
          PREFERENCES_QUERY_KEY,
          context.previousPreferences,
        );
        setTheme(context.previousPreferences.ui.theme);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: PREFERENCES_QUERY_KEY });
    },
  });

  const updatePreferences = useCallback(
    async (
      updater: (prev: ProfilePreferencesData) => ProfilePreferencesData,
    ) => {
      const next = updater(preferences);
      return updateMutation.mutateAsync(next);
    },
    [preferences, updateMutation],
  );

  return {
    preferences,
    isLoading: query.isLoading,
    isUpdating: updateMutation.isPending,
    updatePreferences,
  };
}
