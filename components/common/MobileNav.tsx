"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Heart, ShoppingBag, X } from "lucide-react";
import { TbCurrencyLira } from "react-icons/tb";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { SearchBar } from "./SearchBar";
import { useCurrency, type CurrencyCode, CURRENCY_CONFIGS } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  navLinks: { href: string; label: string; badge?: string; highlight?: boolean }[];
  cartCount?: number;
  favCount?: number;
  onMenuOpenChange?: (open: boolean) => void;
}

const CURRENCIES: { code: CurrencyCode; hasLiraIcon?: boolean }[] = [
  { code: "TRY", hasLiraIcon: true },
  { code: "SAR" },
  { code: "AED" },
  { code: "USD" },
  { code: "QAR" },
  { code: "KWD" },
];

export function MobileNav({
  navLinks,
  cartCount = 0,
  favCount = 0,
  onMenuOpenChange,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Navigation");
  const tCurr = useTranslations("Currencies");
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onMenuOpenChange?.(next);
  };

  const handleLocaleSwitch = (locale: "ar" | "en" | "tr") => {
    if (locale === currentLocale) return;
    router.replace(pathname, { locale });
    handleOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="min-[1117px]:hidden size-9 text-foreground hover:bg-muted"
            aria-label={t("menu")}
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>

      <SheetContent
        side={currentLocale === "ar" ? "right" : "left"}
        className="w-[85vw] max-w-sm p-0 flex flex-col bg-card border-border overflow-y-auto"
      >
        <SheetHeader className="p-4 pb-2 border-b border-border flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-auto flex items-center justify-center">
              <Image
                src="/imgs/logo-2.webp"
                alt="Linen Line"
                width={100}
                height={36}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold tracking-tight">
                {t("home")}
              </SheetTitle>
              <p className="text-xs text-muted-foreground">Linen Line Boutique</p>
            </div>
          </div>
        </SheetHeader>

        {/* Mobile Search */}
        <div className="p-4 pb-2">
          <SearchBar isMobile onSearchSubmit={() => setOpen(false)} />
        </div>

        {/* Mobile Navigation Links */}
        <nav className="flex-1 px-4 py-2 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium transition-colors hover:bg-muted",
                link.highlight
                  ? "text-primary-800 dark:text-primary-300 font-semibold bg-primary-50/50 dark:bg-primary-950/20"
                  : "text-foreground"
              )}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Preferences (Currency & Language) */}
        <div className="p-4 border-t border-border bg-muted/30 flex flex-col gap-3">
          {/* Quick Stats/Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted transition-colors"
            >
              <Heart className="size-4 text-primary-600 dark:text-primary-400" />
              <span>{t("favorites")}</span>
              {favCount > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {favCount}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted transition-colors"
            >
              <ShoppingBag className="size-4 text-secondary-600 dark:text-secondary-400" />
              <span>{t("cart")}</span>
              {cartCount > 0 && (
                <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Language Switch */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground font-medium">{t("language")}</span>
            <div className="flex items-center gap-1">
              <Button
                variant={currentLocale === "ar" ? "secondary" : "ghost"}
                size="xs"
                onClick={() => handleLocaleSwitch("ar")}
                className="text-xs font-medium font-noto-arabic"
              >
                العربية
              </Button>
              <Button
                variant={currentLocale === "en" ? "secondary" : "ghost"}
                size="xs"
                onClick={() => handleLocaleSwitch("en")}
                className="text-xs font-medium font-outfit"
              >
                English
              </Button>
              <Button
                variant={currentLocale === "tr" ? "secondary" : "ghost"}
                size="xs"
                onClick={() => handleLocaleSwitch("tr")}
                className="text-xs font-medium font-outfit"
              >
                Türkçe
              </Button>
            </div>
          </div>

          {/* Currency Switch */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <TbCurrencyLira className="size-3.5 text-primary-600" />
              {t("currency")}
            </span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="text-xs bg-background border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {CURRENCIES.map(({ code }) => (
                <option key={code} value={code}>
                  {code} - {CURRENCY_CONFIGS[code].symbol}
                </option>
              ))}
            </select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
