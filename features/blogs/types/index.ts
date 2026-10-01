export type {
  ApiBlog,
  ApiBlogAuthor,
  ApiBlogCategory,
  ApiBlogsPageData,
  ApiBlogsPaginationLinks,
  ApiBlogsPaginationMeta,
  ApiBlogsResponse,
  ApiBlogDetailResponse,
} from "./api";

export interface BlogAuthor {
  name: string;
  avatar: string | null;
  bio?: string | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string | null;
  tags: string[];
  author: BlogAuthor | null;
  publishedAt: string;
  publishedDateFormatted: string;
  readTimeMinutes: number;
  viewsCount: number;
  isFeatured: boolean;
  href: `/blogs/${string}`;
}

export interface BlogsPagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BlogsListResult {
  posts: BlogPost[];
  pagination: BlogsPagination;
}

export interface FetchBlogsParams {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  locale?: string;
}
