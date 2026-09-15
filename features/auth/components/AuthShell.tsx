import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";
import { getSettings } from "@/features/settings/api/get-settings";
import { AuthGrainientBackground } from "./AuthGrainientBackground";
import {
  AuthBrandCopyItem,
  AuthBrandCopyMotion,
  AuthBrandImageMotion,
  AuthBrandOverlayMotion,
  AuthBrandPanelMotion,
  AuthFormBodyMotion,
  AuthFormFooterMotion,
  AuthFormHeaderMotion,
  AuthFormPanelMotion,
} from "./AuthShellMotion";

export async function AuthShell({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("Auth");
  const settings = await getSettings();
  const logoSrc = settings?.siteLogo || "/imgs/logo.webp";
  const brandLabel = settings?.appName || t("brandName");

  return (
    <div className="flex min-h-dvh flex-1 flex-col lg:flex-row">
      <AuthBrandPanelMotion className="relative hidden min-h-dvh overflow-hidden lg:flex lg:w-[46%] xl:w-1/2">
        <AuthBrandImageMotion>
          <Image
            src="/imgs/auth-brand.jpg"
            alt={t("brandImageAlt")}
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
        </AuthBrandImageMotion>

        <AuthBrandOverlayMotion className="absolute inset-0 bg-linear-to-t from-primary-950/85 via-primary-950/45 to-primary-900/25" />

        <div className="relative z-10 flex w-full flex-col justify-between p-8 xl:p-12">
          <AuthBrandCopyMotion>
            <AuthBrandCopyItem>
              <Link
                href="/"
                className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
                aria-label={t("backToStore")}
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <Image
                    src={logoSrc}
                    alt={brandLabel}
                    width={40}
                    height={40}
                    priority
                    className="h-10 w-10 object-contain"
                  />
                </span>
                <span className="font-heading text-sm font-semibold leading-none tracking-[0.2em] text-background uppercase">
                  {brandLabel}
                </span>
              </Link>
            </AuthBrandCopyItem>
          </AuthBrandCopyMotion>

          <AuthBrandCopyMotion className="max-w-md space-y-3">
            <AuthBrandCopyItem>
              <p className="text-xs font-medium tracking-[0.22em] text-primary-200/90 uppercase">
                {brandLabel}
              </p>
            </AuthBrandCopyItem>
            <AuthBrandCopyItem>
              <h1 className="text-3xl font-semibold tracking-tight text-primary-foreground xl:text-4xl">
                {t("brandHeadline")}
              </h1>
            </AuthBrandCopyItem>
            <AuthBrandCopyItem>
              <p className="text-sm leading-relaxed text-primary-100/85 xl:text-base">
                {t("brandTagline")}
              </p>
            </AuthBrandCopyItem>
          </AuthBrandCopyMotion>
        </div>
      </AuthBrandPanelMotion>

      <AuthFormPanelMotion className="relative flex min-h-dvh flex-1 flex-col bg-background">
        <AuthGrainientBackground />

        <AuthFormHeaderMotion className="relative z-10 flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 lg:invisible lg:pointer-events-none"
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
            <span className="hidden font-heading text-sm font-semibold leading-none tracking-wider text-foreground uppercase sm:inline">
              {brandLabel}
            </span>
          </Link>
          <LanguageDropdown />
        </AuthFormHeaderMotion>

        <AuthFormBodyMotion className="relative z-10 flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
          <div className="mx-auto w-full max-w-md">{children}</div>
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
      </AuthFormPanelMotion>
    </div>
  );
}
