"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bell, CheckCheck } from "lucide-react";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationSwipeItem } from "./NotificationSwipeItem";

function NotificationsSkeleton() {
  return (
    <ul className="flex flex-col gap-1 sm:gap-1.5 p-1.5 sm:p-2" role="list">
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl p-2 sm:p-2.5"
          aria-hidden
        >
          <span className="mt-0.5 size-7.5 sm:size-9 shrink-0 animate-pulse rounded-lg sm:rounded-xl bg-muted/60" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-3/4 animate-pulse rounded bg-muted/60" />
            <div className="h-3 w-full animate-pulse rounded bg-muted/50" />
            <div className="h-2.5 w-1/3 animate-pulse rounded bg-muted/40" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function NotificationsPopover() {
  const t = useTranslations("Notifications");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    isLoading,
    isAuthenticated,
  } = useNotifications({ loadList: open });

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
              {!isAuthenticated ? (
                t("signInHint")
              ) : hasUnread ? (
                t("unreadSummary", { count: unreadCount })
              ) : (
                <span className="inline-flex items-center gap-1 font-medium text-success">
                  <CheckCheck className="size-3 sm:size-3.5" />
                  {t("allCaughtUp")}
                </span>
              )}
            </PopoverDescription>
          </div>
          {isAuthenticated && hasUnread && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={() => {
                void markAllAsRead();
              }}
              className="h-6 sm:h-7 shrink-0 gap-1 sm:gap-1.5 rounded-full px-2 sm:px-2.5 text-[11px] sm:text-xs font-medium text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground focus-visible:ring-1"
            >
              <CheckCheck className="size-3 sm:size-3.5 text-primary" />
              <span>{t("markAllRead")}</span>
            </Button>
          )}
        </PopoverHeader>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center gap-2.5 px-4 py-8 sm:px-6 sm:py-12 text-center">
            <div className="relative flex size-11 sm:size-14 items-center justify-center rounded-xl sm:rounded-2xl border border-border/70 bg-muted/40 shadow-xs backdrop-blur-xs">
              <Bell className="size-5 sm:size-6 text-muted-foreground/80" />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-foreground">
                {t("signInTitle")}
              </p>
              <p className="max-w-[15rem] sm:max-w-[16rem] text-[11px] sm:text-xs leading-relaxed text-muted-foreground/90">
                {t("signInDescription")}
              </p>
            </div>
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: "sm" }), "mt-1")}
            >
              {t("signInCta")}
            </Link>
          </div>
        ) : isLoading ? (
          <div
            className="h-[min(19rem,55vh)] sm:h-[min(22rem,50vh)]"
            aria-busy="true"
            aria-label={t("loading")}
          >
            <NotificationsSkeleton />
          </div>
        ) : notifications.length === 0 ? (
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
            <p className="px-3 pt-2 text-[10px] sm:text-[11px] text-muted-foreground/80">
              {t("swipeToDelete")}
            </p>
            <ul
              className="flex flex-col gap-1 sm:gap-1.5 p-1.5 sm:p-2"
              role="list"
            >
              {notifications.map((item) => (
                <NotificationSwipeItem
                  key={item.id}
                  item={item}
                  locale={locale}
                  unreadLabel={t("unread")}
                  markReadLabel={t("markRead")}
                  deleteLabel={t("delete")}
                  onMarkAsRead={(id) => {
                    void markAsRead(id);
                  }}
                  onDelete={deleteNotification}
                  onNavigate={() => setOpen(false)}
                />
              ))}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
