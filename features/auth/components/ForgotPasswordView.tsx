import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/animations";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export async function ForgotPasswordView() {
  const t = await getTranslations("Auth.forgotPassword");

  return (
    <div className="space-y-8">
      <FadeIn direction="up" delay={0.48} duration={0.55} className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>
      </FadeIn>

      <FadeIn direction="up" delay={0.56} duration={0.55}>
        <ForgotPasswordForm />
      </FadeIn>

      <FadeIn direction="up" delay={0.64} duration={0.5}>
        <p className="text-center text-sm text-muted-foreground">
          {t("rememberPassword")}{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </FadeIn>
    </div>
  );
}
