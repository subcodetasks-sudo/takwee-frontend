"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { AddressCard } from "./AddressCard";
import { AddressDialog } from "./AddressDialog";
import { DeleteAddressDialog } from "./DeleteAddressDialog";
import { useAddresses } from "../hooks/useAddresses";
import type { Address, AddressFormData } from "../types";

export function AddressesList() {
  const t = useTranslations("ProfilePage.addresses");
  const {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    isAdding,
    isUpdating,
    isDeleting,
    isSettingDefault,
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
    if (editingAddress) {
      await updateAddress(editingAddress.id, formData);
    } else {
      await addAddress(formData);
    }
  };

  const handleDeleteConfirm = async () => {
    if (addressToDelete) {
      await deleteAddress(addressToDelete.id);
    }
  };

  const canDeleteAddress = (addr: Address | null) => {
    if (!addr) return false;
    // Cannot delete if it's the only address and is default
    if (addresses.length <= 1 && addr.isDefault) return false;
    return true;
  };

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
                onSetDefault={setDefaultAddress}
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

