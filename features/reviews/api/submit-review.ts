import type { CreateReviewInput, SubmitReviewResponse } from "../types";

/**
 * Submits a product review.
 * Structured to cleanly connect with backend API routes or server actions.
 */
export async function submitProductReview(
  input: CreateReviewInput
): Promise<SubmitReviewResponse> {
  // Simulate network dispatch
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Placeholder for real API endpoint integration:
  // e.g., const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  // return res.json();

  return {
    success: true,
    reviewId: `rev-${Date.now()}`,
  };
}
