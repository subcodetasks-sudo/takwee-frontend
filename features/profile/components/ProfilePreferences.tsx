"use client";

import { useTranslations } from "next-intl";
import { Bell, Settings, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { usePreferences } from "../hooks/usePreferences";

export function ProfilePreferences() {
  const t = useTranslations("ProfilePage.preferences");
  const tGlobal = useTranslations("GlobalSettings");
  const { preferences, isLoading, isUpdating, updatePreferences } = usePreferences();

  const handleToggleNotification = async (
    key: "email" | "sms" | "push",
    checked: boolean,
  ) => {
    try {
      await updatePreferences((prev) => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: checked,
        },
      }));
      gooeyToast.success(t("saved"));
    } catch (err: unknown) {
      gooeyToast.error(
        err instanceof Error ? err.message : "Failed to update preferences",
      );
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. Account Notifications Card */}
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5 md:p-6 shadow-xs">
        <div className="flex items-start gap-3.5 border-b border-border/70 pb-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30 text-primary">
            <Bell className="size-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {t("notifications.title")}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              {t("notifications.subtitle")}
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/60 pt-1">
          {/* Email Notification */}
          <div className="flex items-center justify-between gap-4 py-3.5 sm:py-4">
            <div className="min-w-0 space-y-0.5">
              <Label
                htmlFor="pref-notif-email"
                className="text-xs font-medium text-foreground sm:text-sm cursor-pointer"
              >
                {t("notifications.email")}
              </Label>
              <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                {t("notifications.emailHint")}
              </p>
            </div>
            <Switch
              id="pref-notif-email"
              checked={preferences.notifications.email}
              disabled={isLoading || isUpdating}
              onCheckedChange={(checked) =>
                handleToggleNotification("email", checked)
              }
            />
          </div>

          {/* SMS Notification */}
          <div className="flex items-center justify-between gap-4 py-3.5 sm:py-4">
            <div className="min-w-0 space-y-0.5">
              <Label
                htmlFor="pref-notif-sms"
                className="text-xs font-medium text-foreground sm:text-sm cursor-pointer"
              >
                {t("notifications.sms")}
              </Label>
              <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                {t("notifications.smsHint")}
              </p>
            </div>
            <Switch
              id="pref-notif-sms"
              checked={preferences.notifications.sms}
              disabled={isLoading || isUpdating}
              onCheckedChange={(checked) =>
                handleToggleNotification("sms", checked)
              }
            />
          </div>

          {/* Push Notification */}
          <div className="flex items-center justify-between gap-4 py-3.5 sm:py-4">
            <div className="min-w-0 space-y-0.5">
              <Label
                htmlFor="pref-notif-push"
                className="text-xs font-medium text-foreground sm:text-sm cursor-pointer"
              >
                {t("notifications.push")}
              </Label>
              <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                {t("notifications.pushHint")}
              </p>
            </div>
            <Switch
              id="pref-notif-push"
              checked={preferences.notifications.push}
              disabled={isLoading || isUpdating}
              onCheckedChange={(checked) =>
                handleToggleNotification("push", checked)
              }
            />
          </div>
        </div>
      </div>

      {/* 2. Global Boutique Preferences Link Card */}
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5 md:p-6 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-card text-primary">
            <Settings className="size-4" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
              {tGlobal("title")}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              {tGlobal("subtitle")}
            </p>
          </div>
        </div>
        <Link
          href="/settings"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted hover:text-foreground self-start sm:self-auto"
        >
          <span>{tGlobal("title")}</span>
          <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
