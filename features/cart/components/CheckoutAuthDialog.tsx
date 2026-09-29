"use client";

import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "@/i18n/routing";

interface CheckoutAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutAuthDialog({
  open,
  onOpenChange,
}: CheckoutAuthDialogProps) {
  const t = useTranslations("CartPage.authDialog");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border border-warning/30 bg-card p-5 shadow-xl sm:max-w-md">
        <DialogHeader className="space-y-3 text-start pe-8">
          <div className="flex size-10 items-center justify-center rounded-xl bg-warning-muted text-warning">
            <LogIn className="size-5" aria-hidden />
          </div>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {t("description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 text-sm"
          >
            {t("cancel")}
          </Button>
          <Button
            nativeButton={false}
            className="h-10 text-sm"
            render={(props) => (
              <Link
                href={{
                  pathname: "/login",
                  query: { redirect: "/checkout" },
                }}
                {...props}
              />
            )}
          >
            {t("signIn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
