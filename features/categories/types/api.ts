/** Raw shapes returned by `GET /api/v1/categories`. */

export interface ApiCategory {
  id: number;
  name: string;
  image: string | null;
  sort_order: number;
  status: string;
  is_hero: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiCategoriesMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiCategoriesLinks {
  next: string | null;
}

export interface ApiCategoriesPage {
  data: ApiCategory[];
  meta: ApiCategoriesMeta;
  links: ApiCategoriesLinks;
}

export interface ApiCategoriesResponse {
  success: boolean;
  message: string;
  data: ApiCategoriesPage;
}
