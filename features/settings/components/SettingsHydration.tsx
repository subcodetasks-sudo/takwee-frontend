"use client";

import { HydrationBoundary, type DehydratedState } from "@tanstack/react-query";

type SettingsHydrationProps = {
  state: DehydratedState;
  children: React.ReactNode;
};

/** Seeds the shared `["app-settings"]` query from the RSC fetch. */
export function SettingsHydration({ state, children }: SettingsHydrationProps) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}
