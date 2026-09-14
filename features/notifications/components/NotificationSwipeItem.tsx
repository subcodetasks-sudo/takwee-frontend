"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { Check, Info, Package, Sparkles, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { NotificationItem, NotificationKind } from "../types";

const DELETE_OFFSET = 88;
const DELETE_VELOCITY = 650;
const EXIT_X = 420;
const EXIT_MS = 200;

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

type NotificationSwipeItemProps = {
  item: NotificationItem;
  locale: string;
  unreadLabel: string;
  markReadLabel: string;
  deleteLabel: string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  onNavigate?: () => void;
};

export function NotificationSwipeItem({
  item,
  locale,
  unreadLabel,
  markReadLabel,
  deleteLabel,
  onMarkAsRead,
  onDelete,
  onNavigate,
}: NotificationSwipeItemProps) {
  const x = useMotionValue(0);
  const [exitX, setExitX] = useState(0);
  const [exiting, setExiting] = useState(false);
  const dragMoved = useRef(false);
  const deleting = useRef(false);

  // Performance-friendly reactive transforms for the background reveal & trash scale
  const bgOpacity = useTransform(
    x,
    [-DELETE_OFFSET * 1.5, -20, 0, 20, DELETE_OFFSET * 1.5],
    [1, 0.7, 0, 0.7, 1],
    { clamp: true },
  );
  const leftTrashScale = useTransform(
    x,
    [0, 24, DELETE_OFFSET],
    [0.7, 0.9, 1.15],
    { clamp: true },
  );
  const rightTrashScale = useTransform(
    x,
    [-DELETE_OFFSET, -24, 0],
    [1.15, 0.9, 0.7],
    { clamp: true },
  );

  const commitDelete = async (direction: 1 | -1) => {
    if (deleting.current) return;
    deleting.current = true;
    setExitX(direction * EXIT_X);
    setExiting(true);

    await new Promise((resolve) => setTimeout(resolve, EXIT_MS));

    try {
      await onDelete(item.id);
    } catch {
      deleting.current = false;
      setExiting(false);
      setExitX(0);
      x.set(0);
    }
  };

  const handleDragStart = () => {
    dragMoved.current = false;
  };

  const handleDrag = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 8) {
      dragMoved.current = true;
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    const shouldDelete =
      Math.abs(offset.x) >= DELETE_OFFSET ||
      Math.abs(velocity.x) >= DELETE_VELOCITY;

    if (!shouldDelete) return;

    const direction: 1 | -1 =
      offset.x === 0
        ? velocity.x >= 0
          ? 1
          : -1
        : offset.x > 0
          ? 1
          : -1;
    void commitDelete(direction);
  };

  const handleActivate = (e: React.MouseEvent | React.PointerEvent) => {
    if (dragMoved.current || exiting) {
      e.preventDefault();
      e.stopPropagation();
      dragMoved.current = false;
      return;
    }
    onMarkAsRead(item.id);
    onNavigate?.();
  };

  return (
    <motion.li
      layout="position"
      transition={{
        layout: {
          type: "spring",
          stiffness: 450,
          damping: 35,
          mass: 0.8,
        },
      }}
      className={cn(
        "relative overflow-hidden rounded-lg sm:rounded-xl",
        exiting && "pointer-events-none",
      )}
    >
      {/* Background action revealed on swipe */}
      <motion.div
        aria-hidden
        animate={exiting ? { opacity: 0 } : { opacity: 1 }}
        transition={exiting ? { duration: 0.16, ease: "easeOut" } : undefined}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.div
          style={{ opacity: bgOpacity }}
          className="size-full flex items-center justify-between rounded-lg sm:rounded-xl bg-error px-4"
        >
          <motion.div style={{ scale: leftTrashScale }}>
            <Trash2 className="size-4 text-error-foreground sm:size-5" />
          </motion.div>
          <motion.div style={{ scale: rightTrashScale }}>
            <Trash2 className="size-4 text-error-foreground sm:size-5" />
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        drag={exiting ? false : "x"}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.85}
        style={{ x }}
        animate={exiting ? { x: exitX, opacity: 0 } : { x: 0, opacity: 1 }}
        transition={
          exiting
            ? { duration: EXIT_MS / 1000, ease: [0.32, 0.72, 0, 1] }
            : { type: "spring", stiffness: 420, damping: 38 }
        }
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className={cn(
          "group relative z-1 flex w-full cursor-grab items-start gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3 text-start active:cursor-grabbing touch-pan-y",
          !item.read
            ? "border border-primary-200 bg-primary-50 shadow-xs dark:border-primary-800 dark:bg-primary-950 hover:bg-primary-100 dark:hover:bg-primary-900"
            : "border border-border bg-card hover:bg-muted",
        )}
        role="group"
        aria-label={`${item.title}. ${deleteLabel}`}
      >
        {item.href ? (
          <Link
            href={item.href}
            onClick={handleActivate}
            draggable={false}
            className="absolute inset-0 z-0 rounded-lg sm:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            aria-label={item.title}
          />
        ) : (
          <button
            type="button"
            onClick={handleActivate}
            className="absolute inset-0 z-0 rounded-lg sm:rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            aria-label={item.title}
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
              {item.title}
            </span>

            {!item.read && (
              <span
                className="relative mt-1 flex size-1.5 sm:size-2 shrink-0"
                aria-label={unreadLabel}
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-1.5 sm:size-2 rounded-full bg-primary ring-2 ring-background" />
              </span>
            )}
          </div>

          <p
            className={cn(
              "text-[11px] sm:text-xs leading-relaxed transition-colors",
              item.read ? "text-muted-foreground/75" : "text-foreground/85",
            )}
          >
            {item.body}
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
                  onMarkAsRead(item.id);
                }}
                className="relative z-1 inline-flex items-center gap-0.5 sm:gap-1 rounded px-1.5 py-0.5 text-[10px] sm:text-[11px] font-medium text-muted-foreground transition-all hover:bg-background hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <Check className="size-2.5 sm:size-3 text-primary" />
                <span>{markReadLabel}</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.li>
  );
}
