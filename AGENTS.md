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
  - **Product Types**: Abayas (e.g., Casual, Formal/Event, Travel, Embroidered, Silk/Linen Blends), matching Sheilas/Hijabs, inner dresses, and accessories.
  - **Attributes & Filters**: Fabric/Material (Pure Linen, Crepe, Silk, Cotton blends), Cuts & Silhouettes (A-Line, Butterfly/Farasha, Classic, Kimono/Open front, Cloche), Sizes (standard abaya lengths e.g., 52, 54, 56, 58, 60, bust width/custom sizing), Colorways (natural earth tones, classic black, olive, sand, neutrals).
  - **Cultural & Localization**: Primary focus on Middle Eastern / GCC, Turkish, and regional modest fashion markets with seamless trilingual support: **Arabic (`ar` - RTL, default)**, **English (`en` - LTR)**, and **Turkish (`tr` - LTR)**. Default currency is set to **Turkish Lira (TRY / ₺)** (with support for localized currencies like SAR, AED, USD, etc.).
  - **i18n & Font System**:
    - Supported locales: `ar`, `en`, `tr` (configured in [`i18n/routing.ts`](file:///c:/Loai/work/linen-line-store/i18n/routing.ts)).
    - Message catalogs: All new UI strings must be provided in [`messages/ar.json`](file:///c:/Loai/work/linen-line-store/messages/ar.json), [`messages/en.json`](file:///c:/Loai/work/linen-line-store/messages/en.json), and [`messages/tr.json`](file:///c:/Loai/work/linen-line-store/messages/tr.json).
    - Typography: `Noto_Sans_Arabic` for Arabic (`font-noto-arabic`), `Outfit` (with `latin` and `latin-ext` subsets) for English & Turkish (`font-outfit`).

## 1. Feature-Driven Architecture (Feature-Sliced / Modular)

All business features must be organized by domain inside `features/<feature-name>/`:

```
features/
  ├── [feature-name]/
  │   ├── components/         # Feature-specific UI components
  │   ├── hooks/              # Feature-specific hooks & state logic
  │   ├── api/                # API calls, fetchers, server actions, mutation hooks
  │   ├── types/              # Feature-specific TypeScript interfaces & schemas
  │   ├── utils/              # Feature-specific helpers
  │   └── index.ts            # Public barrel export for the feature
```

### Shared / Global Code Rules
- **`app/`**: Only routing, page entries, layouts, and route handlers. Keep page files thin; compose them from feature modules (e.g. `<CartDrawer />`, `<ProductDetails />`).
- **`components/ui/`**: Base atomic design system / shadcn primitives (`button`, `dialog`, `input`, etc.). Do not put domain logic here.
- **`components/common/`**: Shared non-domain components (e.g. `<Header />`, `<Footer />`, `<Navbar />`, `<Logo />`).
- **`lib/`**: Global utility functions, shared clients, and core config (e.g. `lib/utils.ts`).
- **`hooks/`**: Global reusable hooks (e.g. `useMediaQuery`, `useDebounce`).

---

## 2. Installed Packages & Stack Mapping

Before reaching for any new package, **always leverage the already installed libraries**:

| Category | Installed Library | Primary Use Case |
|---|---|---|
| **Styling & Theme** | `tailwindcss` (v4), `tw-animate-css` | Core styling, utility classes, brand tokens (`primary`, `secondary`) |
| **UI Components** | `shadcn`, `@base-ui/react`, `@shadcn/react` | Accessible headless and styled UI components |
| **Animations** | `motion` (`motion/react`) | Fluid transitions, entrance/exit, micro-interactions, layout animations |
| **Icons** | `lucide-react`, `react-icons` | Icons across features |
| **Forms & Validation** | `react-hook-form`, `zod` | Form management and schema validation |
| **Server State & Cache**| `@tanstack/react-query` | Data fetching, caching, optimistic updates, async state |
| **Sliders / Carousels** | `embla-carousel-react` | Product carousels, image galleries, hero sliders |
| **Charts** | `recharts` | Visualizations, admin sales charts, metric dashboards |
| **Date Handling** | `date-fns`, `react-day-picker` | Date formatting, scheduling, date pickers |
| **OTP / Auth Inputs** | `input-otp` | One-time password inputs |
| **Resizable Panels** | `react-resizable-panels` | Split panes, resizable sidebars / inspector panels |
| **Command Menu** | `cmdk` | Quick search palettes, searchable selects |
| **Utilities** | `cn` (or `clsx` + `tailwind-merge` in `lib/utils.ts`), `class-variance-authority` | Class concatenation & variant management |

---

## 3. Strict Package Management Protocol

1. **Check First**: Verify if the requirement can be satisfied using the installed packages listed above or native Web/Next.js/React APIs.
2. **Never Install Blindly**: Do NOT run `npm i` or `npm install` for any new package without consulting the user first.
3. **Ask for Better Alternatives**: If a task would benefit from an uninstalled package (or if an alternative library offers better bundle size, DX, or performance than an existing one), you must:
   - Propose the package to the user.
   - Explain the trade-offs (bundle size, compatibility with Next.js App Router / React 19, maintainability).
   - Wait for user approval before running any installation command.

---

## 4. UI Styling & Color System Rules

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


