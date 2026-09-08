---
name: create-ui-section-or-page
description: Guide and standard workflow for creating UI pages or sections using the page-shell utility class, global animation wrappers, shadcn tooltips on UI icons, preserving Server Component (RSC) architecture for optimal SEO, and writing formal gender-neutral i18n copy for unknown visitors.
---

# Create UI Section or Page Skill

This skill provides step-by-step instructions and architectural patterns for creating pages or sections in the **Linen Line Store** boutique.

## Core Architectural Principles

1. **Server Components by Default (SEO & Performance)**:
   - Always keep pages (`page.tsx`) and section containers as **Server Components** (do **NOT** add `'use client'` at the page or section level).
   - Render static content, headings, meta tags, and semantic HTML directly on the server for optimal search indexing.
2. **Page Width & Padding with `@utility page-shell`**:
   - Use the `page-shell` Tailwind utility class directly on wrapping container `<div>` or `<section>` tags.
   - It automatically enforces `max-width: var(--page-max-width)` (`90rem`), centered margins (`margin-inline: auto`), and responsive horizontal padding (`px-4 sm:px-6 lg:px-8`).
   - For full-width elements that break out of boundaries (e.g. hero banners or marquee strips), use the `@utility full-bleed` class.
3. **Client-Side Animation Boundaries**:
   - When interactive or viewport animations are required, import animation wrappers from `@/components/animations` (e.g., `<FadeIn />`, `<StaggerContainer />`, `<StaggerItem />`).
   - Wrap only the inner elements that animate. This ensures the enclosing page/section remains a clean React Server Component (RSC).
4. **i18n & Localization**:
   - For Server Components, use `await getTranslations(...)` from `next-intl/server`.
   - Update message keys across `messages/ar.json`, `messages/en.json`, and `messages/tr.json`.
   - **Formal, gender-neutral address (unknown visitors)**: UI copy speaks to an unknown person who may be a man or a woman. Prefer formal tone; never assume feminine (or masculine-only) second-person forms.
     - **Arabic (`ar`)**: Avoid feminine imperatives/endings that address women only (e.g. تتبعي، تسوقي، اكتشفي، أضيفي). Prefer impersonal / verbal-noun CTAs (e.g. تتبع الطلبات، تسوق التشكيلة، اكتشف المجموعة) or neutral noun phrases (e.g. طلباتي، عرض الطلبات). Do not default to feminine boutique address.
     - **English (`en`)**: Use neutral formal phrasing toward the visitor (e.g. "Track your orders", "Shop the collection") rather than gendered or overly casual voice.
     - **Turkish (`tr`)**: Prefer polite formal *siz* where the visitor is addressed (e.g. Siparişlerinizi takip edin), not informal *sen* (e.g. takip et) unless matching an existing casual string in the same surface.
     - Apply this to CTAs, empty states, toasts, tooltips, `aria-label`s, and any new or edited message strings—not only marketing headlines.
5. **Color & Design Tokens**:
   - Strictly use semantic color tokens (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-primary-foreground`, `border-border`, `text-muted-foreground`, etc.).
6. **Tooltips on Small UI Icons & Icon Actions (Accessibility & Clarity)**:
   - Whenever a small icon, icon-only button, badge, or interactive control appears in the UI (e.g., favorite/wishlist, add-to-cart, filter, share, info, quick action):
     - Always wrap it with shadcn **Tooltip** components from `@/components/ui/tooltip` (`<TooltipProvider delay={100}>`, `<Tooltip>`, `<TooltipTrigger>`, `<TooltipContent>`).
     - Always provide localized text inside `<TooltipContent>` and an accessible `aria-label` on the trigger or interactive element.
     - Specify appropriate placement (`side="top" | "bottom" | "inline-start" | "inline-end"`) and `sideOffset={6}`.

---

## Component Pattern / Recipe

### 1. Section Structure (Server Component)

```tsx
import { getTranslations } from "next-intl/server"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"

interface FeaturedSectionProps {
  // props...
}

export async function FeaturedSection({}: FeaturedSectionProps) {
  const t = await getTranslations("HomePage.Featured")

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="page-shell space-y-8">
        {/* Animated Header */}
        <FadeIn direction="up">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t("title")}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
        </FadeIn>

        {/* Animated Grid */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item) => (
            <StaggerItem key={item.id}>
              {/* Product Card or content */}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
```

### 2. Page Structure (`app/[locale]/.../page.tsx`)

```tsx
import { setRequestLocale } from "next-intl/server"
import { Metadata } from "next"
import { FeaturedSection } from "@/features/featured/components/FeaturedSection"

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  // generate SEO metadata...
  return {
    title: "...",
  }
}

export default async function CustomPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <main className="min-h-screen py-8">
      {/* Sections composed with page-shell */}
      <FeaturedSection />
    </main>
  )
}
```

### 3. Small Icon Tooltip Pattern (shadcn Tooltip)

Whenever an icon-only button, small icon, or quick action appears in UI cards, headers, or interactive toolbars:

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Heart } from "lucide-react"

// Inside client component or interactive card:
<TooltipProvider delay={100}>
  <Tooltip>
    <TooltipTrigger
      type="button"
      aria-label={t("favorites")}
      className="flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
      onClick={handleToggleFavorite}
    >
      <Heart className="size-4 sm:size-5" />
    </TooltipTrigger>
    <TooltipContent side="top" sideOffset={6} className="text-xs font-medium">
      {t("favorites")}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

When rendering an existing interactive link or button primitive, use the `render` prop on `TooltipTrigger`:

```tsx
<Tooltip>
  <TooltipTrigger
    render={
      <Link
        href="/cart"
        aria-label={t("cart")}
        className="flex size-9 items-center justify-center rounded-lg hover:bg-muted"
      />
    }
  >
    <ShoppingBasket className="size-5" />
  </TooltipTrigger>
  <TooltipContent side="bottom" sideOffset={6} className="text-xs font-medium">
    {t("cart")}
  </TooltipContent>
</Tooltip>
```

---

## Summary of Global Utilities & Helpers

- **CSS Utility**: `page-shell` (in `app/globals.css`)
- **Full Bleed Utility**: `full-bleed` (in `app/globals.css`)
- **Animation Wrappers**: `@/components/animations` (`<FadeIn />`, `<StaggerContainer />`, `<StaggerItem />`)
- **Icon Tooltips**: `@/components/ui/tooltip` (`<TooltipProvider />`, `<Tooltip />`, `<TooltipTrigger />`, `<TooltipContent />`)
- **Copy voice**: Formal + gender-neutral for unknown visitors (`ar` / `en` / `tr` — see i18n principle above)
