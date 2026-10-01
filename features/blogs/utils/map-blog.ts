import { format, parseISO } from "date-fns";
import { ar, enUS, tr } from "date-fns/locale";
import type { Locale as DateLocale } from "date-fns";
import { resolveImageUrl } from "@/lib/images";
import type {
  ApiBlog,
  ApiBlogAuthor,
  ApiBlogCategory,
  ApiBlogsPageData,
  ApiBlogsPaginationMeta,
  ApiBlogsResponse,
  BlogPost,
  BlogsListResult,
  BlogsPagination,
} from "../types";

const DATE_LOCALES: Record<string, DateLocale> = {
  ar,
  en: enUS,
  tr,
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function calculateReadTime(text: string): number {
  const plain = stripHtml(text);
  const wordCount = plain.split(/\s+/).filter(Boolean).length;
  // Estimate ~180 words/min
  return Math.max(1, Math.ceil(wordCount / 180));
}

function formatDate(dateString?: string | null, locale = "ar"): string {
  if (!dateString) return "";
  try {
    const parsed = parseISO(dateString);
    if (isNaN(parsed.getTime())) return dateString;
    const dateLocale = DATE_LOCALES[locale] || ar;
    return format(parsed, "dd MMMM yyyy", { locale: dateLocale });
  } catch {
    return dateString;
  }
}

function resolveAuthor(rawAuthor?: string | ApiBlogAuthor | null, authorName?: string | null): BlogPost["author"] {
  if (!rawAuthor && !authorName) return null;

  if (typeof rawAuthor === "string") {
    return {
      name: rawAuthor.trim(),
      avatar: null,
    };
  }

  if (rawAuthor && typeof rawAuthor === "object") {
    return {
      name: rawAuthor.name?.trim() || authorName?.trim() || "",
      avatar: resolveImageUrl(rawAuthor.avatar),
      bio: rawAuthor.bio || undefined,
    };
  }

  if (authorName?.trim()) {
    return {
      name: authorName.trim(),
      avatar: null,
    };
  }

  return null;
}

function resolveCategory(rawCategory?: string | ApiBlogCategory | null, categoryName?: string | null): string | null {
  if (typeof rawCategory === "string" && rawCategory.trim()) {
    return rawCategory.trim();
  }
  if (rawCategory && typeof rawCategory === "object" && rawCategory.name) {
    return rawCategory.name.trim();
  }
  if (categoryName?.trim()) {
    return categoryName.trim();
  }
  return null;
}

function resolveCoverImage(raw: ApiBlog): string | null {
  const imageCandidate =
    raw.cover_image ||
    raw.image ||
    raw.thumbnail ||
    (Array.isArray(raw.images) && raw.images.length > 0 ? raw.images[0] : null);

  return resolveImageUrl(imageCandidate) || null;
}

export function mapBlog(raw: ApiBlog, locale = "ar"): BlogPost {
  const idStr = String(raw.id ?? "");
  const title = (raw.title || raw.name || `Blog #${idStr}`).trim();
  const slug = (raw.slug?.trim() || idStr).replace(/^\/+/, "");
  const content = (raw.content || raw.body || raw.description || "").trim();
  
  let excerpt = (raw.short_description || raw.excerpt || "").trim();
  if (!excerpt && content) {
    const plain = stripHtml(content);
    excerpt = plain.length > 180 ? `${plain.slice(0, 180)}...` : plain;
  }

  const publishedAt = raw.published_at || raw.created_at || new Date().toISOString();
  const publishedDateFormatted = formatDate(publishedAt, locale);
  const readTimeMinutes = calculateReadTime(content || excerpt);
  const coverImage = resolveCoverImage(raw);

  const tags: string[] = Array.isArray(raw.tags)
    ? raw.tags.map((t) => String(t).trim()).filter(Boolean)
    : typeof raw.tags === "string" && raw.tags.trim()
      ? raw.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

  return {
    id: idStr,
    title,
    slug,
    excerpt,
    content,
    coverImage,
    category: resolveCategory(raw.category, raw.category_name),
    tags,
    author: resolveAuthor(raw.author, raw.author_name),
    publishedAt,
    publishedDateFormatted,
    readTimeMinutes,
    viewsCount: Number(raw.views_count ?? raw.views ?? 0),
    isFeatured: Boolean(raw.is_featured),
    href: `/blogs/${encodeURIComponent(slug)}`,
  };
}

export function mapBlogsResponse(
  response: ApiBlogsResponse | null | undefined,
  locale = "ar",
): BlogsListResult {
  if (!response) {
    return {
      posts: [],
      pagination: {
        currentPage: 1,
        lastPage: 1,
        perPage: 10,
        total: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  let rawList: ApiBlog[] = [];
  let meta: ApiBlogsPaginationMeta | undefined = response.meta;

  if (Array.isArray(response.data)) {
    rawList = response.data;
  } else if (response.data && typeof response.data === "object" && "data" in response.data) {
    const pageData = response.data as ApiBlogsPageData;
    rawList = Array.isArray(pageData.data) ? pageData.data : [];
    if (pageData.meta) {
      meta = pageData.meta;
    }
  }

  const posts = rawList.map((item) => mapBlog(item, locale));

  const currentPage = meta?.current_page ?? 1;
  const lastPage = meta?.last_page ?? 1;
  const perPage = meta?.per_page ?? 10;
  const total = meta?.total ?? posts.length;

  const pagination: BlogsPagination = {
    currentPage,
    lastPage,
    perPage,
    total,
    hasNextPage: currentPage < lastPage,
    hasPrevPage: currentPage > 1,
  };

  return {
    posts,
    pagination,
  };
}
