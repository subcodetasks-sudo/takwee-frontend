"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Heart, ShoppingBasket, Search, X, User } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchBar } from "./SearchBar";
import CardNav, { type CardNavItem } from "@/components/CardNav";
import { CurrencyDropdown } from "./CurrencyDropdown";
import { LanguageDropdown } from "./LanguageDropdown";
import TextLoop from "@/components/TextLoop";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth";
import { useWishlist } from "@/features/wishlist/hooks/useWishlist";
import { useCart, useCartFly } from "@/features/cart";
import { cn } from "@/lib/utils";

const slideTransition = { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };
/** Matches `min-[1117px]` — when the desktop category nav is shown. */
const DESKTOP_NAV_BREAKPOINT = 1117;

export function Header() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const { isAuthenticated } = useAuth();
  const { itemCount: favoriteItemCount, isHydrated: isWishlistHydrated } =
    useWishlist();
  const { itemCount: cartItemCount, isHydrated: isCartHydrated } = useCart();
  const { registerCartTarget, pulseToken } = useCartFly();
  const [hidden, setHidden] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopNav, setIsDesktopNav] = useState(false);

  const showFavoriteCount = isWishlistHydrated && favoriteItemCount > 0;
  const showCartCount = isCartHydrated && cartItemCount > 0;

  // Desktop: hide category nav. Mobile: hide main bar. Same slide as before.
  const hideMainBar = hidden && !isDesktopNav;
  const hideCategoryNav = hidden && isDesktopNav;

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/shop/new-in", label: t("newArrivals"), badge: "New", highlight: true },
    { href: "/shop", label: t("allAbayas") },
    { href: "/shop/linen", label: t("linenCollection") },
    { href: "/shop/casual", label: t("casualAbayas") },
    { href: "/shop/formal", label: t("formalAbayas") },
    { href: "/shop/travel", label: t("travelAbayas") },
    { href: "/shop/inners", label: t("dressesAndInners") },
    { href: "/shop/accessories", label: t("accessories") },
    { href: "/shop/sale", label: t("sale"), highlight: true },
  ];

  const mobileNavCards = React.useMemo<CardNavItem[]>(
    () => [
      {
        label: t("navExplore"),
        className: "bg-primary text-primary-foreground",
        links: [
          { label: t("home"), href: "/", ariaLabel: t("home") },
          { label: t("newArrivals"), href: "/shop/new-in", ariaLabel: t("newArrivals") },
          { label: t("allAbayas"), href: "/shop", ariaLabel: t("allAbayas") },
          { label: t("linenCollection"), href: "/shop/linen", ariaLabel: t("linenCollection") },
          { label: t("sale"), href: "/shop/sale", ariaLabel: t("sale") },
        ],
      },
      {
        label: t("navCategories"),
        className: "bg-secondary text-secondary-foreground",
        links: [
          { label: t("casualAbayas"), href: "/shop/casual", ariaLabel: t("casualAbayas") },
          { label: t("formalAbayas"), href: "/shop/formal", ariaLabel: t("formalAbayas") },
          { label: t("travelAbayas"), href: "/shop/travel", ariaLabel: t("travelAbayas") },
          { label: t("dressesAndInners"), href: "/shop/inners", ariaLabel: t("dressesAndInners") },
          { label: t("accessories"), href: "/shop/accessories", ariaLabel: t("accessories") },
        ],
      },
    ],
    [t],
  );

  useEffect(() => {
    const mql = window.matchMedia(
      `(min-width: ${DESKTOP_NAV_BREAKPOINT}px)`,
    );
    const onChange = () => setIsDesktopNav(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      // Keep chrome pinned while menu or mobile search is open —
      // focusing/expanding search often nudges scrollY on mobile and would
      // otherwise trigger the hide/show animation.
      if (isMenuOpen || isMobileSearchOpen) {
        setHidden(false);
        previousScrollY = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const diff = currentScrollY - previousScrollY;

      if (currentScrollY > 80 && diff > 5) {
        setHidden(true);
      } else if (diff < -5 || currentScrollY <= 80) {
        setHidden(false);
      }

      previousScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen, isMobileSearchOpen]);

  return (
    <header
      className={cn("sticky top-0 z-40 w-full", isMenuOpen && "z-[70]")}
    >
      {/* Always pinned */}
      <div className="relative z-20 w-full overflow-hidden border-b border-border/40 bg-secondary">
        <TextLoop
          key={`${locale}-${t("announcement")}`}
          text={t("announcement")}
          dir={locale === "ar" ? "rtl" : "ltr"}
          shape="line"
          separator="❖"
          speed={35}
          fontSize={11}
          fontWeight={600}
          letterSpacing={1.25}
          ribbon={false}
          color="currentColor"
          className="bg-secondary py-1 text-white dark:text-secondary-300"
        />
      </div>

      {/* Mobile: main bar slides under TextLoop (old animation). Desktop: stays pinned. */}
      <motion.div
        className="relative z-10 w-full border-b border-border/70 bg-background/95 backdrop-blur-md"
        initial={false}
        animate={{ y: hideMainBar ? "-100%" : "0%" }}
        transition={slideTransition}
        style={{ pointerEvents: hideMainBar ? "none" : "auto" }}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-2 sm:h-18 sm:gap-6 md:h-20">
            <div className="flex items-center min-[1117px]:hidden">
              <CardNav
                items={mobileNavCards}
                onOpenChange={(open) => {
                  setIsMenuOpen(open);
                  if (open) setHidden(false);
                }}
              />
            </div>

            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 transition-transform focus:outline-none active:scale-95 group sm:gap-3"
              aria-label="Linen Line Home"
            >
              <div className="relative flex h-7 w-auto items-center justify-center sm:h-12">
                <Image
                  src="/imgs/logo-2.webp"
                  alt="Linen Line Store Logo"
                  width={150}
                  height={56}
                  priority
                  className="h-7 w-auto object-contain transition-transform duration-300 sm:h-11"
                />
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="font-heading text-base font-bold tracking-wider text-foreground uppercase transition-colors group-hover:text-primary-700 dark:group-hover:text-primary-300 sm:text-lg">
                  Linen Line
                </span>
                <span className="text-[10px] -mt-0.5 font-medium tracking-widest text-muted-foreground uppercase">
                  Abaya Boutique
                </span>
              </div>
            </Link>

            <div className="mx-4 hidden max-w-md flex-1 min-[1117px]:flex lg:mx-8">
              <SearchBar />
            </div>

            <div className="flex items-center gap-0.5 sm:gap-2">
              <div className="me-1 hidden items-center gap-1 border-e border-border/80 pe-2 min-[1117px]:flex">
                <CurrencyDropdown />
                <LanguageDropdown />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsMobileSearchOpen((open) => {
                    const next = !open;
                    if (next) setHidden(false);
                    return next;
                  });
                }}
                className="size-8 text-foreground hover:bg-muted min-[1117px]:hidden sm:size-9"
                aria-label={t("searchButton")}
              >
                {isMobileSearchOpen ? (
                  <X className="size-4 sm:size-5" />
                ) : (
                  <Search className="size-4 sm:size-5" />
                )}
              </Button>

              <TooltipProvider delay={100}>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Link
                        href="/wishlist"
                        className="relative flex size-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted sm:size-10"
                        aria-label={t("favorites")}
                      />
                    }
                  >
                    <Heart className="size-4 sm:size-5" />
                    {showFavoriteCount && (
                      <span className="absolute -top-0.5 -end-0.5 flex size-3.5 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white shadow-xs sm:-top-1 sm:-end-1 sm:size-4.5 sm:text-[10px]">
                        {favoriteItemCount}
                      </span>
                    )}
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={6}
                    className="text-xs font-medium"
                  >
                    {t("favorites")}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Link
                        ref={registerCartTarget}
                        href="/cart"
                        className="relative flex size-8 items-center justify-center rounded-lg border border-primary-200/60 bg-primary-50 text-primary-900 transition-all hover:bg-primary-100 hover:shadow-xs dark:border-primary-800/40 dark:bg-primary-950/50 dark:text-primary-100 dark:hover:bg-primary-900/60 sm:size-10"
                        aria-label={t("cart")}
                      />
                    }
                  >
                    <motion.span
                      key={pulseToken}
                      initial={false}
                      animate={
                        pulseToken > 0
                          ? { scale: [1, 1.15, 1] }
                          : { scale: 1 }
                      }
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative flex size-full items-center justify-center"
                    >
                      <ShoppingBasket className="size-4 text-primary-800 dark:text-primary-200 sm:size-5" />
                      {showCartCount && (
                        <span className="absolute -top-1 -end-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-secondary px-0.5 text-[9px] font-bold text-secondary-foreground shadow-xs sm:-top-1.5 sm:-end-1.5 sm:h-4.5 sm:min-w-4.5 sm:px-1 sm:text-[10px]">
                          {cartItemCount}
                        </span>
                      )}
                    </motion.span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={6}
                    className="text-xs font-medium"
                  >
                    {t("cart")}
                  </TooltipContent>
                </Tooltip>

                {isAuthenticated ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Link
                          href="/me"
                          className="relative hidden items-center justify-center rounded-full transition-transform hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 min-[1117px]:flex"
                          aria-label={t("account")}
                        />
                      }
                    >
                      <Avatar className="size-9 border border-border/80 transition-colors hover:border-primary-400 dark:hover:border-primary-600 sm:size-11">
                        <AvatarImage src="" alt={t("account")} />
                        <AvatarFallback className="bg-primary-50 font-medium text-primary-800 dark:bg-primary-950/60 dark:text-primary-200">
                          <User className="size-4 sm:size-5.5" />
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      sideOffset={6}
                      className="text-xs font-medium"
                    >
                      {t("account")}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    size="sm"
                    className="ms-0.5 hidden h-8 px-2.5 text-xs font-medium min-[1117px]:inline-flex sm:h-9 sm:px-3 sm:text-sm"
                    nativeButton={false}
                    render={(props) => <Link href="/login" {...props} />}
                    aria-label={t("login")}
                  >
                    {t("login")}
                  </Button>
                )}
              </TooltipProvider>
            </div>
          </div>

          {isMobileSearchOpen && (
            <div className="animate-in fade-in-50 border-t border-border pt-1 pb-2.5 duration-150 min-[1117px]:hidden sm:pb-3">
              <SearchBar
                isMobile
                onSearchSubmit={() => setIsMobileSearchOpen(false)}
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Desktop: category nav slides away with the same old translateY animation */}
      <motion.nav
        initial={false}
        animate={{ y: hideCategoryNav ? "-100%" : "0%" }}
        transition={slideTransition}
        style={{ pointerEvents: hideCategoryNav ? "none" : "auto" }}
        className={cn(
          "relative z-0 hidden min-[1117px]:flex items-center justify-center gap-1 lg:gap-3",
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
