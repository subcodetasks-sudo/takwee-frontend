import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";
import { getSettings } from "@/features/settings/api/get-settings";
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
  const settings = await getSettings();
  const logoSrc = settings?.siteLogo || "/imgs/logo.webp";
  const brandLabel = settings?.appName || t("brandName");

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <AuthGrainientBackground />

      <AuthFormHeaderMotion className="relative z-10 flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-85"
          aria-label={t("backToStore")}
        >
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center sm:h-9 sm:w-9">
            <Image
              src={logoSrc}
              alt={brandLabel}
              width={36}
              height={36}
              priority
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
          </span>
          <span className="font-heading text-sm font-semibold leading-none tracking-wider text-foreground uppercase">
            {brandLabel}
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
