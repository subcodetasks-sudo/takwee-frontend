import { getTranslations } from "next-intl/server";
import {
  ChevronRight,
  Heart,
  MapPin,
  Package,
  Settings,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { cn } from "@/lib/utils";

type QuickLink =
  | {
      id: string;
      href: "/me/orders" | "/me/addresses" | "/me/settings" | "/wishlist";
      icon: typeof Package;
      disabled?: false;
    }
  | {
      id: string;
      href?: undefined;
      icon: typeof Heart;
      disabled: true;
    };

const LINKS: QuickLink[] = [
  { id: "orders", href: "/me/orders", icon: Package },
  { id: "wishlist", href: "/wishlist", icon: Heart },
  { id: "addresses", href: "/me/addresses", icon: MapPin },
  { id: "settings", href: "/me/settings", icon: Settings },
];

export async function ProfileQuickLinks() {
  const t = await getTranslations("ProfilePage.quickLinks");

  return (
    <FadeIn direction="up" delay={0.08}>
      <StaggerContainer
        staggerDelay={0.08}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2"
      >
        {LINKS.map((link) => {
          const Icon = link.icon;
          const label = t(`${link.id}.label`);
          const description = t(`${link.id}.description`);
          const comingSoon = link.disabled ? t("wishlist.comingSoon") : null;

          const content = (
            <>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1 text-start">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {label}
                  </span>
                  {comingSoon && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {comingSoon}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {description}
                </span>
              </span>
              {!link.disabled && (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground rtl:rotate-180" />
              )}
            </>
          );

          const className = cn(
            "flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors",
            link.disabled
              ? "cursor-not-allowed opacity-70"
              : "hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          );

          return (
            <StaggerItem key={link.id}>
              {link.disabled ? (
                <div
                  className={className}
                  aria-disabled="true"
                  title={comingSoon ?? undefined}
                >
                  {content}
                </div>
              ) : (
                <Link href={link.href} className={className}>
                  {content}
                </Link>
              )}
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </FadeIn>
  );
}
