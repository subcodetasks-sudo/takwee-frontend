/** Customer review shown on the PDP reviews tab. */
export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  /** Locale-formatted date label. */
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  sizePurchased?: string;
  helpfulCount: number;
}
