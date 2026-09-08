import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/animations";
import { RegisterForm } from "./RegisterForm";

export async function RegisterView() {
  const t = await getTranslations("Auth.register");

  return (
    <div className="space-y-8">
      <FadeIn direction="up" className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("subtitle")}
        </p>
      </FadeIn>

      <FadeIn direction="up" delay={0.08}>
        <RegisterForm />
      </FadeIn>

      <FadeIn direction="up" delay={0.14}>
        <p className="text-center text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
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

export const SignupView = RegisterView;
