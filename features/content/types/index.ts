export type {
  ApiPage,
  ApiPageGroup,
  ApiPageResponse,
  ApiPagesResponse,
} from "./api";

/** Legacy mock-era allowlist — kept for generateStaticParams / mock fallback. */
export const CONTENT_PAGE_SLUGS = [
  "terms",
  "privacy",
  "cookies",
  "size-guide",
  "fabric-care",
  "track-order",
  "shipping",
  "returns",
  "faq",
  "about",
  "philosophy",
  "sustainability",
  "boutiques",
  "contact",
] as const;

export type ContentPageSlug = (typeof CONTENT_PAGE_SLUGS)[number];

export type ContentBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; style?: "bullet" | "numbered"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "size-chart" };

export type ContentPage = {
  /** API or mock slug (e.g. `our-story`, `privacy`). */
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  blocks: ContentBlock[];
  /** Present when loaded from `GET /api/v1/pages`. */
  group?: string;
};

/** Lightweight link model for footer / nav lists. */
export type StorefrontPageLink = {
  id: number;
  slug: string;
  href: `/${string}`;
  title: string;
  group: string;
  sortOrder: number;
};

export function isContentPageSlug(slug: string): slug is ContentPageSlug {
  return (CONTENT_PAGE_SLUGS as readonly string[]).includes(slug);
}
