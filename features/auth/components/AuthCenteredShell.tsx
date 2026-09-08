import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";
import { AuthGrainientBackground } from "./AuthGrainientBackground";
import {
  AuthFormBodyMotion,
  AuthFormFooterMotion,
  AuthFormHeaderMotion,
} from "./AuthShellMotion";

export async function AuthCenteredShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Auth");

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <AuthGrainientBackground />

      <AuthFormHeaderMotion className="relative z-10 flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-85"
          aria-label={t("backToStore")}
        >
          <Image
            src="/imgs/logo-2.webp"
            alt="Linen Line Store"
            width={120}
            height={44}
            className="h-8 w-auto object-contain sm:h-9"
          />
          <span className="font-heading text-sm font-semibold tracking-wider text-foreground uppercase">
            Linen Line
          </span>
        </Link>
        <LanguageDropdown />
      </AuthFormHeaderMotion>

      <AuthFormBodyMotion className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="w-full max-w-md">{children}</div>
      </AuthFormBodyMotion>

      <AuthFormFooterMotion className="relative z-10 px-4 py-4 sm:px-6 lg:px-10">
        <p className="text-center text-xs text-muted-foreground">
          <Link
            href="/"
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {t("backToStore")}
          </Link>
        </p>
      </AuthFormFooterMotion>
    </div>
  );
}
