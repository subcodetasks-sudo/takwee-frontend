export type ReviewFeedbackTag =
  | "trueToSize"
  | "luxuriousFabric"
  | "flawlessCut"
  | "breathable"
  | "neatStitching";

export interface ReviewProductItem {
  name: string;
  image?: string;
  slug?: string;
  size?: string;
  color?: string;
}

export interface CreateReviewInput {
  productSlug?: string;
  productName: string;
  orderNumber: string;
  rating: number;
  tags: ReviewFeedbackTag[];
  comment: string;
}

export interface SubmitReviewResponse {
  success: boolean;
  reviewId?: string;
  error?: string;
}
