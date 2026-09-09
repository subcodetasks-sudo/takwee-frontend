"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { AddressDialog, useAddresses } from "@/features/addresses";
import type { AddressFormData } from "@/features/addresses/types";
import { useCart } from "@/features/cart";
import { zodResolver } from "@/lib/zod-resolver";
import { placeMockOrder } from "../api/place-mock-order";
import {
  createCheckoutFormSchema,
  type CheckoutFormValues,
} from "../schemas";
import { saveCheckoutOrder } from "../utils/checkout-session";
import { mapAddressToShipping } from "../utils/map-address-to-shipping";
import { CheckoutEmptyState } from "./CheckoutEmptyState";
import { CheckoutHeader } from "./CheckoutHeader";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { CheckoutPaymentSection } from "./CheckoutPaymentSection";
import { CheckoutShippingSection } from "./CheckoutShippingSection";

export function CheckoutView() {
  const t = useTranslations("CheckoutPage");
  const tProducts = useTranslations("Products");
  const tColors = useTranslations("ProductCard.colors");
  const router = useRouter();
  const { items, itemCount, subtotalTRY, isHydrated, clear } = useCart();
  const { addresses, isLoading, addAddress, isAdding } = useAddresses();
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = useMemo(
    () =>
      createCheckoutFormSchema({
        addressRequired: t("shipping.errors.required"),
        paymentRequired: t("payment.errors.required"),
      }),
    [t],
  );

  const defaultAddressId =
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "";

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      addressId: defaultAddressId,
      paymentMethod: "card",
    },
  });

  useEffect(() => {
    if (defaultAddressId) {
      setValue("addressId", defaultAddressId, { shouldValidate: false });
    }
  }, [defaultAddressId, setValue]);

  const handleAddAddress = async (data: AddressFormData) => {
    const created = await addAddress(data);
    if (created?.id) {
      setValue("addressId", created.id, { shouldValidate: true });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const address = addresses.find((a) => a.id === values.addressId);
    if (!address || items.length === 0) return;

    setIsSubmitting(true);
    try {
      const taxTRY = Math.round(subtotalTRY * 0.1);
      const labels = items.map((item) => {
        const selectedColor =
          item.product.colors.find((c) => c.id === item.selectedColorId) ??
          item.product.colors[0];
        return {
          id: item.id,
          name: tProducts(item.product.nameKey),
          color: selectedColor
            ? tColors(selectedColor.nameKey)
            : undefined,
        };
      });

      const { order } = await placeMockOrder({
        items,
        labels,
        shippingAddress: mapAddressToShipping(address),
        paymentMethod: values.paymentMethod,
        subtotalTRY,
        taxTRY,
      });

      saveCheckoutOrder(order);
      clear();
      gooeyToast.success(t("toasts.success"));
      router.push("/checkout/confirmation");
    } catch {
      gooeyToast.error(t("toasts.error"));
      setIsSubmitting(false);
    }
  });

  if (!isHydrated) {
    return (
      <section className="w-full flex-1 py-4 sm:py-8 md:py-12">
        <div className="space-y-6 sm:space-y-10">
          <CheckoutHeader itemCount={0} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            <div className="lg:col-span-8 space-y-3 sm:space-y-4">
              <div className="h-40 w-full animate-pulse rounded-2xl bg-muted/60" />
              <div className="h-48 w-full animate-pulse rounded-2xl bg-muted/60" />
            </div>
            <div className="lg:col-span-4">
              <div className="h-96 w-full animate-pulse rounded-2xl sm:rounded-3xl bg-muted/60" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    if (isSubmitting) {
      return (
        <section className="w-full flex-1 py-4 sm:py-8 md:py-12">
          <div className="space-y-6 sm:space-y-10">
            <CheckoutHeader itemCount={0} />
            <div className="h-72 w-full animate-pulse rounded-3xl bg-muted/60" />
          </div>
        </section>
      );
    }

    return (
      <section className="w-full flex-1 py-4 sm:py-8 md:py-12">
        <div className="space-y-6 sm:space-y-10">
          <CheckoutHeader itemCount={0} />
          <CheckoutEmptyState />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex-1 py-4 sm:py-8 md:py-12">
      <div className="space-y-5 sm:space-y-8">
        <CheckoutHeader itemCount={itemCount} />

        <form id="checkout-form" onSubmit={onSubmit} className="contents">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 items-start">
            {/* Shipping & payment first; summary last */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4 sm:space-y-5">
              <Controller
                name="addressId"
                control={control}
                render={({ field }) => (
                  <CheckoutShippingSection
                    addresses={addresses}
                    selectedAddressId={field.value}
                    onSelect={field.onChange}
                    onAddAddress={() => setAddressDialogOpen(true)}
                    error={errors.addressId?.message}
                    isLoading={isLoading}
                  />
                )}
              />

              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <CheckoutPaymentSection
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.paymentMethod?.message}
                  />
                )}
              />
            </div>

            <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
              <CheckoutOrderSummary
                items={items}
                itemCount={itemCount}
                subtotalTRY={subtotalTRY}
                isSubmitting={isSubmitting}
              />
            </aside>
          </div>
        </form>
      </div>

      <AddressDialog
        open={addressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        existingAddresses={addresses}
        onSubmit={handleAddAddress}
        isSubmitting={isAdding}
      />
    </section>
  );
}
