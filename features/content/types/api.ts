/** Raw shapes returned by `GET /api/v1/pages` and `GET /api/v1/pages/{slug}`. */

export type ApiPageGroup = "about" | "support" | "legal" | (string & {});

export interface ApiPage {
  id: number;
  slug: string;
  group: ApiPageGroup;
  title: string;
  content: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ApiPagesResponse {
  success: boolean;
  message: string;
  data: ApiPage[];
}

export interface ApiPageResponse {
  success: boolean;
  message: string;
  data: ApiPage;
}
