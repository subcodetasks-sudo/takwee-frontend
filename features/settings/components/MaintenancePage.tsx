"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Mail, Clock3 } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import type { AppSettings } from "../types";
import { whatsappHref } from "../utils/map-settings";

type MaintenancePageProps = {
  settings: AppSettings;
};

/**
 * Full-viewport maintenance experience shown when `maintenance_mode` is enabled.
 * Mounted from the locale layout (no Header / Footer chrome).
 */
export function MaintenancePage({ settings }: MaintenancePageProps) {
  const t = useTranslations("MaintenancePage");
  const whatsappUrl = whatsappHref(settings.contactWhatsapp);
  const email = settings.contactEmail;
  const logoSrc = settings.siteLogo || "/imgs/logo.webp";
  const brandName = settings.appName || "Takween";

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-background text-foreground">
      {/* Atmospheric plane */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_55%),radial-gradient(ellipse_at_90%_100%,color-mix(in_oklab,var(--secondary)_22%,transparent),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] dark:opacity-[0.2] [background-image:linear-gradient(color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_oklab,var(--foreground)_6%,transparent)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
      />

      <div className="page-shell relative z-10 flex flex-1 flex-col justify-center py-16 sm:py-24">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-8 h-12 w-auto sm:h-14">
              <Image
                src={logoSrc}
                alt={brandName}
                width={180}
                height={64}
                priority
                className="h-12 w-auto object-contain sm:h-14"
                draggable={false}
              />
            </div>

            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground sm:text-xs">
              {brandName}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.15,
              duration: 0.7,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="relative mt-10 flex size-24 items-center justify-center sm:mt-12 sm:size-28"
            aria-hidden
          >
            <span className="absolute inset-0 rounded-full border border-primary/25" />
            <motion.span
              className="absolute inset-2 rounded-full border border-dashed border-secondary/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            />
            <motion.span
              className="absolute inset-5 rounded-full bg-primary/10 dark:bg-primary/20"
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <Clock3 className="relative size-9 text-primary sm:size-10" strokeWidth={1.25} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.28,
              duration: 0.55,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="mt-10 space-y-4 sm:mt-12"
          >
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {t("title")}
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("description")}
            </p>
          </motion.div>

          {(whatsappUrl || email) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.42,
                duration: 0.5,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="mt-10 flex w-full max-w-md flex-col gap-3 sm:mt-12"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {t("contactHint")}
              </p>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-center">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-secondary px-5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary-600 sm:flex-1"
                  >
                    <SiWhatsapp className="size-4 shrink-0" aria-hidden />
                    {t("whatsapp")}
                  </a>
                ) : null}
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:flex-1"
                  >
                    <Mail className="size-4 shrink-0" aria-hidden />
                    {t("email")}
                  </a>
                ) : null}
              </div>
            </motion.div>
          )}

          {settings.workingHours ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.45 }}
              className="mt-8 text-xs text-muted-foreground"
            >
              {t("hoursLabel")}: {settings.workingHours}
            </motion.p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
