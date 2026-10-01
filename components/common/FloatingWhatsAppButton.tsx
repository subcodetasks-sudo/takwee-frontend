"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import { SiWhatsapp } from "react-icons/si";
import { motion } from "motion/react";
import { useSettings } from "@/features/settings";
import { whatsappHref } from "@/features/settings/utils/map-settings";
import { cn } from "@/lib/utils";

interface FloatingWhatsAppButtonProps {
  className?: string;
}

export function FloatingWhatsAppButton({ className }: FloatingWhatsAppButtonProps) {
  const t = useTranslations("Footer");
  const { contactWhatsapp, contactPhone } = useSettings();

  const href = useMemo(() => {
    return whatsappHref(contactWhatsapp) || whatsappHref(contactPhone);
  }, [contactWhatsapp, contactPhone]);

  if (!href) {
    return null;
  }

  const label = t("concierge.whatsapp");

  return (
    <motion.aside
      initial={{ opacity: 0, scale: 0.8, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "fixed bottom-6 end-6 z-40 flex items-center print:hidden select-none",
        className,
      )}
      aria-label={label}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={cn(
          "group relative flex size-13 sm:size-14 items-center justify-center rounded-full",
          "bg-[#25D366] text-white shadow-lg shadow-[#25D366]/35",
          "hover:bg-[#20bd5a] hover:shadow-xl hover:shadow-[#25D366]/45 hover:scale-105 active:scale-95",
          "transition-all duration-200 ease-out",
          "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        {/* WhatsApp Icon */}
        <SiWhatsapp className="size-7 sm:size-7.5 drop-shadow-xs transition-transform duration-200 group-hover:scale-110" />

        {/* Hover Tooltip / Floating Label */}
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute end-full me-3 whitespace-nowrap rounded-xl",
            "bg-foreground text-background dark:bg-card dark:text-foreground dark:border dark:border-border/80",
            "px-3.5 py-1.5 text-xs font-semibold shadow-md",
            "opacity-0 -translate-x-2 rtl:translate-x-2 transition-all duration-200 ease-out",
            "group-hover:opacity-100 group-hover:translate-x-0 rtl:group-hover:translate-x-0",
          )}
        >
          {label}
        </span>
      </a>
    </motion.aside>
  );
}
