import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/animations";
import { ProfilePreferences } from "./ProfilePreferences";

export type ProfilePlaceholderKind = "addresses" | "settings";

interface ProfilePlaceholderViewProps {
  kind: ProfilePlaceholderKind;
}

export async function ProfilePlaceholderView({
  kind,
}: ProfilePlaceholderViewProps) {
  const t = await getTranslations(`ProfilePage.${kind}`);

  return (
    <section className="w-full flex-1 py-8 md:py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <FadeIn direction="up">
          <div className="space-y-3">
            <Link
              href="/me"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden />
              {t("backToAccount")}
            </Link>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t("title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.06}>
          <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
            <p className="text-sm font-medium text-foreground">
              {t("comingSoon.title")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("comingSoon.description")}
            </p>
          </div>
        </FadeIn>

        {kind === "settings" && (
          <FadeIn direction="up" delay={0.1}>
            <ProfilePreferences />
          </FadeIn>
        )}
      </div>
    </section>
  );
}
