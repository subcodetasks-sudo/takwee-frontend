"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { AddressCard } from "./AddressCard";
import { AddressDialog } from "./AddressDialog";
import { DeleteAddressDialog } from "./DeleteAddressDialog";
import { useAddresses } from "../hooks/useAddresses";
import type { Address, AddressFormData } from "../types";

export function AddressesList() {
  const t = useTranslations("ProfilePage.addresses");
  const {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isAdding,
    isUpdating,
    isDeleting,
    isSettingDefault,
    isError,
    refetch,
  } = useAddresses();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (address: Address) => {
    setEditingAddress(address);
    setDialogOpen(true);
  };

  const handleOpenDelete = (address: Address) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
  };

  const handleSubmitForm = async (formData: AddressFormData) => {
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, formData);
      } else {
        await addAddress(formData);
      }
      gooeyToast.success(t("toasts.saveSuccess"));
    } catch (error) {
      gooeyToast.error(
        error instanceof Error && error.message
          ? error.message
          : t("toasts.saveError"),
      );
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;
    try {
      await deleteAddress(addressToDelete.id);
      gooeyToast.success(t("toasts.deleteSuccess"));
    } catch (error) {
      gooeyToast.error(
        error instanceof Error && error.message
          ? error.message
          : t("toasts.deleteError"),
      );
      throw error;
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      gooeyToast.success(t("toasts.defaultSuccess"));
    } catch (error) {
      gooeyToast.error(
        error instanceof Error && error.message
          ? error.message
          : t("toasts.defaultError"),
      );
    }
  };

  const canDeleteAddress = (addr: Address | null) => {
    if (!addr) return false;
    // Cannot delete if it's the only address and is default
    if (addresses.length <= 1 && addr.isDefault) return false;
    return true;
  };

  if (isError && addresses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
        <p className="text-base font-semibold text-foreground">
          {t("loadError.title")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
          {t("loadError.description")}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => void refetch()}
          className="mt-5 text-xs"
        >
          {t("loadError.retry")}
        </Button>
      </div>
    );
  }

  if (isLoading && addresses.length === 0) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-8 w-28 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-muted animate-pulse" />
                  <div className="h-4 w-20 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-3.5 w-1/2 rounded bg-muted/80 animate-pulse" />
              </div>
              <div className="pt-2 border-t border-border/40 flex justify-end gap-2">
                <div className="h-7 w-16 rounded-md bg-muted animate-pulse" />
                <div className="h-7 w-16 rounded-md bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <>
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center">
          <p className="text-base font-semibold text-foreground">
            {t("empty.title")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
            {t("empty.description")}
          </p>
          <Button
            type="button"
            onClick={handleOpenAdd}
            className="mt-5 gap-2 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden />
            {t("empty.cta")}
          </Button>
        </div>

        <AddressDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          addressToEdit={editingAddress}
          existingAddresses={addresses}
          onSubmit={handleSubmitForm}
          isSubmitting={isAdding || isUpdating}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {t("addressCount", { count: addresses.length })}
          </span>
          <Button
            type="button"
            onClick={handleOpenAdd}
            size="sm"
            className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-3.5" aria-hidden />
            {t("addAddress")}
          </Button>
        </div>

        <StaggerContainer
          staggerDelay={0.06}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {addresses.map((address) => (
            <StaggerItem key={address.id}>
              <AddressCard
                address={address}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onSetDefault={handleSetDefault}
                isSettingDefault={isSettingDefault}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      <AddressDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        addressToEdit={editingAddress}
        existingAddresses={addresses}
        onSubmit={handleSubmitForm}
        isSubmitting={isAdding || isUpdating}
      />

      <DeleteAddressDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        address={addressToDelete}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        canDelete={canDeleteAddress(addressToDelete)}
      />
    </>
  );
}

