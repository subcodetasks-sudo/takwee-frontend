import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing, type Locale } from "./i18n/routing";
import { getApiBaseUrl } from "./lib/api-client";

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
