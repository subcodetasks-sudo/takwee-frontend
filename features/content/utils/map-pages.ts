import type { ApiPage } from "../types/api";
import type { ContentBlock, ContentPage, StorefrontPageLink } from "../types";

const LEGAL_SLUG_RE = /^(terms|privacy|cookies|cookie)/i;

/** Normalize API timestamps (`YYYY-MM-DD HH:mm:ss`) for `Date` parsing. */
function toIsoDate(value: string | null | undefined): string {
  if (!value) return new Date().toISOString();
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
}

/**
 * API `content` is HTML or plain text when present.
 * Until the CMS fills it, pages render title-only (empty blocks).
 */
function contentToBlocks(content: string | null): ContentBlock[] {
  if (!content?.trim()) return [];
  const trimmed = content.trim();
  // Prefer treating CMS HTML as a single callout-free paragraph of plain text
  // when tags are absent; strip tags for a safe text fallback otherwise.
  if (!/<[a-z][\s\S]*>/i.test(trimmed)) {
    return [{ type: "paragraph", text: trimmed }];
  }
  const plain = trimmed
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return plain ? [{ type: "paragraph", text: plain }] : [];
}

export function mapPageToLink(page: ApiPage): StorefrontPageLink {
  return {
    id: page.id,
    slug: page.slug,
    href: `/${page.slug}`,
    title: page.title,
    group: page.group,
    sortOrder: page.sort_order,
  };
}

export function mapApiPageToContentPage(page: ApiPage): ContentPage {
  return {
    slug: page.slug,
    title: page.title,
    description: "",
    updatedAt: toIsoDate(page.updated_at),
    blocks: contentToBlocks(page.content),
    group: page.group,
  };
}

export function sortPageLinks(links: StorefrontPageLink[]): StorefrontPageLink[] {
  return [...links].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}

export function isLegalPageLink(link: StorefrontPageLink): boolean {
  return link.group === "legal" || LEGAL_SLUG_RE.test(link.slug);
}

export function groupPageLinks(links: StorefrontPageLink[]) {
  const sorted = sortPageLinks(links);
  return {
    about: sorted.filter((link) => link.group === "about"),
    support: sorted.filter((link) => link.group === "support"),
    legal: sorted.filter(isLegalPageLink),
    other: sorted.filter(
      (link) =>
        link.group !== "about" &&
        link.group !== "support" &&
        !isLegalPageLink(link),
    ),
  };
}
