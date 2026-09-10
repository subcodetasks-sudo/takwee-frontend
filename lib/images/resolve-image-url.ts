import {
  getApiBaseUrl,
  IMAGE_PROXY_PATH,
  LOCAL_PUBLIC_IMAGE_PREFIXES,
} from "./config";
import { isAllowedImageUrl } from "./allowed-hosts";

export type ResolveImageMode = "proxy" | "direct";

export interface ResolveImageUrlOptions {
  /**
   * `proxy` (default) — API media refs go through `/api/images` (same-origin).
   * `direct` — absolute API URLs (requires `images.remotePatterns` for next/image).
   */
  mode?: ResolveImageMode;
  width?: number;
  quality?: number;
}

function isAbsoluteHttpUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

function isLocalPublicAsset(src: string): boolean {
  return LOCAL_PUBLIC_IMAGE_PREFIXES.some((prefix) => src.startsWith(prefix));
}

/**
 * Join an API media path or storage key onto the API base URL.
 * Absolute paths (`/storage/...`) attach to the API origin.
 * Relative keys (`products/foo.jpg`) append to the configured base path.
 */
function joinApiMediaUrl(base: string, path: string): string {
  if (path.startsWith("/")) {
    return `${new URL(base).origin}${path}`;
  }

  return `${base}/${path.replace(/^\/+/, "")}`;
}

/**
 * Resolve a media ref to an absolute API URL.
 * Returns `null` when no API base is configured or the result is not allowed.
 */
export function resolveUpstreamImageUrl(
  src: string | null | undefined,
): string | null {
  if (!src?.trim()) return null;

  const trimmed = src.trim();

  if (isAbsoluteHttpUrl(trimmed)) {
    return isAllowedImageUrl(trimmed) ? trimmed : null;
  }

  if (isLocalPublicAsset(trimmed)) return null;

  const base = getApiBaseUrl();
  if (!base) return null;

  const upstream = joinApiMediaUrl(base, trimmed);
  return isAllowedImageUrl(upstream) ? upstream : null;
}

/**
 * Build the same-origin proxy URL for an image reference.
 */
export function resolveImageProxyUrl(
  src: string,
  options: Pick<ResolveImageUrlOptions, "width" | "quality"> = {},
): string {
  const params = new URLSearchParams({ src });

  if (options.width != null && Number.isFinite(options.width)) {
    params.set("w", String(Math.round(options.width)));
  }
  if (options.quality != null && Number.isFinite(options.quality)) {
    params.set("q", String(Math.round(options.quality)));
  }

  return `${IMAGE_PROXY_PATH}?${params.toString()}`;
}

/**
 * Resolve a media reference for use as `next/image` `src` (or `<img src>`).
 *
 * - Local public assets (`/imgs/...`) are returned unchanged.
 * - Absolute API URLs and API-relative paths/keys are proxied by default.
 * - Empty / unknown values fall back to the original string (or `""`).
 */
export function resolveImageUrl(
  src: string | null | undefined,
  options: ResolveImageUrlOptions = {},
): string {
  if (!src?.trim()) return "";

  const trimmed = src.trim();
  const mode = options.mode ?? "proxy";

  if (isLocalPublicAsset(trimmed)) return trimmed;

  if (mode === "direct") {
    if (isAbsoluteHttpUrl(trimmed)) {
      return isAllowedImageUrl(trimmed) ? trimmed : "";
    }
    return resolveUpstreamImageUrl(trimmed) ?? "";
  }

  if (isAbsoluteHttpUrl(trimmed)) {
    return isAllowedImageUrl(trimmed)
      ? resolveImageProxyUrl(trimmed, options)
      : trimmed;
  }

  const upstream = resolveUpstreamImageUrl(trimmed);
  if (upstream) {
    return resolveImageProxyUrl(trimmed, options);
  }

  // No API base configured yet — leave refs as-is for callers / future wiring.
  return trimmed;
}

/** Map many image refs (e.g. product color galleries). */
export function resolveImageUrls(
  srcs: Array<string | null | undefined>,
  options?: ResolveImageUrlOptions,
): string[] {
  return srcs.map((src) => resolveImageUrl(src, options));
}
