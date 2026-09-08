import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/animations";
import { ProfilePreferences } from "./ProfilePreferences";
import { ProfileDetailsForm } from "./ProfileDetailsForm";
import { PasswordForm } from "./PasswordForm";

export async function SettingsView() {
  const t = await getTranslations("ProfilePage.settings");

  return (
    <section className="w-full flex-1 py-5 sm:py-8 md:py-12">
      <div className="space-y-5 sm:space-y-6 md:space-y-8">
        <FadeIn direction="up">
          <div className="space-y-2 sm:space-y-3">
            <Link
              href="/me"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 rtl:rotate-180" aria-hidden />
              {t("backToAccount")}
            </Link>
            <div className="max-w-2xl">
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl md:text-3xl">
                {t("title")}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
                {t("subtitle")}
              </p>
            </div>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 items-stretch gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-6 xl:gap-8">
          <FadeIn direction="up" delay={0.05} className="h-full lg:col-span-7">
            <ProfileDetailsForm />
          </FadeIn>

          <FadeIn direction="up" delay={0.08} className="h-full lg:col-span-5">
            <PasswordForm />
          </FadeIn>

          <FadeIn direction="up" delay={0.1} className="lg:col-span-12">
            <ProfilePreferences />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
