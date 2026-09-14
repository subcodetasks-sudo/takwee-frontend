"use server";

import {
  createServerAction,
  serverFetch,
  type ActionState,
} from "@/lib/api-server";
import { submitReviewSchema } from "../schemas/submit-review-schema";
import type {
  ApiProductRating,
  ApiResponse,
  ApiSubmitRatingInput,
  SubmitReviewResult,
} from "../types";

const ratingsPath = (productId: string | number) =>
  `/api/v1/products/${encodeURIComponent(String(productId))}/ratings`;

/**
 * Server action: POST /api/v1/products/{productId}/ratings
 * Attaches the session cookie via serverFetch.
 */
export const submitProductReviewAction = createServerAction({
  schema: submitReviewSchema,
  handler: async (input): Promise<SubmitReviewResult> => {
    const body: ApiSubmitRatingInput = {
      rating: input.rating,
      customer_name: input.customerName.trim(),
      size: input.size?.trim() || null,
      title: input.title.trim(),
      comment: input.comment.trim(),
    };

    const res = await serverFetch<ApiResponse<ApiProductRating>>(
      ratingsPath(input.productId),
      {
        method: "POST",
        body,
        autoAuth: true,
        headers: {
          ...(input.locale ? { "Accept-Language": input.locale } : {}),
        },
      },
    );

    if (!res?.success) {
      throw new Error(res?.message || "Failed to submit product review");
    }

    const data = res.data;
    return {
      id: data?.id != null ? String(data.id) : `rev-${Date.now()}`,
      productId: String(data?.product_id ?? input.productId),
      rating: data?.rating ?? input.rating,
      customerName: data?.customer_name?.trim() || input.customerName.trim(),
      size: data?.size?.trim() || input.size?.trim() || undefined,
      title: data?.title?.trim() || input.title?.trim() || undefined,
      comment: data?.comment?.trim() || input.comment?.trim() || undefined,
    };
  },
  successMessage: "Review submitted successfully",
});

export type { ActionState, SubmitReviewResult };
