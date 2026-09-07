import { getLocale, getTranslations } from "next-intl/server";
import { FadeIn } from "@/components/animations";
import type { ProfileUser } from "../types";

interface ProfileHeroProps {
  user: ProfileUser;
}

export async function ProfileHero({ user }: ProfileHeroProps) {
  const t = await getTranslations("ProfilePage.hero");
  const locale = await getLocale();

  const memberSinceLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(new Date(user.memberSince));

  return (
    <FadeIn direction="up">
      <div className="flex min-h-44 flex-col items-center justify-start gap-5 border-b border-border/70 py-10 text-center sm:min-h-52 sm:flex-row sm:items-start sm:gap-8 sm:py-14 sm:text-start md:min-h-60 md:py-16">
        <div
          className="flex size-20 shrink-0 items-center justify-center rounded-full border border-border bg-primary-50 text-xl font-semibold tracking-wide text-primary-800 dark:bg-primary-950/60 dark:text-primary-200 sm:size-24 sm:text-2xl md:size-28 md:text-3xl"
          aria-hidden
        >
          {user.initials}
        </div>
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
      </div>
    </FadeIn>
  );
}
