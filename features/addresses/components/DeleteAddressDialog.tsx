"use client";

import React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Address } from "../types";

interface DeleteAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: Address | null;
  onConfirm: () => Promise<void> | void;
  isDeleting?: boolean;
  canDelete?: boolean;
}

export function DeleteAddressDialog({
  open,
  onOpenChange,
  address,
  onConfirm,
  isDeleting = false,
  canDelete = true,
}: DeleteAddressDialogProps) {
  const t = useTranslations("ProfilePage.addresses.deleteDialog");

  if (!address) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-5 border border-border shadow-xl bg-card">
        <DialogHeader className="space-y-1.5 text-start pe-8">
          <DialogTitle className="text-lg font-semibold text-foreground">
            {t("title")}
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
            {!canDelete ? t("cannotDeleteDefault") : t("description")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="h-9 text-xs"
          >
            {t("cancel")}
          </Button>
          {canDelete && (
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                await onConfirm();
                onOpenChange(false);
              }}
              disabled={isDeleting}
              className="h-9 text-xs"
            >
              {isDeleting ? "..." : t("confirm")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

