"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { FadeIn } from "@/components/animations";
import { useProfile } from "../hooks/useProfile";
import { ProfileLogoutButton } from "./ProfileLogoutButton";

export function ProfileHero() {
  const t = useTranslations("ProfilePage.hero");
  const locale = useLocale();
  const { user } = useProfile();

  if (!user) {
    return (
      <div className="flex min-h-44 animate-pulse items-center gap-6 border-b border-border/70 py-10">
        <div className="size-20 rounded-full bg-muted/40 sm:size-24 md:size-28" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-24 rounded-sm bg-muted/40" />
          <div className="h-8 w-48 rounded-sm bg-muted/40" />
          <div className="h-4 w-36 rounded-sm bg-muted/40" />
        </div>
      </div>
    );
  }

  const memberSinceDate = user.memberSince ? new Date(user.memberSince) : new Date();
  const memberSinceLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(memberSinceDate);

  return (
    <FadeIn direction="up">
      <div className="flex min-h-44 flex-col items-center justify-start gap-5 border-b border-border/70 py-10 text-center sm:min-h-52 sm:flex-row sm:items-start sm:gap-8 sm:py-14 sm:text-start md:min-h-60 md:py-16">
        <div
          className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary-50 text-xl font-semibold tracking-wide text-primary-800 dark:bg-primary-950/60 dark:text-primary-200 sm:size-24 sm:text-2xl md:size-28 md:text-3xl"
          aria-hidden
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              fill
              sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
              className="size-full object-cover"
            />
          ) : (
            user.initials
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {t("eyebrow")}
            </p>
            <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
              {user.name}
            </h1>
            <p className="truncate text-sm text-muted-foreground sm:text-base">
              {user.email}
            </p>
            <p className="pt-1 text-xs text-muted-foreground sm:text-sm">
              {t("memberSince", { date: memberSinceLabel })}
            </p>
          </div>
          <ProfileLogoutButton className="w-full shrink-0 sm:w-auto sm:pt-1" />
        </div>
      </div>
    </FadeIn>
  );
}
