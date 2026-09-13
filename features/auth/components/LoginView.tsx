import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/animations";
import { LoginForm } from "./LoginForm";

export async function LoginView() {
  const t = await getTranslations("Auth.login");

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
        <Suspense>
          <LoginForm />
        </Suspense>
      </FadeIn>

      <FadeIn direction="up" delay={0.64} duration={0.5}>
        <p className="text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            {t("createAccount")}
          </Link>
        </p>
      </FadeIn>
    </div>
  );
}
