---
name: create-ui-section-or-page
description: Guide and standard workflow for creating UI pages or sections using the page-shell utility class, global animation wrappers, and preserving Server Component (RSC) architecture for optimal SEO.
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
5. **Color & Design Tokens**:
   - Strictly use semantic color tokens (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-primary-foreground`, `border-border`, `text-muted-foreground`, etc.).

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

---

## Summary of Global Utilities & Helpers

- **CSS Utility**: `page-shell` (in `app/globals.css`)
- **Full Bleed Utility**: `full-bleed` (in `app/globals.css`)
- **Animation Wrappers**: `@/components/animations` (`<FadeIn />`, `<StaggerContainer />`, `<StaggerItem />`)
