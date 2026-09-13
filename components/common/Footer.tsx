"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  PackageCheck,
  Scissors,
  ShieldCheck,
  ArrowUp,
  ArrowRight,
  Mail,
  Check,
  ChevronDown,
  Phone,
  MapPin,
} from "lucide-react";
import {
  SiWhatsapp,
  SiInstagram,
  SiTiktok,
  SiYoutube,
  SiFacebook,
  SiX,
  SiSnapchat,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { motion } from "motion/react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NewsletterAnimation } from "./NewsletterAnimation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth";
import { useCategories } from "@/features/categories";
import { usePages } from "@/features/content";
import { useSettings } from "@/features/settings";

export function Footer() {
  const t = useTranslations("Footer");
  const { isAuthenticated } = useAuth();
  const {
    appName,
    siteLogo,
    contactEmail,
    contactPhone,
    contactAddress,
    contactMapLocation,
    whatsappUrl,
    workingHours,
    social,
  } = useSettings();
  const { supportPages, aboutPages, legalPages, otherPages, isLoading: isPagesLoading } = usePages();
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  // Mobile Accordion state for columns
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    collections: false,
    services: false,
    atelier: false,
    more: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const email = contactEmail || t("concierge.email");
  const hours = workingHours || t("concierge.hours");
  const brandLabel = appName || "Linen Line";
  const logoSrc = siteLogo || "/imgs/logo-4.webp";

  const perks = [
    {
      icon: Sparkles,
      title: t("perks.organicLinen.title"),
      desc: t("perks.organicLinen.desc"),
    },
    {
      icon: PackageCheck,
      title: t("perks.shipping.title"),
      desc: t("perks.shipping.desc"),
    },
    {
      icon: Scissors,
      title: t("perks.concierge.title"),
      desc: t("perks.concierge.desc"),
    },
    {
      icon: ShieldCheck,
      title: t("perks.exchanges.title"),
      desc: t("perks.exchanges.desc"),
    },
  ];

  const collectionsLinks = categories.map((category) => ({
    id: category.id,
    href: category.href,
    label: category.name,
  }));

  const servicesLinks = supportPages.map((page) => ({
    href: page.href,
    label: page.title,
  }));

  const atelierLinks = aboutPages.map((page) => ({
    href: page.href,
    label: page.title,
  }));

  const moreLinks = otherPages.map((page) => ({
    href: page.href,
    label: page.title,
  }));

  const socialLinks = (
    [
      {
        icon: SiInstagram,
        href: social.instagram,
        name: "Instagram",
        hoverClass: "hover:text-foreground hover:border-foreground/40",
      },
      {
        icon: SiTiktok,
        href: social.tiktok,
        name: "TikTok",
        hoverClass: "hover:text-foreground hover:border-foreground/40",
      },
      {
        icon: SiYoutube,
        href: social.youtube,
        name: "YouTube",
        hoverClass: "hover:text-foreground hover:border-foreground/40",
      },
      {
        icon: SiFacebook,
        href: social.facebook,
        name: "Facebook",
        hoverClass: "hover:text-foreground hover:border-foreground/40",
      },
      {
        icon: SiX,
        href: social.twitter,
        name: "X",
        hoverClass: "hover:text-foreground hover:border-foreground/40",
      },
      {
        icon: FaLinkedin,
        href: social.linkedin,
        name: "LinkedIn",
        hoverClass: "hover:text-foreground hover:border-foreground/40",
      },
      {
        icon: SiSnapchat,
        href: social.snapchat,
        name: "Snapchat",
        hoverClass: "hover:text-foreground hover:border-foreground/40",
      },
    ] as const
  ).flatMap((item) =>
    item.href
      ? [
          {
            icon: item.icon,
            href: item.href,
            name: item.name,
            hoverClass: item.hoverClass,
          },
        ]
      : [],
  );

  return (
    <footer className="w-full border-t border-border/80 bg-muted/30 text-foreground">
      {/* 1. Brand Perks Strip */}
      <div className="border-b border-border/60 bg-background/50 backdrop-blur-xs">
        <div className="page-shell py-8 sm:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-3.5 rounded-xl transition-all duration-300 hover:bg-card/80 hover:shadow-xs"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-900 dark:bg-primary-900/30 dark:text-primary-200 ring-1 ring-primary-200/50 dark:ring-primary-700/30 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      {perk.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {perk.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Newsletter / VIP Club Section */}
      <div className="border-b border-border/60">
        <div className="page-shell py-12 sm:py-16">
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-xs">
            {/* Performance-Friendly Animated Linen Loom & Thread SVG Background */}
            <NewsletterAnimation />

            {/* Subtle background ambient glows */}
            <div className="pointer-events-none absolute -top-24 -end-24 size-96 rounded-full bg-primary-100/30 dark:bg-primary-950/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -start-24 size-96 rounded-full bg-secondary-100/30 dark:bg-secondary-950/20 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-3">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {isAuthenticated
                    ? t("newsletter.member.title")
                    : t("newsletter.title")}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  {isAuthenticated
                    ? t("newsletter.member.description")
                    : t("newsletter.description")}
                </p>
              </div>

              <div className="lg:col-span-6">
                {isAuthenticated ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3.5 rounded-xl border border-success/40 bg-success-muted p-4 sm:p-5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success text-white">
                        <Check className="size-5" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {t("newsletter.member.status")}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <Button
                        nativeButton={false}
                        render={(props) => (
                          <Link href="/me/orders" {...props} />
                        )}
                        className="h-11 px-6 rounded-xl font-medium shadow-xs bg-primary text-primary-foreground hover:bg-primary-600 transition-all cursor-pointer shrink-0 sm:flex-1"
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          {t("newsletter.member.ordersCta")}
                          <ArrowRight className="size-4 rtl:rotate-180" />
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        nativeButton={false}
                        render={(props) => <Link href="/me" {...props} />}
                        className="h-11 px-6 rounded-xl font-medium border-border/80 bg-background hover:bg-muted/80 transition-all cursor-pointer shrink-0 sm:flex-1"
                      >
                        {t("newsletter.member.accountCta")}
                      </Button>
                    </div>

                    <Link
                      href="/shop/new-in"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                    >
                      {t("newsletter.member.shopCta")}
                      <ArrowRight className="size-3.5 rtl:rotate-180" />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <Button
                        nativeButton={false}
                        render={(props) => (
                          <Link href="/signup" {...props} />
                        )}
                        className="h-11 px-6 rounded-xl font-medium shadow-xs bg-primary text-primary-foreground hover:bg-primary-600 transition-all cursor-pointer shrink-0 sm:flex-1"
                      >
                        <span className="flex items-center justify-center gap-1.5">
                          {t("newsletter.guest.signupCta")}
                          <ArrowRight className="size-4 rtl:rotate-180" />
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        nativeButton={false}
                        render={(props) => (
                          <Link href="/login" {...props} />
                        )}
                        className="h-11 px-6 rounded-xl font-medium border-border/80 bg-background hover:bg-muted/80 transition-all cursor-pointer shrink-0 sm:flex-1"
                      >
                        {t("newsletter.guest.loginCta")}
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground/80 leading-normal">
                      {t("newsletter.guest.note")}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Footer Columns */}
      <div className="page-shell py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Presentation & Concierge (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            <Link
              href="/"
              draggable={false}
              className="flex items-center gap-3 group focus:outline-none transition-transform active:scale-95 shrink-0 inline-flex select-none"
              aria-label={`${brandLabel} Home`}
            >
              <div className="relative h-10 w-auto flex items-center justify-center">
                <Image
                  src={logoSrc}
                  alt={`${brandLabel} Logo`}
                  width={150}
                  height={56}
                  draggable={false}
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-lg tracking-wider text-foreground uppercase group-hover:text-secondary-700 dark:group-hover:text-secondary-300 transition-colors">
                  {brandLabel}
                </span>
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase -mt-0.5 font-medium">
                  Abaya Boutique
                </span>
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t("brandDescription")}
            </p>

            {/* Direct WhatsApp Concierge Card */}
            <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs space-y-3 max-w-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full size-2.5 bg-success" />
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {t("concierge.title")}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[10px] font-normal px-2 py-0.5 bg-secondary-50 text-secondary-900 dark:bg-secondary-950/60 dark:text-secondary-200"
                >
                  {t("concierge.liveSupport")}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                {hours}
              </p>

              {(contactAddress || contactMapLocation) && (
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  {contactAddress ? (
                    <p className="leading-relaxed flex items-start gap-2">
                      <MapPin className="size-3.5 shrink-0 mt-0.5 text-foreground/70" />
                      <span>{contactAddress}</span>
                    </p>
                  ) : null}
                  {contactMapLocation ? (
                    <a
                      href={contactMapLocation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-foreground/80 hover:text-foreground underline-offset-4 hover:underline transition-colors ps-5"
                    >
                      {t("concierge.viewMap")}
                    </a>
                  ) : null}
                </div>
              )}

              <div className="pt-1 flex flex-col gap-2">
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium transition-all hover:bg-secondary-600 hover:shadow-xs active:scale-98"
                  >
                    <SiWhatsapp className="size-4" />
                    <span>{t("concierge.whatsapp")}</span>
                  </a>
                ) : null}

                {contactPhone ? (
                  <a
                    href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                    className="flex items-center justify-center gap-2 h-8 px-3 rounded-lg border border-border/80 bg-background/60 text-xs text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                  >
                    <Phone className="size-3.5" />
                    <span className="text-[11px] font-mono" dir="ltr">
                      {contactPhone}
                    </span>
                  </a>
                ) : null}

                <a
                  href={`mailto:${email}`}
                  className="flex items-center justify-center gap-2 h-8 px-3 rounded-lg border border-border/80 bg-background/60 text-xs text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                >
                  <Mail className="size-3.5" />
                  <span className="text-[11px] font-mono">{email}</span>
                </a>
              </div>
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 ? (
            <div className="flex items-center gap-2.5 pt-1">
              {socialLinks.map((socialItem, i) => {
                const Icon = socialItem.icon;
                return (
                  <a
                    key={i}
                    href={socialItem.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialItem.name}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg border border-border/80 bg-card text-muted-foreground transition-all duration-200",
                      "hover:-translate-y-0.5 hover:shadow-xs",
                      socialItem.hoverClass
                    )}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
            ) : null}
          </div>

          {/* Navigation Links Columns (Desktop: dynamic columns, Mobile: Responsive Collapsibles) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-4 lg:pt-0">
            {/* Column: Collections ← GET /api/v1/categories */}
            {collectionsLinks.length > 0 || (isCategoriesLoading && collectionsLinks.length === 0) ? (
              <div className="border-b md:border-b-0 border-border/60 pb-4 md:pb-0">
                <button
                  type="button"
                  onClick={() => toggleSection("collections")}
                  className="flex w-full items-center justify-between py-2 md:py-0 text-left cursor-pointer md:cursor-default"
                  aria-expanded={openSections.collections}
                >
                  <h3 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
                    {t("columns.collections")}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200 md:hidden",
                      openSections.collections && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "pt-3 space-y-2.5",
                    "hidden md:block",
                    openSections.collections && "block"
                  )}
                >
                  {isCategoriesLoading && collectionsLinks.length === 0 ? (
                    <div className="space-y-2.5" aria-hidden="true">
                      <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                      <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                      <div className="h-3.5 w-20 rounded bg-muted animate-pulse" />
                      <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                    </div>
                  ) : (
                    <ul className="space-y-2.5 list-none p-0 m-0">
                      {collectionsLinks.map((link) => (
                        <li key={link.id}>
                          <Link
                            href={link.href}
                            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all inline-block hover:translate-x-1 rtl:hover:-translate-x-1"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}

            {/* Column: Client Care ← GET /api/v1/pages group=support */}
            {servicesLinks.length > 0 || (isPagesLoading && servicesLinks.length === 0) ? (
              <div className="border-b md:border-b-0 border-border/60 pb-4 md:pb-0">
                <button
                  type="button"
                  onClick={() => toggleSection("services")}
                  className="flex w-full items-center justify-between py-2 md:py-0 text-left cursor-pointer md:cursor-default"
                  aria-expanded={openSections.services}
                >
                  <h3 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
                    {t("columns.services")}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200 md:hidden",
                      openSections.services && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "pt-3 space-y-2.5",
                    "hidden md:block",
                    openSections.services && "block"
                  )}
                >
                  {isPagesLoading && servicesLinks.length === 0 ? (
                    <div className="space-y-2.5" aria-hidden="true">
                      <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                      <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                      <div className="h-3.5 w-32 rounded bg-muted animate-pulse" />
                      <div className="h-3.5 w-20 rounded bg-muted animate-pulse" />
                    </div>
                  ) : (
                    <ul className="space-y-2.5 list-none p-0 m-0">
                      {servicesLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all inline-block hover:translate-x-1 rtl:hover:-translate-x-1"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}

            {/* Column: The Atelier ← GET /api/v1/pages group=about */}
            {atelierLinks.length > 0 || (isPagesLoading && atelierLinks.length === 0) ? (
              <div className="border-b md:border-b-0 border-border/60 pb-4 md:pb-0">
                <button
                  type="button"
                  onClick={() => toggleSection("atelier")}
                  className="flex w-full items-center justify-between py-2 md:py-0 text-left cursor-pointer md:cursor-default"
                  aria-expanded={openSections.atelier}
                >
                  <h3 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
                    {t("columns.atelier")}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200 md:hidden",
                      openSections.atelier && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "pt-3 space-y-2.5",
                    "hidden md:block",
                    openSections.atelier && "block"
                  )}
                >
                  {isPagesLoading && atelierLinks.length === 0 ? (
                    <div className="space-y-2.5" aria-hidden="true">
                      <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
                      <div className="h-3.5 w-28 rounded bg-muted animate-pulse" />
                      <div className="h-3.5 w-32 rounded bg-muted animate-pulse" />
                    </div>
                  ) : (
                    <ul className="space-y-2.5 list-none p-0 m-0">
                      {atelierLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all inline-block hover:translate-x-1 rtl:hover:-translate-x-1"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}

            {/* Extra CMS groups (not about/support/legal) — shown in footer body when present */}
            {moreLinks.length > 0 ? (
              <div className="border-b md:border-b-0 border-border/60 pb-4 md:pb-0 md:col-span-3 lg:col-span-1">
                <button
                  type="button"
                  onClick={() => toggleSection("more")}
                  className="flex w-full items-center justify-between py-2 md:py-0 text-left cursor-pointer md:cursor-default"
                  aria-expanded={openSections.more}
                >
                  <h3 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground">
                    {t("columns.more")}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform duration-200 md:hidden",
                      openSections.more && "rotate-180"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "pt-3 space-y-2.5",
                    "hidden md:block",
                    openSections.more && "block"
                  )}
                >
                  <ul className="space-y-2.5 list-none p-0 m-0">
                    {moreLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-all inline-block hover:translate-x-1 rtl:hover:-translate-x-1"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* 4. Bottom Bar: Copyright, Legal, Back to Top */}
      <div className="border-t border-border/60 bg-background/80 py-8">
        <div className="page-shell">
          {/* Copyright, Legal Links (from CMS when present), Back to top */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright & Legal Links */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-5 text-xs text-muted-foreground text-center sm:text-start">
              <span>
                &copy; {new Date().getFullYear()} {brandLabel}. {t("allRightsReserved")}
              </span>
              {legalPages.length > 0 ? (
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
                  {legalPages.map((page, index) => (
                    <span key={page.href} className="contents">
                      {index > 0 ? (
                        <span className="text-border" aria-hidden>
                          |
                        </span>
                      ) : null}
                      <Link
                        href={page.href}
                        className="hover:text-foreground transition-colors underline-offset-4 hover:underline"
                      >
                        {page.title}
                      </Link>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Back to Top Floating/Inline Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="h-8.5 px-3.5 rounded-lg border-border/80 bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 gap-1.5 cursor-pointer transition-transform active:scale-95 shrink-0 self-center sm:self-auto"
              aria-label={t("backToTop")}
            >
              <span>{t("backToTop")}</span>
              <ArrowUp className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
