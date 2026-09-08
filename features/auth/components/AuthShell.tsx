import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageDropdown } from "@/components/common/LanguageDropdown";
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

  return (
    <div className="flex min-h-dvh flex-1 flex-col lg:flex-row">
      <AuthBrandPanelMotion className="relative hidden min-h-dvh overflow-hidden lg:flex lg:w-[46%] xl:w-1/2">
        <AuthBrandImageMotion>
          <Image
            src="/imgs/hero-slide-2.jpg"
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
                className="inline-flex items-end gap-3 transition-opacity hover:opacity-90"
                aria-label={t("backToStore")}
              >
                <Image
                  src="/imgs/logo-2.webp"
                  alt="Linen Line Store"
                  width={140}
                  height={52}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
                <span className="font-heading text-sm font-semibold tracking-[0.2em] text-background uppercase">
                  Linen Line
                </span>
              </Link>
            </AuthBrandCopyItem>
          </AuthBrandCopyMotion>

          <AuthBrandCopyMotion className="max-w-md space-y-3">
            <AuthBrandCopyItem>
              <p className="text-xs font-medium tracking-[0.22em] text-primary-200/90 uppercase">
                Linen Line
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
            <Image
              src="/imgs/logo-2.webp"
              alt="Linen Line Store"
              width={120}
              height={44}
              className="h-8 w-auto object-contain sm:h-9"
            />
            <span className="hidden font-heading text-sm font-semibold tracking-wider text-foreground uppercase sm:inline">
              Linen Line
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
