"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth";

interface ProfileLogoutButtonProps {
  className?: string;
}

export function ProfileLogoutButton({ className }: ProfileLogoutButtonProps) {
  const t = useTranslations("ProfilePage");
  const { signOut } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className={cn("flex", className)}>
      <Button
        type="button"
        variant="destructive"
        size="default"
        className="w-full gap-2 sm:w-auto"
        onClick={handleSignOut}
        disabled={isSigningOut}
        aria-label={t("logout")}
      >
        <LogOut data-icon="inline-start" aria-hidden />
        {isSigningOut ? t("loggingOut") : t("logout")}
      </Button>
    </div>
  );
}
