/** Raw shapes returned by `GET /api/v1/blogs` and `GET /api/v1/blogs/{id}` or `{slug}`. */

export interface ApiBlogAuthor {
  id?: number | string;
  name?: string;
  avatar?: string | null;
  bio?: string | null;
}

export interface ApiBlogCategory {
  id?: number | string;
  name?: string;
  slug?: string;
}

export interface ApiBlog {
  id: number | string;
  title?: string | null;
  name?: string | null;
  slug?: string | null;
  content?: string | null;
  body?: string | null;
  description?: string | null;
  short_description?: string | null;
  excerpt?: string | null;
  image?: string | null;
  cover_image?: string | null;
  thumbnail?: string | null;
  images?: string[] | null;
  author?: string | ApiBlogAuthor | null;
  author_name?: string | null;
  category?: string | ApiBlogCategory | null;
  category_name?: string | null;
  tags?: string[] | string | null;
  views?: number | null;
  views_count?: number | null;
  is_featured?: boolean | number | null;
  published_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ApiBlogsPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface ApiBlogsPaginationLinks {
  first?: string | null;
  last?: string | null;
  prev?: string | null;
  next?: string | null;
}

export interface ApiBlogsPageData {
  data: ApiBlog[];
  meta?: ApiBlogsPaginationMeta;
  links?: ApiBlogsPaginationLinks;
}

export interface ApiBlogsResponse {
  success?: boolean;
  message?: string;
  data: ApiBlog[] | ApiBlogsPageData;
  meta?: ApiBlogsPaginationMeta;
  links?: ApiBlogsPaginationLinks;
}

export interface ApiBlogDetailResponse {
  success?: boolean;
  message?: string;
  data: ApiBlog;
}
