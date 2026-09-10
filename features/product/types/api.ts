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
  value: string;
}

export interface ApiProductFeature {
  id?: number | string;
  name?: string;
  title?: string;
  value?: string;
  description?: string;
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
  description: string | null;
  sales_count?: number;
  profit?: number;
  rating?: number;
  ratings_count?: number;
  ratings?: ApiProductRating[];
  main_image: string | null;
  images: string[];
  colors: ApiProductColor[] | unknown[];
  sizes: unknown[];
  features: ApiProductFeature[] | unknown[];
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
