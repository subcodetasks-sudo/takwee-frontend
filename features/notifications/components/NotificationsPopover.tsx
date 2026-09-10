"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Bell,
  Package,
  Sparkles,
  Info,
  CheckCheck,
  Check,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotifications } from "../hooks/useNotifications";
import type { NotificationKind } from "../types";

function formatRelativeTime(iso: string, locale: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.round((then - now) / 1000);
  const abs = Math.abs(diffSec);

  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  for (const [unit, secondsInUnit] of divisions) {
    if (abs >= secondsInUnit || unit === "second") {
      const value = Math.round(diffSec / secondsInUnit);
      return rtf.format(value, unit);
    }
  }

  return rtf.format(0, "second");
}

function KindIcon({ kind }: { kind: NotificationKind }) {
  const className = "size-3.5 sm:size-4 shrink-0";
  switch (kind) {
    case "order":
      return <Package className={className} />;
    case "promo":
      return <Sparkles className={className} />;
    default:
      return <Info className={className} />;
  }
}

export function NotificationsPopover() {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();

  const hasUnread = unreadCount > 0;
  const isRtl = locale === "ar";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              className={cn(
                "relative flex size-8 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted sm:size-10",
                open && "bg-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              )}
              aria-label={
                hasUnread
                  ? t("ariaLabelUnread", { count: unreadCount })
                  : t("ariaLabel")
              }
            />
          }
        >
          <Bell className="size-4 sm:size-5" />
          {hasUnread && (
            <span className="absolute -top-0.5 -end-0.5 flex size-3.5 items-center justify-center rounded-full bg-error text-[9px] font-bold text-error-foreground shadow-xs ring-2 ring-background sm:-top-1 sm:-end-1 sm:size-4.5 sm:text-[10px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </TooltipTrigger>
        {!open && (
          <TooltipContent
            side="bottom"
            sideOffset={6}
            className="text-xs font-medium"
          >
            {t("title")}
          </TooltipContent>
        )}
      </Tooltip>

      <PopoverContent
        align={isRtl ? "start" : "end"}
        side="bottom"
        sideOffset={6}
        className={cn(
          "w-[min(22rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden rounded-xl sm:rounded-2xl",
          "border border-border/80 bg-popover/85 p-0 shadow-xl backdrop-blur-xl supports-backdrop-filter:backdrop-blur-xl",
          "ring-1 ring-black/5 dark:ring-white/10",
        )}
      >
        <PopoverHeader className="flex flex-row items-start justify-between gap-2 border-b border-border/60 bg-muted/25 px-3 py-2.5 sm:px-4 sm:py-3.5 backdrop-blur-md">
          <div className="min-w-0 space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <PopoverTitle className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">
                {t("title")}
              </PopoverTitle>
              {hasUnread && (
                <span className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full border border-primary-300/60 bg-primary-100/80 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-primary-900 dark:border-primary-800/60 dark:bg-primary-950/70 dark:text-primary-200">
                  <span className="size-1 sm:size-1.5 rounded-full bg-primary animate-pulse" />
                  {unreadCount}
                </span>
              )}
            </div>
            <PopoverDescription className="text-[11px] sm:text-xs text-muted-foreground">
              {hasUnread ? (
                t("unreadSummary", { count: unreadCount })
              ) : (
                <span className="inline-flex items-center gap-1 font-medium text-success">
                  <CheckCheck className="size-3 sm:size-3.5" />
                  {t("allCaughtUp")}
                </span>
              )}
            </PopoverDescription>
          </div>
          {hasUnread && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={markAllAsRead}
              className="h-6 sm:h-7 shrink-0 gap-1 sm:gap-1.5 rounded-full px-2 sm:px-2.5 text-[11px] sm:text-xs font-medium text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground focus-visible:ring-1"
            >
              <CheckCheck className="size-3 sm:size-3.5 text-primary" />
              <span>{t("markAllRead")}</span>
            </Button>
          )}
        </PopoverHeader>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 px-4 py-8 sm:px-6 sm:py-12 text-center">
            <div className="relative flex size-11 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl border border-border/70 bg-muted/40 shadow-xs backdrop-blur-xs">
              <Bell className="size-5 sm:size-6 text-muted-foreground/80" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                {t("emptyTitle")}
              </p>
              <p className="max-w-[15rem] sm:max-w-[16rem] text-[11px] sm:text-xs leading-relaxed text-muted-foreground/90">
                {t("emptyDescription")}
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[min(19rem,55vh)] sm:h-[min(22rem,50vh)]">
            <ul className="flex flex-col gap-1 sm:gap-1.5 p-1.5 sm:p-2" role="list">
              {notifications.map((item) => (
                <li key={item.id}>
                  <div
                    className={cn(
                      "group relative flex w-full items-start gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3 text-start transition-all",
                      !item.read
                        ? "border border-primary-200/90 bg-primary-50/70 shadow-xs dark:border-primary-800/80 dark:bg-primary-950/40 hover:bg-primary-50/95 dark:hover:bg-primary-950/60"
                        : "border border-transparent bg-transparent hover:bg-muted/50",
                    )}
                  >
                    {item.href ? (
                      <Link
                        href={item.href}
                        onClick={() => {
                          markAsRead(item.id);
                          setOpen(false);
                        }}
                        className="absolute inset-0 z-0 rounded-lg sm:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                        aria-label={t(`items.${item.titleKey}`)}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => markAsRead(item.id)}
                        className="absolute inset-0 z-0 rounded-lg sm:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                        aria-label={t(`items.${item.titleKey}`)}
                      />
                    )}

                    <span
                      className={cn(
                        "mt-0.5 flex size-7.5 sm:size-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl transition-colors",
                        !item.read
                          ? cn(
                              item.kind === "order" &&
                                "border border-info/25 bg-info/15 text-info shadow-2xs",
                              item.kind === "promo" &&
                                "border border-primary-300/60 bg-primary-200/60 text-primary-900 shadow-2xs dark:border-primary-700/60 dark:bg-primary-900/60 dark:text-primary-100",
                              item.kind === "system" &&
                                "border border-secondary-300/60 bg-secondary-100 text-secondary-800 shadow-2xs dark:border-secondary-700/60 dark:bg-secondary-900/60 dark:text-secondary-200",
                            )
                          : "border border-border/40 bg-muted/60 text-muted-foreground opacity-70",
                      )}
                    >
                      <KindIcon kind={item.kind} />
                    </span>

                    <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                      <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                        <span
                          className={cn(
                            "text-xs sm:text-sm leading-snug tracking-tight transition-colors",
                            item.read
                              ? "font-normal text-muted-foreground"
                              : "font-semibold text-foreground",
                          )}
                        >
                          {t(`items.${item.titleKey}`)}
                        </span>

                        {!item.read && (
                          <span
                            className="relative mt-1 flex size-1.5 sm:size-2 shrink-0"
                            aria-label={t("unread")}
                          >
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                            <span className="relative inline-flex size-1.5 sm:size-2 rounded-full bg-primary ring-2 ring-background" />
                          </span>
                        )}
                      </div>

                      <p
                        className={cn(
                          "text-[11px] sm:text-xs leading-relaxed transition-colors",
                          item.read
                            ? "text-muted-foreground/75"
                            : "text-foreground/85",
                        )}
                      >
                        {t(`items.${item.bodyKey}`)}
                      </p>

                      <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-0.5">
                        <span
                          className={cn(
                            "text-[10px] sm:text-[11px] transition-colors",
                            item.read
                              ? "text-muted-foreground/60"
                              : "font-medium text-primary-800 dark:text-primary-300",
                          )}
                        >
                          {formatRelativeTime(item.createdAt, locale)}
                        </span>

                        {!item.read && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.id);
                            }}
                            className="relative z-1 inline-flex items-center gap-0.5 sm:gap-1 rounded px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-muted-foreground transition-all hover:bg-background/90 hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          >
                            <Check className="size-2.5 sm:size-3 text-primary" />
                            <span>{t("markRead")}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
