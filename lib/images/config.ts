/**
 * Image media is served from the same backend as the API.
 *
 * Uses `API_BASE_URL` on the server when set, otherwise
 * `NEXT_PUBLIC_API_BASE_URL` (available on client and server).
 */

export const IMAGE_PROXY_PATH = "/api/images" as const;

/** Local static assets under `public/` that must not be proxied to the API. */
export const LOCAL_PUBLIC_IMAGE_PREFIXES = ["/imgs/"] as const;

function normalizeBaseUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin + url.pathname.replace(/\/$/, "");
  } catch {
    return null;
  }
}

/**
 * API origin used to resolve relative media paths / storage keys.
 * Prefer the server-only URL when present.
 */
export function getApiBaseUrl(): string | null {
  const serverOnly = process.env.API_BASE_URL;
  if (serverOnly) {
    const normalized = normalizeBaseUrl(serverOnly);
    if (normalized) return normalized;
  }

  const publicBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (publicBase) return normalizeBaseUrl(publicBase);

  return null;
}

/** @deprecated Prefer `getApiBaseUrl` — images share the API host. */
export function getImagesBaseUrl(): string | null {
  return getApiBaseUrl();
}

export function getAllowedImageHosts(): string[] {
  const hosts: string[] = [];

  for (const raw of [
    process.env.API_BASE_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ]) {
    if (!raw?.trim()) continue;
    try {
      hosts.push(new URL(raw.trim()).hostname.toLowerCase());
    } catch {
      // ignore invalid env values
    }
  }

  return [...new Set(hosts)];
}
