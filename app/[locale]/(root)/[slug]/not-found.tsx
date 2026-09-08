/**
 * Content-slug 404 boundary.
 *
 * Triggered when `app/[locale]/(root)/[slug]/page.tsx` calls `notFound()` —
 * e.g. slug not in the allowlist, or `getContentPage()` returns null
 * (future CMS/API 404 / unpublished page).
 *
 * Reuses the shared `(root)/not-found` UI so Header/Footer stay consistent.
 */
export { default } from "../not-found";
