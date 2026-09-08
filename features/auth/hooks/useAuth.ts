"use client";

/**
 * Re-export for callers that expect hooks under `features/auth/hooks`.
 * Implementation lives with AuthProvider so context and hook stay colocated.
 */
export { useAuth } from "../components/AuthProvider";
