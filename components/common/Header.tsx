"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Heart, ShoppingBag, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { SearchBar } from "./SearchBar";
import { MobileNav } from "./MobileNav";
import { CurrencyDropdown } from "./CurrencyDropdown";
import { LanguageDropdown } from "./LanguageDropdown";
import TextLoop from "@/components/TextLoop";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const slideTransition = { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

export function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const [hidden, setHidden] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mainBarH, setMainBarH] = useState(0);
  const mainBarRef = useRef<HTMLDivElement>(null);

  // Mock counters for Cart & Favorites (ready for Cart / Wishlist feature hooks)
  const cartItemCount = 2;
  const favoriteItemCount = 3;

  const navLinks = [
    { href: "/new-in", label: t("newArrivals"), badge: "New", highlight: true },
    { href: "/abayas", label: t("allAbayas") },
    { href: "/linen-collection", label: t("linenCollection") },
    { href: "/casual", label: t("casualAbayas") },
    { href: "/formal", label: t("formalAbayas") },
    { href: "/travel", label: t("travelAbayas") },
    { href: "/inners", label: t("dressesAndInners") },
    { href: "/accessories", label: t("accessories") },
    { href: "/sale", label: t("sale"), highlight: true },
  ];

  useLayoutEffect(() => {
    const el = mainBarRef.current;
    if (!el) return;

    const measure = () => setMainBarH(el.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobileSearchOpen]);

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      if (isMenuOpen) {
        setHidden(false);
        return;
      }

      const currentScrollY = window.scrollY;
      const diff = currentScrollY - previousScrollY;

      if (currentScrollY > 80 && diff > 5) {
        setHidden(true);
        setIsMobileSearchOpen(false);
      } else if (diff < -5 || currentScrollY <= 80) {
        setHidden(false);
      }

      previousScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Always pinned */}
      <div className="relative z-20 w-full overflow-hidden border-b border-border/40 bg-secondary">
        <TextLoop
          key={`${locale}-${t("announcement")}`}
          text={t("announcement")}
          dir={locale === "ar" ? "rtl" : "ltr"}
          shape="line"
          separator="❖"
          speed={35}
          fontSize={12}
          fontWeight={600}
          letterSpacing={1.5}
          ribbon={false}
          color="currentColor"
          className="text-white dark:text-secondary-300 bg-secondary"
        />
      </div>

      {/* Only the main bar (logo / search / actions) slides away */}
      <motion.div
        ref={mainBarRef}
        className="relative z-0 w-full border-b border-border/70 bg-background/95 backdrop-blur-md"
        initial={false}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={slideTransition}
        style={{ pointerEvents: hidden ? "none" : "auto" }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-6">
            <div className="flex items-center min-[1117px]:hidden">
              <MobileNav
                navLinks={navLinks}
                cartCount={cartItemCount}
                favCount={favoriteItemCount}
                onMenuOpenChange={(open) => {
                  setIsMenuOpen(open);
                  if (open) setHidden(false);
                }}
              />
            </div>

            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none transition-transform active:scale-95 shrink-0"
              aria-label="Linen Line Home"
            >
              <div className="relative h-9 sm:h-12 w-auto flex items-center justify-center">
                <Image
                  src="/imgs/logo-2.webp"
                  alt="Linen Line Store Logo"
                  width={150}
                  height={56}
                  priority
                  className="h-8 sm:h-11 w-auto object-contain transition-transform duration-300"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-heading font-bold text-base sm:text-lg tracking-wider text-foreground uppercase group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  Linen Line
                </span>
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase -mt-0.5 font-medium">
                  Abaya Boutique
                </span>
              </div>
            </Link>

            <div className="hidden min-[1117px]:flex flex-1 max-w-md mx-4 lg:mx-8">
              <SearchBar />
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden min-[1117px]:flex items-center gap-1 border-e border-border/80 pe-2 me-1">
                <CurrencyDropdown />
                <LanguageDropdown />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="min-[1117px]:hidden size-9 text-foreground hover:bg-muted"
                aria-label={t("searchButton")}
              >
                {isMobileSearchOpen ? (
                  <X className="size-5" />
                ) : (
                  <Search className="size-5" />
                )}
              </Button>

              <Link
                href="/favorites"
                className="relative flex items-center justify-center size-9 sm:size-10 rounded-lg hover:bg-muted text-foreground hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                aria-label={t("favorites")}
              >
                <Heart className="size-5 transition-transform group-hover:scale-110" />
                {favoriteItemCount > 0 && (
                  <span className="absolute -top-1 -end-1 flex items-center justify-center size-4 sm:size-4.5 rounded-full bg-primary-600 text-white text-[10px] font-bold shadow-xs">
                    {favoriteItemCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative flex items-center justify-center size-9 sm:size-10 rounded-lg bg-primary-50 dark:bg-primary-950/50 hover:bg-primary-100 dark:hover:bg-primary-900/60 text-primary-900 dark:text-primary-100 border border-primary-200/60 dark:border-primary-800/40 transition-all hover:shadow-xs"
                aria-label={t("cart")}
              >
                <ShoppingBag className="size-5 text-primary-800 dark:text-primary-200" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -end-1.5 flex items-center justify-center min-w-4 h-4 sm:min-w-4.5 sm:h-4.5 px-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {isMobileSearchOpen && (
            <div className="min-[1117px]:hidden pb-3 pt-1 border-t border-border animate-in fade-in-50 duration-150">
              <SearchBar
                isMobile
                onSearchSubmit={() => setIsMobileSearchOpen(false)}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Nav stays visible — rises under the TextLoop when the main bar hides */}
      <motion.nav
        initial={false}
        animate={{ y: hidden ? -mainBarH : 0 }}
        transition={slideTransition}
        className={cn(
          "relative z-10 hidden min-[1117px]:flex items-center justify-center gap-1 lg:gap-3",
          "py-2.5 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none",
          "border-b border-border/70 bg-background/95 backdrop-blur-md",
        )}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "relative text-xs lg:text-sm font-medium px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap group",
              link.highlight
                ? "text-primary-800 dark:text-primary-300 font-semibold hover:bg-primary-50 dark:hover:bg-primary-950/40"
                : "text-foreground/80 hover:text-foreground hover:bg-muted/70",
            )}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              {link.label}
              {link.badge && (
                <Badge
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 h-3.5 leading-none font-semibold uppercase tracking-wider"
                >
                  {link.badge}
                </Badge>
              )}
            </span>
            <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
          </Link>
        ))}
      </motion.nav>
    </header>
  );
}
