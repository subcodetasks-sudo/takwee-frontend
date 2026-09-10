import { getAllowedImageHosts } from "./config";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "[::1]",
]);

function isPrivateIpv4(hostname: string): boolean {
  const match = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!match) return false;

  const octets = match.slice(1).map(Number);
  if (octets.some((n) => n > 255)) return true;

  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

/**
 * Whether an absolute image URL may be fetched by the proxy (SSRF guard).
 */
export function isAllowedImageUrl(candidate: string | URL): boolean {
  let url: URL;
  try {
    url = typeof candidate === "string" ? new URL(candidate) : candidate;
  } catch {
    return false;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  if (url.username || url.password) return false;

  const hostname = url.hostname.toLowerCase();
  if (!hostname || BLOCKED_HOSTNAMES.has(hostname) || isPrivateIpv4(hostname)) {
    return false;
  }

  // Prefer HTTPS upstream in production.
  if (
    process.env.NODE_ENV === "production" &&
    url.protocol !== "https:"
  ) {
    return false;
  }

  const allowed = getAllowedImageHosts();
  if (allowed.length === 0) {
    // No allowlist yet — reject until API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is set.
    return false;
  }

  return allowed.some(
    (host) => hostname === host || hostname.endsWith(`.${host}`),
  );
}
