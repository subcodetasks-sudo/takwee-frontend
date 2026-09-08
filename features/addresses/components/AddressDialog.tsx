"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddressForm } from "./AddressForm";
import type { Address, AddressFormData } from "../types";

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressToEdit?: Address | null;
  existingAddresses?: Address[];
  onSubmit: (data: AddressFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

export function AddressDialog({
  open,
  onOpenChange,
  addressToEdit,
  existingAddresses,
  onSubmit,
  isSubmitting = false,
}: AddressDialogProps) {
  const t = useTranslations("ProfilePage.addresses");

  const isEditing = !!addressToEdit;

  const handleSubmit = async (data: AddressFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full sm:max-w-xl max-h-[90dvh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border border-border shadow-xl bg-card"
        showCloseButton
      >
        <DialogHeader className="border-b border-border/60 bg-muted/20 px-5 py-4 sm:px-6 sm:py-4.5 pe-12 sm:pe-14 text-start shrink-0">
          <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground">
            {isEditing ? t("form.editTitle") : t("form.addTitle")}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            {t("form.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <AddressForm
          key={addressToEdit ? addressToEdit.id : "new-address"}
          initialData={addressToEdit}
          existingAddresses={existingAddresses}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

