import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/animations";
import { VerifyOtpForm } from "./VerifyOtpForm";

export async function VerifyView() {
  const t = await getTranslations("Auth.verify");

  return (
    <div className="space-y-8">
      <FadeIn direction="up" className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("title")}
        </h1>
      </FadeIn>

      <FadeIn direction="up" delay={0.08}>
        <VerifyOtpForm />
      </FadeIn>

      <FadeIn direction="up" delay={0.14}>
        <p className="text-center text-sm text-muted-foreground">
          {t("wrongEmail")}{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {t("changeEmail")}
          </Link>
        </p>
      </FadeIn>
    </div>
  );
}
