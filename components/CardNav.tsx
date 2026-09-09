"use client";

import React, { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { GoArrowUpRight } from "react-icons/go";
import { Menu, Package, User, X } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { CurrencyDropdown } from "@/components/common/CurrencyDropdown";
import { useAuth } from "@/features/auth";
import { cn } from "@/lib/utils";

function subscribeToNothing() {
  return () => {};
}

export type CardNavLink = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export type CardNavItem = {
  label: string;
  /** Semantic token classes for the card surface, e.g. `bg-primary text-primary-foreground` */
  className?: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  /** Dynamic shop / catalog cards (language, currency, orders are built-in). */
  items: CardNavItem[];
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

const DEFAULT_CARD_SURFACES = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-muted text-foreground",
] as const;

const panelTransition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };
const cardTransition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

export default function CardNav({
  items,
  className = "",
  onOpenChange,
}: CardNavProps) {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const portalReady = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );

  const triggerWrapRef = useRef<HTMLDivElement | null>(null);

  const syncPanelTop = () => {
    const header = triggerWrapRef.current?.closest("header");
    if (!header) return;
    setPanelTop(header.getBoundingClientRect().bottom);
  };

  useLayoutEffect(() => {
    syncPanelTop();
    if (!isOpen) return;

    window.addEventListener("resize", syncPanelTop);
    window.addEventListener("scroll", syncPanelTop, { passive: true });
    return () => {
      window.removeEventListener("resize", syncPanelTop);
      window.removeEventListener("scroll", syncPanelTop);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const setOpen = (next: boolean) => {
    if (next === isOpen) return;
    if (next) syncPanelTop();
    setIsOpen(next);
    onOpenChange?.(next);
  };

  const toggleMenu = () => setOpen(!isOpen);
  const closeMenu = () => setOpen(false);

  const handleLocaleSwitch = (nextLocale: "ar" | "en" | "tr") => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
    closeMenu();
  };

  const catalogCards = items.slice(0, 2);

  const panel =
    portalReady &&
    createPortal(
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              key="card-nav-backdrop"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-foreground/25 backdrop-blur-[2px] min-[1117px]:hidden"
              style={{ top: panelTop }}
              aria-label={t("closeMenu")}
              onClick={closeMenu}
            />

            <motion.div
              key="card-nav-panel"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={panelTransition}
              className="fixed inset-x-0 z-80 px-4 sm:px-6 min-[1117px]:hidden"
              style={{ top: panelTop + 8 }}
              role="dialog"
              aria-modal="true"
              aria-label={t("menu")}
            >
              <div
                className="mx-auto flex h-fit w-full max-w-lg flex-col gap-2 overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-lg"
                style={{
                  maxHeight: `calc(100dvh - ${panelTop + 24}px)`,
                }}
              >
                {catalogCards.map((item, idx) => (
                  <motion.div
                    key={`${item.label}-${idx}`}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...cardTransition, delay: 0.06 + idx * 0.08 }}
                    className={cn(
                      "nav-card relative shrink-0 rounded-lg select-none",
                      item.className ??
                        DEFAULT_CARD_SURFACES[idx % DEFAULT_CARD_SURFACES.length],
                    )}
                  >
                    <div className="flex flex-col gap-2 p-3">
                      <div className="text-lg font-medium tracking-tight">
                        {item.label}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {item.links.map((lnk) => (
                          <Link
                            key={`${lnk.href}-${lnk.label}`}
                            href={lnk.href}
                            aria-label={lnk.ariaLabel ?? lnk.label}
                            onClick={closeMenu}
                            className="inline-flex items-center gap-1.5 py-0.5 text-[15px] no-underline transition-opacity hover:opacity-80"
                          >
                            <GoArrowUpRight
                              className="size-4 shrink-0"
                              aria-hidden
                            />
                            {lnk.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Fixed: account, orders, language, currency */}
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...cardTransition,
                    delay: 0.06 + catalogCards.length * 0.08,
                  }}
                  className={cn(
                    "nav-card relative shrink-0 rounded-lg select-none",
                    DEFAULT_CARD_SURFACES[2],
                  )}
                >
                  <div className="flex flex-col gap-3 p-3">
                    <div className="text-lg font-medium tracking-tight">
                      {isAuthenticated ? t("account") : t("login")}
                    </div>

                    {isAuthenticated ? (
                      <div className="flex flex-col gap-0.5">
                        <Link
                          href="/me"
                          onClick={closeMenu}
                          aria-label={t("account")}
                          className="inline-flex items-center gap-1.5 py-0.5 text-[15px] no-underline transition-opacity hover:opacity-80"
                        >
                          <User className="size-4 shrink-0" aria-hidden />
                          {t("account")}
                        </Link>

                        <Link
                          href="/me/orders"
                          onClick={closeMenu}
                          aria-label={t("myOrders")}
                          className="inline-flex items-center gap-1.5 py-0.5 text-[15px] no-underline transition-opacity hover:opacity-80"
                        >
                          <Package className="size-4 shrink-0" aria-hidden />
                          {t("myOrders")}
                        </Link>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full justify-center font-medium"
                        nativeButton={false}
                        render={(props) => (
                          <Link
                            href="/login"
                            {...props}
                            onClick={(event) => {
                              props.onClick?.(event);
                              closeMenu();
                            }}
                          />
                        )}
                        aria-label={t("login")}
                      >
                        {t("login")}
                      </Button>
                    )}

                    <div className="flex flex-col gap-2 border-t border-border/60 pt-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t("language")}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {(["ar", "en", "tr"] as const).map((code) => (
                            <Button
                              key={code}
                              type="button"
                              variant={locale === code ? "secondary" : "ghost"}
                              size="xs"
                              onClick={() => handleLocaleSwitch(code)}
                              className={cn(
                                "text-xs font-medium",
                                code === "ar"
                                  ? "font-noto-arabic"
                                  : "font-outfit",
                              )}
                            >
                              {code === "ar"
                                ? "العربية"
                                : code === "en"
                                  ? "English"
                                  : "Türkçe"}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t("currency")}
                        </span>
                        <CurrencyDropdown className="h-7" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body,
    );

  return (
    <div ref={triggerWrapRef} className={cn("min-[1117px]:hidden", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 text-foreground hover:bg-muted sm:size-9"
        aria-label={isOpen ? t("closeMenu") : t("menu")}
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        {isOpen ? <X className="size-4 sm:size-5" /> : <Menu className="size-4 sm:size-5" />}
      </Button>
      {panel}
    </div>
  );
}
