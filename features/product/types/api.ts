/** Raw shapes returned by `GET /api/v1/products` and `GET /api/v1/products/{id}`. */

export interface ApiProductCategory {
  id: number;
  name: string;
}

export interface ApiProductRating {
  id: number;
  product_id: number;
  rating: number;
  customer_name: string;
  size: string | null;
  title: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiProductColor {
  id: number;
  name: string;
  /** Hex / CSS color value from the API. */
  value: string;
  /** Per-color gallery images (may be empty). */
  images?: string[];
}

export interface ApiProductSize {
  id: number;
  name: string;
  /** Optional rich-text details for this size. */
  details?: string | null;
}

export interface ApiProductFeature {
  id: number;
  name: string;
  /** Optional rich-text value / description. */
  value?: string | null;
}

export interface ApiProduct {
  id: number;
  name: string;
  category: ApiProductCategory;
  price: string;
  original_price: string | null;
  discount: string | null;
  status: string;
  model_number: string | null;
  weight: string | null;
  /** Product description — may contain HTML. */
  description: string | null;
  sales_count?: number;
  profit?: number;
  rating?: number;
  ratings_count?: number;
  ratings?: ApiProductRating[];
  main_image: string | null;
  images: string[];
  stock_quantity?: number;
  in_stock?: boolean;
  colors: ApiProductColor[];
  sizes: ApiProductSize[];
  features: ApiProductFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiProductsMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiProductsLinks {
  next: string | null;
}

export interface ApiProductsPage {
  data: ApiProduct[];
  meta: ApiProductsMeta;
  links: ApiProductsLinks;
}

export interface ApiProductsResponse {
  success: boolean;
  message: string;
  data: ApiProductsPage;
}

export interface ApiProductDetailResponse {
  success: boolean;
  message: string;
  data: ApiProduct;
}

/** Raw shapes returned by `GET /api/v1/abaya-size-guide`. */
export interface ApiAbayaSizeGuideRow {
  size: string;
  height_min: number;
  height_max: number;
  height_plus: boolean;
  abaya_length: number;
  chest_width: number;
}

export interface ApiAbayaSizeGuide {
  title: string;
  description: string;
  how_to: string;
  footer_note: string;
  consultation_cta: string;
  default_unit: string;
  rows: ApiAbayaSizeGuideRow[];
}

export interface ApiAbayaSizeGuideResponse {
  success: boolean;
  message: string;
  data: ApiAbayaSizeGuide;
}
