"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { HelpCircle, SearchX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaqHero } from "./FaqHero";
import { FaqAccordion } from "./FaqAccordion";
import { FaqSkeleton } from "./FaqSkeleton";
import { FaqContactCTA } from "./FaqContactCTA";
import { useFaqs } from "../hooks/useFaqs";
import type { FaqItem } from "../types";

interface FaqViewProps {
  initialFaqs?: FaqItem[];
}

export function FaqView({ initialFaqs }: FaqViewProps) {
  const t = useTranslations("FAQs");
  const { faqs, isLoading } = useFaqs(initialFaqs);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const q = searchQuery.toLowerCase().trim();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q),
    );
  }, [faqs, searchQuery]);

  return (
    <div className="min-h-screen pb-20">
      <FaqHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={faqs.length}
      />

      <div className="container mx-auto max-w-4xl px-4 pt-10 sm:px-6">
        {isLoading && !faqs.length ? (
          <FaqSkeleton />
        ) : faqs.length === 0 ? (
          /* Empty Catalog State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/50 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <HelpCircle className="size-7" />
            </div>
            <h2 className="mt-4 font-heading text-lg font-bold text-foreground sm:text-xl">
              {t("noFaqsTitle")}
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {t("noFaqsSubtitle")}
            </p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          /* Empty Search Results State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-card/50 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <SearchX className="size-7" />
            </div>
            <h2 className="mt-4 font-heading text-lg font-bold text-foreground sm:text-xl">
              {t("noSearchResultsTitle")}
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {t("noSearchResultsSubtitle")}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="mt-6 gap-2 rounded-xl"
            >
              <RotateCcw className="size-4" />
              <span>{t("resetSearch")}</span>
            </Button>
          </div>
        ) : (
          /* FAQ Accordion List */
          <FaqAccordion faqs={filteredFaqs} highlightQuery={searchQuery} />
        )}

        {/* Contact Concierge CTA */}
        <FaqContactCTA />
      </div>
    </div>
  );
}
