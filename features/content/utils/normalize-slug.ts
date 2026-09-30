/**
 * Next.js gives non-ASCII `[slug]` params to the page still percent-encoded
 * (`%D8%A8…`) while `generateMetadata` receives the decoded text. Encoding the
 * percent-encoded value again (`%25D8…`) misses `GET /api/v1/pages/{slug}`.
 */
export function normalizeContentSlug(slug: string): string {
  if (!slug.includes("%")) return slug;
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
