"use client";

import { useTranslations } from "next-intl";
import { Search, X, HelpCircle, ChevronRight, Home } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FaqHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
}

export function FaqHero({
  searchQuery,
  onSearchChange,
  totalCount,
}: FaqHeroProps) {
  const t = useTranslations("FAQs");

  return (
    <section className="relative overflow-hidden border-b border-border/60 bg-linear-to-b from-primary/5 via-background to-background pt-8 pb-12 sm:pt-12 sm:pb-16">
      {/* Decorative background glows */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-[280px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-12 start-8 -z-10 size-64 rounded-full bg-secondary/20 blur-2xl"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm"
        >
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Home className="size-3.5" />
            <span>{t("breadcrumbHome")}</span>
          </Link>
          <ChevronRight className="size-3.5 rtl:rotate-180" />
          <span className="font-medium text-foreground">
            {t("breadcrumbFaq")}
          </span>
        </nav>

        {/* Badge & Title */}
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary shadow-xs"
          >
            <HelpCircle className="size-3.5" />
            <span>{t("heroBadge")}</span>
          </Badge>

          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>

          <p className="mt-3.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
            {t("subtitle")}
          </p>

          {/* Search bar */}
          <div className="relative mt-8 w-full max-w-xl">
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute start-3.5 size-4.5 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="h-12 w-full rounded-2xl border-border/80 bg-background/90 ps-10.5 pe-10 text-sm shadow-xs backdrop-blur-xs transition-all focus-visible:border-primary focus-visible:ring-primary/20 sm:text-base"
              />
              {searchQuery ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onSearchChange("")}
                  className="absolute end-2 size-8 rounded-full text-muted-foreground hover:text-foreground"
                  aria-label={t("clearSearch")}
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </div>

            {totalCount > 0 && !searchQuery ? (
              <div className="mt-2 text-center text-xs text-muted-foreground">
                {t("totalQuestions", { count: totalCount })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
