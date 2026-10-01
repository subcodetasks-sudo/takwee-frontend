"use client";

import { useTranslations } from "next-intl";
import { Mail, PhoneCall, Sparkles } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSettings } from "@/features/settings";

export function FaqContactCTA() {
  const t = useTranslations("FAQs");
  const { contactEmail, contactPhone, whatsappUrl } = useSettings();

  const finalWhatsappUrl =
    whatsappUrl ||
    (contactPhone ? `https://wa.me/${contactPhone.replace(/\D/g, "")}` : null);

  return (
    <div className="relative mt-12 overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-background p-6 text-center shadow-sm sm:p-10">
      <div
        className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-primary/15 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 size-40 rounded-full bg-secondary/15 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-xl">
        <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-xs">
          <Sparkles className="size-6" />
        </div>

        <h3 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          {t("stillHaveQuestions")}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("stillHaveQuestionsDesc")}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {finalWhatsappUrl ? (
            <a
              href={finalWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default" }),
                "gap-2 rounded-xl bg-emerald-600 px-5 text-white shadow-xs hover:bg-emerald-700",
              )}
            >
              <SiWhatsapp className="size-4" />
              <span>{t("chatWhatsapp")}</span>
            </a>
          ) : null}

          {contactEmail ? (
            <a
              href={`mailto:${contactEmail}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "gap-2 rounded-xl border-border/80 bg-background/80 hover:bg-background",
              )}
            >
              <Mail className="size-4 text-primary" />
              <span>{t("emailConcierge")}</span>
            </a>
          ) : null}

          {contactPhone ? (
            <a
              href={`tel:${contactPhone}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "gap-2 rounded-xl hover:bg-muted",
              )}
            >
              <PhoneCall className="size-4 text-muted-foreground" />
              <span dir="ltr">{contactPhone}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
