<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Architecture & Agent Guidelines

## Project Context: Linen Line Store (Abaya E-Commerce Boutique)
**Linen Line Store** is an elegant, high-end e-commerce boutique specializing in premium **Abayas** (modern, luxury, minimalist, and traditional modest wear) crafted with fine linen and premium fabrics.
- **Brand Aesthetic & Identity**: Elegant, modest, clean, luxurious, and earthy/minimalist. The user experience should feel sophisticated, seamless, and tailored for fashion-forward modest clothing shoppers.
- **Domain Essentials**:
  - **Product Types**: Abayas (e.g., Casual, Formal/Event, Travel, Embroidered, Silk/Linen Blends), matching Sheilas/Hijabs, inner dresses, and accessories. Catalog routes are product-type agnostic so the store can expand beyond abayas.
  - **Attributes & Filters**: Fabric/Material (Pure Linen, Crepe, Silk, Cotton blends), Cuts & Silhouettes (A-Line, Butterfly/Farasha, Classic, Kimono/Open front, Cloche), Sizes (standard abaya lengths e.g., 52, 54, 56, 58, 60, bust width/custom sizing), Colorways (natural earth tones, classic black, olive, sand, neutrals).
  - **Cultural & Localization**: Primary focus on Middle Eastern / GCC, Turkish, and regional modest fashion markets with seamless trilingual support: **Arabic (`ar` - RTL, default)**, **English (`en` - LTR)**, and **Turkish (`tr` - LTR)**. Default currency is set to **Turkish Lira (TRY / ₺)** (with support for localized currencies like SAR, AED, USD, etc.).
  - **i18n & Font System**:
    - Supported locales: `ar`, `en`, `tr` (configured in [`i18n/routing.ts`](file:///c:/Loai/work/linen-line-store/i18n/routing.ts)).
    - Message catalogs: All new UI strings must be provided in [`messages/ar.json`](file:///c:/Loai/work/linen-line-store/messages/ar.json), [`messages/en.json`](file:///c:/Loai/work/linen-line-store/messages/en.json), and [`messages/tr.json`](file:///c:/Loai/work/linen-line-store/messages/tr.json).
    - Typography: `Noto_Kufi_Arabic` for Arabic (`font-noto-arabic`), `Outfit` (with `latin` and `latin-ext` subsets) for English & Turkish (`font-outfit`).

## 1. Feature-Driven Architecture (Feature-Sliced / Modular)

All business features must be organized by domain inside `features/<feature-name>/`:

```
features/
  ├── [feature-name]/
  │   ├── components/         # Feature-specific UI components
  │   ├── hooks/              # Feature-specific hooks & state logic
  │   ├── api/                # API calls, fetchers, server actions, mutation hooks
  │   ├── schemas/            # Zod schemas for form inputs only (react-hook-form resolvers)
  │   ├── types/              # Feature-specific TypeScript interfaces & domain types
  │   ├── utils/              # Feature-specific helpers
  │   └── index.ts            # Public barrel export for the feature
```

- **`schemas/`**: Zod **only** for user-facing form inputs validated with react-hook-form (e.g. login, register, address, profile). Keep inferred form value types next to their schema. Do **not** add Zod schemas for read-only content, CMS/page payloads, API response shapes, or other non-form data — model those with TypeScript in `types/` instead. Omit the `schemas/` folder entirely when a feature has no forms. Shared Zod ↔ react-hook-form bridging lives in [`lib/zod-resolver.ts`](lib/zod-resolver.ts).
- **`types/`**: Domain/entity TypeScript types and interfaces only (no Zod).
### Shared / Global Code Rules
- **`app/`**: Only routing, page entries, layouts, and route handlers. Keep page files thin; compose them from feature modules (e.g. `<CartDrawer />`, `<ProductDetails />`).
- **`components/ui/`**: Base atomic design system / shadcn primitives (`button`, `dialog`, `input`, etc.). Do not put domain logic here.
- **`components/common/`**: Shared non-domain components (e.g. `<Header />`, `<Footer />`, `<Navbar />`, `<Logo />`).
- **`lib/`**: Global utility functions, shared clients, and core config:
  - [`lib/utils.ts`](lib/utils.ts) — `cn` helpers
  - [`lib/api-client.ts`](lib/api-client.ts) — browser + isomorphic HTTP client
  - [`lib/api-server.ts`](lib/api-server.ts) — server actions / `serverFetch` helpers
  - [`lib/images/`](lib/images/) — image URL resolution & proxy helpers
  - [`lib/zod-resolver.ts`](lib/zod-resolver.ts) — Zod ↔ react-hook-form
- **`hooks/`**: Global reusable hooks (e.g. `useMediaQuery`, `useDebounce`).

---

## 2. Backend API Client & Environment

### Environment variables
Template: [`.env.example`](.env.example). Local secrets: `.env.local` (gitignored).

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Client + server | Public API origin (required for browser calls) |
| `API_BASE_URL` | Server only | Optional private API origin; preferred on the server when set |
| `API_TIMEOUT_MS` | Client + server | Request timeout for `lib/api-client` (default `15000`) |

Do **not** invent parallel base-URL env names. Image media shares the same API host (see §5).

### HTTP clients — always use these, never ad-hoc `fetch` to the API
- **Client / isomorphic**: [`lib/api-client.ts`](lib/api-client.ts)
  - `getApiBaseUrl()`, `ApiError`, `apiRequest`, `http.get|post|put|patch|delete`
  - Auto JSON body/Accept headers, query params, bearer `token`, abort timeout
- **Server Actions / RSC helpers**: [`lib/api-server.ts`](lib/api-server.ts)
  - `createServerAction`, `safeServerAction`, `serverFetch` (optional cookie session token + Zod response schema)
  - Builds on `api-client`; prefer this for authenticated server-only calls

Feature fetchers live in `features/<name>/api/` and **must** call `http.*` or `serverFetch` — do not duplicate base-URL / error handling.

### React Query (client server-state)
- Provider: [`components/providers/QueryProvider.tsx`](components/providers/QueryProvider.tsx) (defaults: long `staleTime`, no refetch-on-focus/mount).
- Feature hooks in `features/<name>/hooks/` wrap `useQuery` / `useMutation`.
- Pattern: `queryFn` calls the feature `api/` fetcher (which uses `http` / `serverFetch`); components read cached slices from the hook — **do not** re-fetch the same endpoint ad hoc in each component.

---

## 3. App Route Structure (Catalog & PDP)

All locale routes live under `app/[locale]/…` (default locale `ar` uses `localePrefix: "as-needed"` — no `/ar` prefix).

| Route | File | Purpose |
|---|---|---|
| `/shop` | [`app/[locale]/shop/page.tsx`](app/[locale]/shop/page.tsx) | Product listing (PLP) — all products |
| `/shop/[filter]` | [`app/[locale]/shop/[filter]/page.tsx`](app/[locale]/shop/[filter]/page.tsx) | Filtered listing (category / collection / promo) |
| `/products` | [`app/[locale]/products/page.tsx`](app/[locale]/products/page.tsx) | **Redirects to `/shop`** (no bare catalog under `/products`) |
| `/products/[slug]` | [`app/[locale]/products/[slug]/page.tsx`](app/[locale]/products/[slug]/page.tsx) | Product details (PDP) — one product by SEO slug |
| `/[slug]` (content) | [`app/[locale]/(root)/[slug]/page.tsx`](app/[locale]/(root)/[slug]/page.tsx) | Static boutique pages (terms, privacy, client care, atelier) |

**Content pages** are loaded from **`GET /api/v1/pages`** (list) and **`GET /api/v1/pages/{slug}`** (detail), with Accept-Language localization. Footer **Client Care** (`group: support`) and **The Atelier** (`group: about`) columns come from the list; `group: legal` (or terms/privacy/cookies slugs) appear in the footer bottom bar when present. Legacy mock slugs remain as a fallback in [`getContentPage`](features/content/api/get-content-page.ts). Unknown / missing `[slug]` values must call `notFound()` so [`(root)/not-found.tsx`](app/[locale]/(root)/not-found.tsx) / [`[slug]/not-found.tsx`](app/[locale]/(root)/[slug]/not-found.tsx) render — never leave the dynamic segment empty.

| Layer | Path | Role |
|---|---|---|
| List fetcher | [`features/content/api/get-pages.ts`](features/content/api/get-pages.ts) | `fetchPages` / `fetchPageBySlug` via `http.get` |
| Detail | [`features/content/api/get-content-page.ts`](features/content/api/get-content-page.ts) | API first, mock fallback for old slugs |
| Hook | [`features/content/hooks/usePages.ts`](features/content/hooks/usePages.ts) | React Query — key `["content-pages", locale]` |
| Mapper | [`features/content/utils/map-pages.ts`](features/content/utils/map-pages.ts) | API → footer links + `ContentPage` |

Current API groups: `about` (`our-story`, `linen-philosophy`, `craftsmanship`, `boutique-locations`, `contact-us`), `support` (`size-guide`, `linen-care`, `track-order`, `shipping-delivery`, `return-policy`).

**Shop `/shop/[filter]` resolution** ([`resolveShopPath`](features/shop/utils/resolve-shop-path.ts)):
1. Match an API category slug from `GET /api/v1/categories` (via [`categorySlug`](features/categories/utils/category-href.ts) / `StorefrontCategory.slug`) → products filtered by `product.categoryId`.
2. Else match a promo filter from [`SHOP_FILTERS`](features/product/utils/shop-filters.ts) (`new-in`, `sale`).
3. Else `notFound()`.

Nav / footer / home category tiles use unique `/shop/{slug}` hrefs from [`categoryHref`](features/categories/utils/category-href.ts) (one slug per API category — not shared buckets).

**Rules:**
- Category / occasion / promo live under **`/shop/...`**, never as top-level paths like `/casual` or `/abayas`.
- Product detail URLs stay **flat** at `/products/[slug]` (category is not part of the PDP path — products can belong to multiple filters).
- Product cards and deep links use `/products/${product.slug}`.
- Do not invent parallel listing routes (`/collections/...`, top-level category pages) without updating this section.

---

## 4. Home Page Data (`features/home`)

Home content is loaded from the backend **`GET /api/v1/home`**.

| Layer | Path | Role |
|---|---|---|
| Fetcher | [`features/home/api/get-home-page.ts`](features/home/api/get-home-page.ts) | `fetchHomePage` via `http.get` from `lib/api-client`; maps payload with [`map-home-page.ts`](features/home/utils/map-home-page.ts) |
| Hook | [`features/home/hooks/useHomePage.ts`](features/home/hooks/useHomePage.ts) | React Query cache — key `["home-page", locale]` |
| Types | [`features/home/types/`](features/home/types/) | API DTOs (`types/api.ts`) + storefront view models (`HeroSlide`, `CategoryItem`, `HomePageData`, …) |

**Consumers (all read the same query — one network call per locale session):**
- [`HeroCarousel`](features/home/components/HeroCarousel.tsx) → `heroes`
- [`CategoriesSection`](features/home/components/CategoriesSection.tsx) → `categories` (home page tiles only)
- [`AdditionalSections`](features/home/components/AdditionalSections.tsx) → `sections` (products grouped by category)
- [`Header`](components/common/Header.tsx) announcement ribbon → **`advertisement_tapes` only** (via `announcementText`); falls back to `Navigation.announcement` i18n when empty

Header / footer **nav category lists** come from [`features/categories`](features/categories/) (`GET /api/v1/categories`), not from this home endpoint.

API product display names: prefer optional `Product.name` from the API; fall back to i18n `Products.{nameKey}` when `name` is absent ([`features/product/types`](features/product/types/index.ts)).

Resolve hero / category / product media with [`resolveImageUrl`](lib/images/resolve-image-url.ts) inside mappers (already done in home mappers).

---

## 4a. Categories (`features/categories`)

Public catalog categories are loaded from **`GET /api/v1/categories`** (paginated; storefront requests `per_page=100`).

| Layer | Path | Role |
|---|---|---|
| Fetcher | [`features/categories/api/get-categories.ts`](features/categories/api/get-categories.ts) | `fetchCategories` via `http.get`; maps with [`map-categories.ts`](features/categories/utils/map-categories.ts) |
| Soft RSC | [`features/categories/utils/get-categories.ts`](features/categories/utils/get-categories.ts) | `getCategories` for shop path resolution / metadata |
| Hook | [`features/categories/hooks/useCategories.ts`](features/categories/hooks/useCategories.ts) | React Query cache — key `["categories", locale]` |
| Href helper | [`features/categories/utils/category-href.ts`](features/categories/utils/category-href.ts) | Unique `/shop/{slug}` per category name (+ id fallback) |

**Consumers (shared query):**
- [`Header`](components/common/Header.tsx) — desktop category tabs + mobile CardNav (Home + All Abayas stay static i18n; other tabs from API names)
- [`Footer`](components/common/Footer.tsx) — Collections column
- [`ShopHero`](features/shop/components/ShopHero.tsx) — category title / image on `/shop/[filter]` when the slug matches an API category

---

## 4a-ii. Shop catalog products (`features/shop`)

All-products PLP (`/shop`) loads from **`GET /api/v1/products`** (paginated; storefront requests `per_page=100`).

| Layer | Path | Role |
|---|---|---|
| Fetcher | [`features/shop/api/get-products.ts`](features/shop/api/get-products.ts) | `fetchProducts` via `http.get` |
| Soft RSC loader | [`features/shop/utils/get-shop-products.ts`](features/shop/utils/get-shop-products.ts) | `getShopProducts` → products + categories; filter by `categoryId` or promo heuristics |
| Path resolver | [`features/shop/utils/resolve-shop-path.ts`](features/shop/utils/resolve-shop-path.ts) | `[filter]` → category / promo / unknown |
| Mapper | [`features/product/utils/map-product.ts`](features/product/utils/map-product.ts) | API → storefront `Product` (`resolveImageUrl`, rating, `categoryId`) |
| Hook | [`features/shop/hooks/useProducts.ts`](features/shop/hooks/useProducts.ts) | React Query — key `["products", locale]`; optional `categoryId` client filter |
| Hero | [`ShopHero`](features/shop/components/ShopHero.tsx) | `/shop` uses home hero image; category routes use category image/name (`useCategories` + RSC) |

`ShopView` awaits `getShopProducts` in RSC; facet filters in `ShopCatalog` remain client-side on the loaded list.

### Product detail (`GET /api/v1/products/{id}`)

PDP stays slug-routed (`/products/[slug]`). Resolve slug via the products list, then load detail (with `ratings[]`) by id.

| Layer | Path | Role |
|---|---|---|
| Fetcher | [`features/product/api/get-product-by-id.ts`](features/product/api/get-product-by-id.ts) | `fetchProductById` → product + mapped reviews |
| Page loader | [`features/product/utils/get-product-page.ts`](features/product/utils/get-product-page.ts) | `getProductPageBySlug` (list match → detail; soft sample fallback) |
| Mapper | [`mapProductDetail`](features/product/utils/map-product.ts) / `mapProductRatings` | `ratings[]` → `ProductReview` (`customer_name` → author, `size` → sizePurchased) |
| UI | [`ProductReviews`](features/product/components/ProductReviews.tsx) | Seeds from API ratings; hero/tabs use `product.rating` / `reviewsCount` |

---

## 4b. App Settings (`features/settings`)

Public boutique settings are loaded from **`GET /api/v1/settings`** (key/value list).

| Layer | Path | Role |
|---|---|---|
| Fetcher | [`features/settings/api/get-settings.ts`](features/settings/api/get-settings.ts) | `fetchSettings` via `http.get`; soft `getSettings` for RSC |
| Hook | [`features/settings/hooks/useSettings.ts`](features/settings/hooks/useSettings.ts) | React Query cache — key `["app-settings"]` |
| Mapper | [`features/settings/utils/map-settings.ts`](features/settings/utils/map-settings.ts) | Key list → `AppSettings`; logos via `resolveImageUrl` |
| Maintenance UI | [`features/settings/components/MaintenancePage.tsx`](features/settings/components/MaintenancePage.tsx) | Full-viewport page when `maintenance_mode` is true |

**Consumers:**
- Locale layout (`app/[locale]/layout.tsx`) — SEO defaults (`meta_title_*`, `meta_description_*`, `meta_keywords`, favicon, Open Graph), **maintenance gate**, currency provider seeds (`default_currency` / `supported_currencies`), Google Analytics (`google_analytics_id`), React Query hydration for settings
- [`proxy.ts`](proxy.ts) — `default_language` drives next-intl `defaultLocale` for unprefixed routes (soft-fail to `ar`)
- [`CurrencyProvider`](hooks/useCurrency.tsx) / [`CurrencyDropdown`](components/common/CurrencyDropdown.tsx) — only list API-supported currencies; default when no localStorage pick
- [`Header`](components/common/Header.tsx) / [`Footer`](components/common/Footer.tsx) — app name, logo, contact (email, phone, WhatsApp, address, map), working hours, social URLs (fallbacks to local assets / i18n when null). Footer **Client Care** / **Atelier** / legal links come from [`usePages`](features/content/hooks/usePages.ts) (`GET /api/v1/pages`), not from settings.

---

## 4c. Currencies (`features/currencies`)

Public storefront currencies, symbols, and exchange rates are loaded from **`GET /api/v1/currencies`**.

| Layer | Path | Role |
|---|---|---|
| Fetcher | [`features/currencies/api/get-currencies.ts`](features/currencies/api/get-currencies.ts) | `fetchCurrencies` via `http.get`; soft `getCurrencies` for RSC |
| Hook | [`features/currencies/hooks/useCurrencies.ts`](features/currencies/hooks/useCurrencies.ts) | React Query cache — key `["currencies", locale]` |
| Types | [`features/currencies/types/`](features/currencies/types/) | API DTOs (`ApiCurrencyItem`) + storefront view model (`Currency`) |
| Mapper | [`features/currencies/utils/map-currencies.ts`](features/currencies/utils/map-currencies.ts) | `mapCurrencies` → parses exchange rates, symbols, codes |
| Dehydration | [`features/currencies/utils/dehydrate-currencies.ts`](features/currencies/utils/dehydrate-currencies.ts) | React Query hydration prefill |

**Consumers:**
- Locale layout (`app/[locale]/layout.tsx`) — RSC prefetch with `getCurrencies(locale)` passed as `initialCurrencies` to `<CurrencyProvider>`
- [`CurrencyProvider`](hooks/useCurrency.tsx) — dynamically merges live API exchange rates and symbols with default fallbacks; computes active currency config and supported currencies
- [`ProductPrice`](features/product/components/ProductPrice.tsx) — converts base TRY product amounts using the dynamic `rateAgainstTRY` and renders appropriate icon / textual symbol
- [`CurrencyDropdown`](components/common/CurrencyDropdown.tsx) — lists all active supported currencies with dynamic symbols and icons

---

## 4d. Addresses (`features/addresses`)

Authenticated address book uses client `http` + bearer token from `useAuth().session` for **list and mutations** against **`/api/v1/addresses`** (list is paginated; storefront requests `per_page=100`). Create/update require `country_id` / `city_id` from public location endpoints.

| Layer | Path | Role |
|---|---|---|
| Client API | [`features/addresses/api/get-addresses.ts`](features/addresses/api/get-addresses.ts) | `fetchAddresses` / create / update / set default / delete via `http` + session token |
| Countries | [`features/addresses/api/get-countries.ts`](features/addresses/api/get-countries.ts) | Public `GET /api/v1/countries` |
| Cities | [`features/addresses/api/get-cities.ts`](features/addresses/api/get-cities.ts) | Public `GET /api/v1/cities?country_id=` |
| Hook | [`features/addresses/hooks/useAddresses.ts`](features/addresses/hooks/useAddresses.ts) | React Query — key `["user-addresses", locale]` |
| Location hooks | `useCountries` / `useCities` | Shared country + city selects |
| Mapper | [`features/addresses/utils/map-address.ts`](features/addresses/utils/map-address.ts) | API `label` → `home` / `work` / `other`; snake_case → camelCase |

**Consumers:**
- [`AddressesList`](features/addresses/components/AddressesList.tsx) — account `/me/addresses`
- [`CheckoutView`](features/checkout/components/CheckoutView.tsx) — shipping address picker + add-address dialog

---

## 5. Images & Media (`lib/images`)

Product and CMS media are hosted on the **same origin as the API** (`API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL`).

| Piece | Purpose |
|---|---|
| [`lib/images/config.ts`](lib/images/config.ts) | Normalized API base for media; `LOCAL_PUBLIC_IMAGE_PREFIXES` (`/imgs/…`) stay local |
| [`lib/images/resolve-image-url.ts`](lib/images/resolve-image-url.ts) | `resolveImageUrl` — default **proxy** mode via `/api/images?src=…` |
| [`app/api/images/route.ts`](app/api/images/route.ts) | Same-origin image proxy (SSRF allowlist from API hostnames) |
| [`next.config.ts`](next.config.ts) | `images.remotePatterns` from API env hostnames |

- Local boutique assets under `public/imgs/` are never proxied.
- Absolute API URLs and `/storage/…` paths go through the proxy (or `mode: "direct"` when intentionally using `remotePatterns`).
- Do **not** hardcode CDN env vars like `NEXT_PUBLIC_IMAGES_BASE_URL` unless reintroduced — media shares the API base.

---

## 6. Installed Packages & Stack Mapping

Before reaching for any new package, **always leverage the already installed libraries**:

| Category | Installed Library | Primary Use Case |
|---|---|---|
| **Styling & Theme** | `tailwindcss` (v4), `tw-animate-css` | Core styling, utility classes, brand tokens (`primary`, `secondary`) |
| **UI Components** | `shadcn`, `@base-ui/react`, `@shadcn/react` | Accessible headless and styled UI components |
| **Animations** | `motion` (`motion/react`) | Fluid transitions, entrance/exit, micro-interactions, layout animations |
| **Icons** | `lucide-react`, `react-icons` | Icons across features |
| **Forms & Validation** | `react-hook-form`, `zod` | Form management and schema validation |
| **Server State & Cache**| `@tanstack/react-query` | Data fetching, caching, optimistic updates, async state |
| **HTTP / API** | [`lib/api-client.ts`](lib/api-client.ts), [`lib/api-server.ts`](lib/api-server.ts) | Typed API requests; server actions + session-aware `serverFetch` |
| **Sliders / Carousels** | `embla-carousel-react` | Product carousels, image galleries, hero sliders |
| **Charts** | `recharts` | Visualizations, admin sales charts, metric dashboards |
| **Date Handling** | `date-fns`, `react-day-picker` | Date formatting, scheduling, date pickers |
| **OTP / Auth Inputs** | `input-otp` | One-time password inputs |
| **Resizable Panels** | `react-resizable-panels` | Split panes, resizable sidebars / inspector panels |
| **Command Menu** | `cmdk` | Quick search palettes, searchable selects |
| **Utilities** | `cn` (or `clsx` + `tailwind-merge` in `lib/utils.ts`), `class-variance-authority` | Class concatenation & variant management |

---

## 7. Strict Package Management Protocol

1. **Check First**: Verify if the requirement can be satisfied using the installed packages listed above or native Web/Next.js/React APIs.
2. **Never Install Blindly**: Do NOT run `npm i` or `npm install` for any new package without consulting the user first.
3. **Ask for Better Alternatives**: If a task would benefit from an uninstalled package (or if an alternative library offers better bundle size, DX, or performance than an existing one), you must:
   - Propose the package to the user.
   - Explain the trade-offs (bundle size, compatibility with Next.js App Router / React 19, maintainability).
   - Wait for user approval before running any installation command.

---

## 8. UI Styling & Color System Rules

- **Zero Hardcoded Hex Codes**: Do **NOT** use raw hex colors (`#...`), arbitrary values (e.g. `bg-[#b4a094]`), or inline styles with hardcoded color values anywhere in UI components.
- **Use Brand & Semantic Tokens from [`app/globals.css`](file:///c:/Loai/work/linen-line-store/app/globals.css)**:
  - **Semantic tokens**: `bg-primary`, `text-primary-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-background`, `text-foreground`, `border-border`, `bg-muted`, `text-muted-foreground`, `bg-card`, `bg-accent`, `ring-ring`.
  - **Status feedback tokens**:
    - **Success** (Herb / Olive): `bg-success`, `text-success`, `text-success-foreground`, `bg-success-muted`.
    - **Warning** (Amber Ochre): `bg-warning`, `text-warning`, `text-warning-foreground`, `bg-warning-muted`.
    - **Error / Destructive** (Rust Terracotta): `bg-error`, `text-error`, `text-error-foreground`, `bg-error-muted` (also mapped to `destructive`).
    - **Info** (River Slate): `bg-info`, `text-info`, `text-info-foreground`, `bg-info-muted`.
  - **Brand shade scales**:
    - Primary scale: `bg-primary-50` through `bg-primary-950` (e.g. `text-primary-700`, `border-primary-200`).
    - Secondary scale: `bg-secondary-50` through `bg-secondary-950` (e.g. `bg-secondary-100`, `text-secondary-800`).
- **Dark Mode Support**: All components must automatically support dark mode by relying strictly on these semantic tokens and classes.

## goey-toast

See `*/skills/goey-toast/SKILL.md` for how to install and use goey-toast (gooey morphing React toasts). Mount `<GooeyToaster />` once and import `'goey-toast/styles.css'` at the app entry.

## wire-api

See [`.cursor/skills/wire-api/SKILL.md`](.cursor/skills/wire-api/SKILL.md) when connecting backend endpoints (Postman / API) into features: `lib/api-client` + React Query hooks + DTO mappers + `resolveImageUrl`.
