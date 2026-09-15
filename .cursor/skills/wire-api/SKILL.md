---
name: wire-api
description: >-
  Wire backend API endpoints into Takween features using lib/api-client
  (http), optional lib/api-server (serverFetch / createServerAction), React Query
  hooks, TypeScript DTO↔view-model mappers, and lib/images resolveImageUrl. Use
  when connecting Postman/backend endpoints, replacing mocks with real API data,
  adding feature fetchers, or wiring home/catalog/auth/server-state.
---

# Wire API (Takween)

Follow this workflow whenever connecting a backend endpoint to the storefront.
Canonical project rules also live in [`AGENTS.md`](../../../AGENTS.md) §§2, 4–5.

## Non-negotiables

1. **Use shared clients** — never ad-hoc `fetch` to the API base URL.
   - Client / isomorphic: [`lib/api-client.ts`](../../../lib/api-client.ts) → `http.get|post|put|patch|delete`, `ApiError`, `getApiBaseUrl`
   - Server Actions / authenticated RSC: [`lib/api-server.ts`](../../../lib/api-server.ts) → `serverFetch`, `createServerAction`, `safeServerAction`
2. **Env only**: `NEXT_PUBLIC_API_BASE_URL`, optional `API_BASE_URL`, optional `API_TIMEOUT_MS` (see [`.env.example`](../../../.env.example)). Do not invent parallel base-URL vars.
3. **No new packages** without asking the user (project package protocol).
4. **Feature-sliced layout** under `features/<feature>/`:
   ```
   api/          # fetchers (call http / serverFetch)
   types/        # API DTOs + domain view models (TypeScript only — no Zod for responses)
   hooks/        # React Query useQuery / useMutation
   utils/        # mappers, slugify, href helpers
   components/   # UI that reads the hook (or receives mapped props)
   index.ts      # barrel exports
   ```
5. **Zod** is for **forms** only (`schemas/` + react-hook-form). API response shapes = TypeScript interfaces in `types/`.
6. **Media** through [`resolveImageUrl`](../../../lib/images/resolve-image-url.ts) (proxy by default). Local `public/imgs/…` stays unproxied. Same host as API — no separate CDN env unless reintroduced. **If there is no image `src` (null, undefined, or empty string), do not render the `Image` / `<img>` component** — omit it or show a non-image fallback; never pass `""` to `src`.
7. **Products from API**: set optional `Product.name` for display; keep `nameKey` for mocks / i18n fallback (`product.name ?? tProducts(product.nameKey)`).

## Workflow checklist

Copy and track:

```
API wiring:
- [ ] 1. Confirm endpoint path, method, auth, sample JSON (Postman / user paste)
- [ ] 2. Add API DTO types + storefront view models in features/<f>/types/
- [ ] 3. Write mapper(s) in features/<f>/utils/ (snake_case API → camelCase UI)
- [ ] 4. Write fetcher in features/<f>/api/ using http.* or serverFetch; throw on failure
- [ ] 5. Add React Query hook in features/<f>/hooks/ (shared queryKey)
- [ ] 6. Wire components to the hook (one cache, multiple consumers) with skeleton loading during fetch
- [ ] 7. Add app-level `loading.tsx` for route-level server / page fetches with matching skeleton UI
- [ ] 8. Resolve images via resolveImageUrl in mappers; UI skips `Image` when src is missing/empty
- [ ] 9. Add/update i18n only for chrome UI (CTAs, loading, errors) — not API copy
- [ ] 10. Export from features/<f>/index.ts
- [ ] 11. Update AGENTS.md if a new cross-feature convention appeared
```

## Step details

### 1. Endpoint contract

- Prefer user-provided response JSON over guessing.
- Probe only with safe GETs when base URL is already in `.env.local`.
- Paths are typically under `/api/v1/...` (example: home → `/api/v1/home`).
- Pass `Accept-Language: <locale>` when the API is localized.

### 2. Types

```ts
// types/api.ts — raw backend shapes (snake_case OK)
export interface ApiThingResponse {
  success: boolean;
  message: string;
  data: ApiThingData;
}

// types/index.ts — storefront models (camelCase)
export interface Thing {
  id: string;
  title: string;
  image: string;
}
```

Re-export API types from `types/index.ts` if useful; keep domain types Zod-free.

### 3. Fetcher (`api/`)

```ts
import { ApiError, getApiBaseUrl, http } from "@/lib/api-client";
import type { ApiThingResponse, Thing } from "../types";
import { mapThing } from "../utils/map-thing";

const PATH = "/api/v1/things";

/** Throws on failure — use as React Query queryFn. */
export async function fetchThings(locale?: string): Promise<Thing[]> {
  if (!getApiBaseUrl()) {
    throw new Error("API_BASE_URL / NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const json = await http.get<ApiThingResponse>(PATH, {
    headers: {
      ...(locale ? { "Accept-Language": locale } : {}),
    },
    next: {
      revalidate: 60,
      tags: ["things", locale ? `things:${locale}` : "things:default"],
    },
  });

  if (!json?.success || !json.data) {
    throw new ApiError(
      500,
      "Invalid Payload",
      json,
      json?.message || "Unexpected API payload",
    );
  }

  return mapThing(json.data);
}
```

- **Default (Client-side reads & interactions)**: `http` + React Query (client-fetch is the project default).
- **Server Fetch Exception (Checkout & Order Placement)**: Checkout endpoints (`previewCheckoutAction`, `placeOrderAction` under `features/checkout/api/actions.ts`) MUST execute as server fetches / server actions via `serverFetch` (`lib/api-server.ts`), guaranteeing secure server-side session token cookie attachment and order creation.
- **Mutations / cookie auth on server**: prefer `serverFetch` / `createServerAction` from `lib/api-server`.

### 4. React Query hook (`hooks/`)

Match [`QueryProvider`](../../../components/providers/QueryProvider.tsx) defaults (long `staleTime`, no refetch-on-focus/mount).

```ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { fetchThings } from "../api/get-things";

export const thingsQueryKey = (locale: string) => ["things", locale] as const;

export function useThings() {
  const locale = useLocale();
  const query = useQuery({
    queryKey: thingsQueryKey(locale),
    queryFn: () => fetchThings(locale),
  });

  return {
    ...query,
    things: query.data ?? [],
  };
}
```

**One queryKey per resource** — multiple components (e.g. Header ribbon + page sections) must call the **same** hook / key so the API is hit once per locale session.

### 5. Components & Skeleton Loading
 
- Interactive / query-driven sections: `'use client'` + hook.
- Keep `app/**/page.tsx` thin; compose feature components.
- **Skeleton loading in components**: Always provide visual skeleton placeholders during initial or background data fetches (`animate-pulse bg-muted/60`, matching the final layout shape and dimensions) rather than blank or abrupt UI jumps.
- **Route-level `loading.tsx`**: When wiring an app route page (`app/[locale]/(...)/[route]/page.tsx`), always ensure a corresponding `loading.tsx` exists at the route segment with an accessible skeleton layout (`aria-busy="true"`).
- Empty states: return clean empty state UI or `null`.
- Do **not** duplicate fetch logic inside each component.
- **Images**: only mount `next/image` / `<img>` when `src` is a non-empty string. Missing media → skip the component (or a muted placeholder block), never `src=""`.

```tsx
{item.image ? (
  <Image src={item.image} alt={item.title} fill className="object-cover" />
) : null}
```

### 6. Images in mappers

```ts
import { resolveImageUrl } from "@/lib/images";

image: src ? resolveImageUrl(src) || src : null,
```

Map missing API media to `null` (not `""`). Consumers must guard before rendering `Image`.

### 7. i18n

- API-supplied titles/descriptions render as data (no message keys per entity).
- Add `loading` / CTA / error strings to `messages/{ar,en,tr}.json` with **formal gender-neutral** copy (see create-ui-section-or-page skill).

### 8. Scope discipline

- Wire **only** what the user asked (e.g. home body + header `advertisement_tapes`, not footer / nav categories “later”).
- Leave unrelated mocks untouched until their endpoint is specified.

## Reference implementation (home)

| Piece | Location |
|---|---|
| Fetcher | `features/home/api/get-home-page.ts` → `fetchHomePage` → `GET /api/v1/home` |
| Hook | `features/home/hooks/useHomePage.ts` → `["home-page", locale]` |
| Mappers | `features/home/utils/map-home-page.ts`, `map-home-product.ts` |
| Consumers | `HeroCarousel`, `CategoriesSection`, `AdditionalSections`, Header ribbon (`advertisementTapes` only) |
| Server Fetch (Checkout) | `features/checkout/api/actions.ts` (`previewCheckoutAction`, `placeOrderAction`) → `serverFetch` (`lib/api-server.ts`) → `POST /api/v1/checkout/preview`, `POST /api/v1/checkout` |

## Anti-patterns

- Raw `fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/...`)` in components
- Zod schemas for read-only API payloads
- Per-component refetch of the same endpoint
- Hardcoded hex / remote image hosts outside `lib/images` allowlist
- Putting domain fetchers in `app/` or `components/common/`
- Installing axios / ky / another HTTP lib without approval
- Rendering `<Image src={…} />` / `<img>` when `src` is null, undefined, or `""`

## After wiring

- Export new public symbols from `features/<feature>/index.ts`.
- If you introduced a **repo-wide** convention (new env var, client helper, cache pattern), update [`AGENTS.md`](../../../AGENTS.md).
