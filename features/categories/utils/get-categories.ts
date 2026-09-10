import { ApiError } from "@/lib/api-client";
import type { StorefrontCategory } from "../types";
import { fetchCategories } from "../api/get-categories";

/**
 * Soft-load storefront categories for RSC (shop path resolution, metadata).
 * Returns [] on failure so pages can fall back to legacy shop filters.
 */
export async function getCategories(
  locale?: string,
): Promise<StorefrontCategory[]> {
  try {
    return await fetchCategories(locale);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(
        `[getCategories] ${error.status} ${error.statusText}`,
        error.data,
      );
    } else {
      console.error("[getCategories] request failed", error);
    }
    return [];
  }
}
