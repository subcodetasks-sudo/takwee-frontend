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
import { useCheckout } from "../hooks/useCheckout";
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

function todayYmd(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function CheckoutView() {
  const t = useTranslations("CheckoutPage");
  const router = useRouter();
  const { items, itemCount, subtotalTRY, isHydrated } = useCart();
  const { addresses, isLoading: isAddressesLoading, addAddress, isAdding } =
    useAddresses();
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>("");

  const schema = useMemo(
    () =>
      createCheckoutFormSchema({
        addressRequired: t("shipping.errors.required"),
        holderNameRequired: t("payment.errors.holderNameRequired"),
        holderNameMax: t("payment.errors.holderNameMax"),
        transferDateRequired: t("payment.errors.transferDateRequired"),
        transferDateInvalid: t("payment.errors.transferDateInvalid"),
        transferDateFuture: t("payment.errors.transferDateFuture"),
        receiptRequired: t("payment.errors.receiptRequired"),
        receiptInvalidType: t("payment.errors.receiptInvalidType"),
        receiptTooLarge: t("payment.errors.receiptTooLarge"),
      }),
    [t],
  );

  const defaultAddressId =
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "";

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      addressId: defaultAddressId,
      paymentMethod: "bankTransfer",
      transferHolderName: "",
      transferDate: todayYmd(),
    },
  });

  const selectedAddressId = watch("addressId");

  const {
    preview,
    isPreviewLoading,
    applyCoupon,
    isApplyingCoupon,
    removeCoupon,
    isRemovingCoupon,
    placeOrder,
    isPlacingOrder,
    submitBankTransferProof,
    clearCartAfterCheckout,
  } = useCheckout({
    addressId: selectedAddressId,
    couponCode: couponCode || undefined,
  });

  const handleApplyCoupon = async (code: string) => {
    try {
      const result = await applyCoupon(code);
      setCouponCode(result.code);
      gooeyToast.success(t("toasts.couponApplied"), {
        description: t("toasts.couponAppliedDescription", { code: result.code }),
      });
    } catch (error) {
      gooeyToast.error(
        error instanceof Error && error.message
          ? error.message
          : t("toasts.couponError"),
      );
    }
  };

  const handleRemoveCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponCode("");
      return;
    }

    try {
      await removeCoupon(couponCode);
      setCouponCode("");
      gooeyToast.success(t("toasts.couponRemoved"));
    } catch (error) {
      gooeyToast.error(
        error instanceof Error && error.message
          ? error.message
          : t("toasts.couponRemoveError"),
      );
    }
  };

  useEffect(() => {
    if (defaultAddressId && !selectedAddressId) {
      setValue("addressId", defaultAddressId, { shouldValidate: false });
    }
  }, [defaultAddressId, selectedAddressId, setValue]);

  const handleAddAddress = async (data: AddressFormData) => {
    try {
      const created = await addAddress(data);
      if (created?.id) {
        setValue("addressId", created.id, { shouldValidate: true });
      }
    } catch (error) {
      gooeyToast.error(
        error instanceof Error && error.message
          ? error.message
          : t("toasts.error"),
      );
      throw error;
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const address = addresses.find((a) => a.id === values.addressId);
    if (!address || items.length === 0) return;

    const checkoutPromise = (async () => {
      const { order } = await placeOrder({
        items,
        addressId: values.addressId,
        paymentMethod: values.paymentMethod,
        couponCode: couponCode || undefined,
        shippingAddress: mapAddressToShipping(address),
        subtotalTRY,
      });

      // Cart must clear once the order exists to avoid duplicate checkouts.
      clearCartAfterCheckout();

      const proof = await submitBankTransferProof({
        orderId: order.id,
        transferHolderName: values.transferHolderName,
        transferDate: values.transferDate,
        receipt: values.receipt,
      });

      return proof.order ?? order;
    })();

    gooeyToast.promise(checkoutPromise, {
      loading: t("toasts.placing"),
      success: t("toasts.success"),
      error: (err: unknown) =>
        err instanceof Error && err.message ? err.message : t("toasts.error"),
      description: {
        success: (order) =>
          t("toasts.successDescription", {
            number: order?.number || "",
          }),
        error: (err: unknown) =>
          err instanceof Error && err.message ? err.message : undefined,
      },
      timing: { displayDuration: 6000 },
    });

    try {
      const order = await checkoutPromise;
      saveCheckoutOrder(order);
      router.push("/checkout/confirmation");
    } catch {
      // Order may already exist if proof upload failed after place-order.
      // Handled by gooeyToast.promise error state
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
    if (isPlacingOrder) {
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
                    isLoading={isAddressesLoading}
                  />
                )}
              />

              <CheckoutPaymentSection
                control={control}
                register={register}
                setValue={setValue}
                errors={errors}
              />
            </div>

            <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28">
              <CheckoutOrderSummary
                items={items}
                itemCount={itemCount}
                subtotalTRY={subtotalTRY}
                pricing={preview?.pricing}
                isPreviewLoading={isPreviewLoading}
                couponCode={couponCode}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
                isApplyingCoupon={isApplyingCoupon || isRemovingCoupon}
                isSubmitting={isPlacingOrder}
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
