import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing, type Locale } from "./i18n/routing";
import { getApiBaseUrl } from "./lib/api-client";
import {
  hasAuthToken,
  isProtectedPath,
  isGuestOnlyPath,
  getCleanPathWithoutLocale,
} from "./features/auth/utils/session-cookie";

type SettingsListResponse = {
  success?: boolean;
  data?: Array<{ key: string; value: unknown }>;
};

function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" &&
    (routing.locales as readonly string[]).includes(value)
  );
}

/**
 * Resolve `default_language` from public settings for locale negotiation.
 * Soft-fails to the compile-time routing default.
 */
async function resolveDefaultLocale(): Promise<Locale> {
  const base = getApiBaseUrl();
  if (!base) return routing.defaultLocale;

  try {
    const response = await fetch(`${base.replace(/\/+$/, "")}/api/v1/settings`, {
      next: { revalidate: 60, tags: ["settings"] },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return routing.defaultLocale;

    const json = (await response.json()) as SettingsListResponse;
    const item = json?.data?.find((entry) => entry.key === "default_language");
    if (isLocale(item?.value)) {
      return item.value;
    }
  } catch {
    // Keep storefront reachable if settings are down
  }

  return routing.defaultLocale;
}

export default async function proxy(request: NextRequest) {
  const defaultLocale = await resolveDefaultLocale();

  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const hasLocalePrefix = (routing.locales as readonly string[]).includes(firstSegment);
  const locale = hasLocalePrefix ? (firstSegment as Locale) : defaultLocale;
  const pathWithoutLocale = "/" + (hasLocalePrefix ? segments.slice(1) : segments).join("/");

  const isAuthenticated = hasAuthToken(request.cookies);

  // 1. Protected routes: User MUST be authenticated
  if (isProtectedPath(pathWithoutLocale) && !isAuthenticated) {
    const loginPrefix = locale !== defaultLocale ? `/${locale}` : "";
    const loginUrl = new URL(`${loginPrefix}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Guest-only routes (auth pages & verify): Navigation is DISABLED for authenticated users
  if (isGuestOnlyPath(pathWithoutLocale) && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    let destination: string;

    if (
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("//") &&
      !isGuestOnlyPath(getCleanPathWithoutLocale(redirectParam, routing.locales))
    ) {
      destination = redirectParam;
    } else {
      const localePrefix = locale !== defaultLocale ? `/${locale}` : "";
      destination = localePrefix || "/";
    }

    const redirectUrl = new URL(destination, request.url);
    return NextResponse.redirect(redirectUrl);
  }

  const handle = createMiddleware({
    ...routing,
    defaultLocale,
  });

  return handle(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ["/", "/(ar|en|tr)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
