"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Check, HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { FaqItem } from "../types";

interface FaqAccordionProps {
  faqs: FaqItem[];
  highlightQuery?: string;
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const t = useTranslations("FAQs");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (faq: FaqItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${faq.question}\n\n${faq.answer}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(faq.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <Accordion className="flex w-full flex-col gap-3.5">
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={`faq-${faq.id}`}
          className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 px-4 shadow-2xs backdrop-blur-xs transition-all duration-200 hover:border-primary/40 hover:bg-card sm:px-6"
        >
          <AccordionTrigger className="group py-4.5 text-start text-base font-semibold text-foreground transition-colors hover:no-underline sm:text-lg">
            <div className="flex items-start gap-3 pe-4">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <HelpCircle className="size-3.5" />
              </span>
              <span className="leading-snug">{faq.question}</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pt-0 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
            {/* Note: As per API contract, answer is strictly plain text (not markdown, not HTML) */}
            <div className="ps-9">
              <p className="whitespace-pre-line text-foreground/85">
                {faq.answer}
              </p>

              <div className="mt-4 flex items-center justify-end border-t border-border/40 pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleCopy(faq, e)}
                  className="h-7 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copiedId === faq.id ? (
                    <>
                      <Check className="size-3.5 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {t("copied")}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>{t("copyQuestion")}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
