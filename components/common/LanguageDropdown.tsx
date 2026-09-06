"use client";

import React, { useTransition } from "react";
import { useLocale } from "next-intl";
import { Globe, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷", dir: "ltr" },
] as const;

export function LanguageDropdown({ className }: { className?: string }) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: (typeof LANGUAGES)[number]["code"]) => {
    if (newLocale === currentLocale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const activeLanguage =
    LANGUAGES.find((lang) => lang.code === currentLocale) || LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            disabled={isPending}
            className={cn(
              "h-8 px-2 text-xs font-medium text-foreground hover:bg-muted hover:text-foreground gap-1.5 transition-colors",
              className,
            )}
          />
        }
      >
        <span className="flex items-center gap-1.5">
          <Globe className="size-3.5 text-muted-foreground" />
          <span
            className={
              activeLanguage.code === "ar" ? "font-noto-arabic" : "font-outfit"
            }
          >
            {activeLanguage.label}
          </span>
        </span>
        <ChevronDown className="size-3 text-muted-foreground transition-transform duration-200" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36 p-1">
        {LANGUAGES.map((lang) => {
          const isSelected = currentLocale === lang.code;
          const isArabic = lang.code === "ar";
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLocaleChange(lang.code)}
              className={cn(
                "flex items-center justify-between text-xs py-1.5 px-2 cursor-pointer rounded-md transition-colors",
                isArabic ? "font-noto-arabic" : "font-outfit",
                isSelected &&
                  "bg-muted font-medium text-primary-800 dark:text-primary-200",
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
              </div>
              {isSelected && (
                <Check className="size-3.5 text-primary-600 dark:text-primary-400" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
