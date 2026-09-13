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
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {LINKS.map((link) => {
          const Icon = link.icon;
          const label = t(`${link.id}.label`);
          const description = t(`${link.id}.description`);
          const comingSoon = link.disabled ? t("wishlist.comingSoon") : null;

          const content = (
            <div className="flex flex-col justify-between h-full min-h-[160px] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-muted/60 text-foreground transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/10 group-hover:text-primary">
                  <Icon className="size-6" aria-hidden />
                </span>
                {!link.disabled ? (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 group-hover:text-foreground group-hover:bg-muted/50">
                    <ChevronRight className="size-4 shrink-0 rtl:rotate-180" />
                  </span>
                ) : comingSoon ? (
                  <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                    {comingSoon}
                  </span>
                ) : null}
              </div>

              <div className="mt-6 space-y-1.5 text-start">
                <span className="block text-base sm:text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {label}
                </span>
                <span className="block text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                  {description}
                </span>
              </div>
            </div>
          );

          const className = cn(
            "group relative block h-full w-full overflow-hidden rounded-2xl border border-border/80 bg-card text-card-foreground shadow-xs transition-all duration-300",
            link.disabled
              ? "cursor-not-allowed opacity-70"
              : "hover:-translate-y-1 hover:border-border hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
                <Link
                  href={link.href}
                  className={className}
                >
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
