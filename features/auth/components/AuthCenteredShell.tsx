import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";
import { getSettings } from "@/features/settings/api/get-settings";
import { AuthGrainientBackground } from "./AuthGrainientBackground";
import { AuthFormBodyMotion, AuthFormHeaderMotion } from "./AuthShellMotion";

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
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-85"
            aria-label={brandLabel}
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
            <span className="hidden font-heading text-sm font-semibold leading-none tracking-wider text-foreground uppercase sm:inline">
              {brandLabel}
            </span>
          </Link>
          <Link
            href="/"
            className="group inline-flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              className="size-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5"
              aria-hidden
            />
            <span className="truncate">{t("backToStore")}</span>
          </Link>
        </div>
        <LanguageDropdown />
      </AuthFormHeaderMotion>

      <AuthFormBodyMotion className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
        <div className="w-full max-w-md">{children}</div>
      </AuthFormBodyMotion>
    </div>
  );
}
