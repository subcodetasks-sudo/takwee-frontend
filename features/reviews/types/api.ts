/** Raw shapes for `POST /api/v1/products/{productId}/ratings`. */

export interface ApiSubmitRatingInput {
  rating: number;
  customer_name: string;
  size?: string | null;
  title?: string | null;
  comment?: string | null;
}

export interface ApiProductRating {
  id: number;
  product_id: number;
  rating: number;
  customer_name: string;
  size: string | null;
  title: string | null;
  comment: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}
