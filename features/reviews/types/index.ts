export interface ReviewProductItem {
  /** API product id — required to POST a rating. */
  productId?: string | number;
  name: string;
  image?: string;
  slug?: string;
  size?: string;
  color?: string;
}

export interface CreateReviewInput {
  productId: string | number;
  customerName: string;
  rating: number;
  size?: string | null;
  title?: string | null;
  comment?: string | null;
  locale?: string;
}

export interface SubmitReviewResult {
  id: string;
  productId: string;
  rating: number;
  customerName: string;
  size?: string;
  title?: string;
  comment?: string;
}

export type {
  ApiProductRating,
  ApiResponse,
  ApiSubmitRatingInput,
} from "./api";
