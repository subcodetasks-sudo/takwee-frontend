import { QueryClient, dehydrate, type DehydratedState } from "@tanstack/react-query";
import type { AppSettings } from "../types";
import { settingsQueryKey } from "./query-key";

/** Prefill React Query with RSC settings so Header/Footer skip a duplicate fetch. */
export function dehydrateSettings(settings: AppSettings | null): DehydratedState {
  const queryClient = new QueryClient();
  if (settings) {
    queryClient.setQueryData(settingsQueryKey, settings);
  }
  return dehydrate(queryClient);
}
