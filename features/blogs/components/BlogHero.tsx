"use client";

import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface BlogHeroProps {
  categories: string[];
}

export function BlogHero({ categories }: BlogHeroProps) {
  const t = useTranslations("Blogs");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category");

  const [localSearch, setLocalSearch] = useState(currentSearch);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }
      params.delete("page"); // Reset page on search
      
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    }
  }, [debouncedSearch, currentSearch, pathname, router, searchParams]);

  const handleCategorySelect = (cat: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat) {
      params.set("category", cat);
    } else {
      params.delete("category");
    }
    params.delete("page"); // Reset page on category change

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-primary/5 via-background to-card p-6 md:p-12 text-center shadow-sm">
      {/* Background Decorative Elements */}
      <div
        className="pointer-events-none absolute -top-24 -start-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -end-24 h-64 w-64 rounded-full bg-secondary/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-2xl space-y-4">
        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
          {t("title")}
        </h1>

        {/* Search Input */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="ps-10 pe-10 h-11 bg-background/80 backdrop-blur border-border/70 rounded-full text-sm shadow-sm focus-visible:ring-primary"
            />
            {localSearch && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setLocalSearch("")}
                className="absolute end-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                aria-label={t("clearSearch")}
                disabled={isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleCategorySelect(null)}
              disabled={isPending}
              className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                !currentCategory
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t("allCategories")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                disabled={isPending}
                onClick={() =>
                  handleCategorySelect(cat === currentCategory ? null : cat)
                }
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                  currentCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
