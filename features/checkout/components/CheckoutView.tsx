"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { gooeyToast } from "@/components/ui/goey-toaster";
import { AddressDialog, useAddresses } from "@/features/addresses";
import type { Address, AddressFormData } from "@/features/addresses/types";
import { useAuth } from "@/features/auth";
import { useCart } from "@/features/cart";
import type { CartItem } from "@/features/cart/types";
import { useSettings } from "@/features/settings";
import { useCurrency } from "@/hooks/useCurrency";
import { zodResolver } from "@/lib/zod-resolver";
import { useCheckout } from "../hooks/useCheckout";
import { usePaymentWays } from "../hooks/usePaymentWays";
import {
  createCheckoutFormSchema,
  type CheckoutFormValues,
} from "../schemas";
import { saveCheckoutOrder } from "../utils/checkout-session";
import { mapAddressToShipping } from "../utils/map-address-to-shipping";
import {
  buildWhatsappCartText,
  formatDeliveryAddress,
  formatOrderAmount,
  resolveOrderWhatsappTarget,
  withWhatsappText,
} from "../utils/whatsapp-order";
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

function draftCustomerLines(
  t: ReturnType<typeof useTranslations>,
  address: Address | null,
  userName?: string | null,
  userMobile?: string | null,
): string[] {
  const name = address?.fullName?.trim() || userName?.trim();
  const phone = address?.phone
    ? [address.phoneCountryCode?.trim(), address.phone.trim()]
        .filter(Boolean)
        .join(" ")
    : userMobile?.trim();
  const formattedAddress = formatDeliveryAddress(address);

  return [
    name
      ? t("payment.whatsappDraft.name", { value: name })
      : t("payment.whatsappDraft.nameMissing"),
    phone
      ? t("payment.whatsappDraft.phone", { value: phone })
      : t("payment.whatsappDraft.phoneMissing"),
    formattedAddress
      ? t("payment.whatsappDraft.address", { value: formattedAddress })
      : t("payment.whatsappDraft.addressMissing"),
  ];
}

function productLineName(
  item: CartItem,
  tProducts: ReturnType<typeof useTranslations>,
) {
  return (
    item.product.name?.trim() ||
    (tProducts.has(item.product.nameKey)
      ? tProducts(item.product.nameKey)
      : item.product.nameKey)
  );
}

export function CheckoutView() {
  const t = useTranslations("CheckoutPage");
  const tProducts = useTranslations("Products");
  const locale = useLocale();
  const router = useRouter();
  const { items, itemCount, subtotalTRY, isHydrated } = useCart();
  const { user } = useAuth();
  const { appName, contactPhone, contactWhatsapp } = useSettings();
  const { currencyConfig } = useCurrency();
  const { paymentWays } = usePaymentWays();
  const { addresses, isLoading: isAddressesLoading, addAddress, isAdding } =
    useAddresses();
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string>("");

  const hasTransferWays = paymentWays.some((way) => way.kind === "transfer");

  const schema = useMemo(
    () =>
      createCheckoutFormSchema(
        {
          addressRequired: t("shipping.errors.required"),
          paymentWayRequired: t("payment.errors.paymentWayRequired"),
          holderNameRequired: t("payment.errors.holderNameRequired"),
          holderNameMax: t("payment.errors.holderNameMax"),
          transferDateRequired: t("payment.errors.transferDateRequired"),
          transferDateInvalid: t("payment.errors.transferDateInvalid"),
          transferDateFuture: t("payment.errors.transferDateFuture"),
          receiptRequired: t("payment.errors.receiptRequired"),
          receiptInvalidType: t("payment.errors.receiptInvalidType"),
          receiptTooLarge: t("payment.errors.receiptTooLarge"),
        },
        { requirePaymentWay: hasTransferWays },
      ),
    [hasTransferWays, t],
  );
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

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
    resolver: (values, context, options) =>
      zodResolver(schemaRef.current)(values, context, options),
    defaultValues: {
      addressId: defaultAddressId,
      paymentMethod: "bankTransfer",
      paymentWayId: "",
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

  const handleOrderViaWhatsApp = () => {
    if (items.length === 0) return;

    const apiWhatsapp = paymentWays.find((way) => way.kind === "whatsapp");
    const whatsappTarget = resolveOrderWhatsappTarget([
      contactPhone,
      contactWhatsapp,
      apiWhatsapp?.accountNumber,
    ]).href;

    if (!whatsappTarget) {
      gooeyToast.error(t("payment.whatsappUnavailable"));
      return;
    }

    const address =
      addresses.find((entry) => entry.id === selectedAddressId) ?? null;
    const amountTRY = preview?.pricing.total ?? subtotalTRY;
    const text = buildWhatsappCartText({
      greeting: t("payment.whatsappDraft.greeting", { name: appName }),
      intro: t("payment.whatsappDraft.intro"),
      detailsTitle: t("payment.whatsappDraft.detailsTitle"),
      items: items.map((item) => {
        const color = item.product.colors.find(
          (entry) => entry.id === item.selectedColorId,
        );
        const colorName =
          color?.name?.trim() ||
          (color?.nameKey && tProducts.has(color.nameKey)
            ? tProducts(color.nameKey)
            : "");
        const lineTotal = formatOrderAmount(
          item.product.priceTRY * item.quantity,
          currencyConfig.symbol,
          currencyConfig.rateAgainstTRY,
          locale,
        );
        const meta = [
          colorName
            ? t("payment.whatsappDraft.color", { value: colorName })
            : "",
          item.selectedSize
            ? t("payment.whatsappDraft.size", { value: item.selectedSize })
            : "",
          t("payment.whatsappDraft.quantity", { value: item.quantity }),
          t("payment.whatsappDraft.price", { value: lineTotal }),
        ].filter(Boolean);

        return { name: productLineName(item, tProducts), meta };
      }),
      totalLine: t("payment.whatsappDraft.total", {
        total: formatOrderAmount(
          amountTRY,
          currencyConfig.symbol,
          currencyConfig.rateAgainstTRY,
          locale,
        ),
      }),
      customerTitle: t("payment.whatsappDraft.customerTitle"),
      customerLines: draftCustomerLines(t, address, user?.name, user?.mobile),
      closing: t("payment.whatsappDraft.closing"),
    });

    window.open(withWhatsappText(whatsappTarget, text), "_blank", "noopener,noreferrer");
  };

  const onSubmit = handleSubmit(async (values) => {
    const address = addresses.find((a) => a.id === values.addressId);
    if (!address || items.length === 0) return;

    const checkoutPromise = (async () => {
      const { order } = await placeOrder({
        items,
        addressId: values.addressId,
        paymentMethod: "bankTransfer",
        paymentWayId: values.paymentWayId,
        couponCode: couponCode || undefined,
        shippingAddress: mapAddressToShipping(address),
        subtotalTRY,
      });

      // Cart must clear once the order exists to avoid duplicate checkouts.
      clearCartAfterCheckout();

      if (!(values.receipt instanceof File) || !values.transferHolderName || !values.transferDate) {
        throw new Error(t("payment.errors.receiptRequired"));
      }

      const proof = await submitBankTransferProof({
        orderId: order.id,
        transferHolderName: values.transferHolderName,
        transferDate: values.transferDate,
        receipt: values.receipt,
      });

      const placed = proof.order ?? order;
      const selected = paymentWays.find((way) => way.id === values.paymentWayId);
      return {
        ...placed,
        payment: placed.payment
          ? {
              ...placed.payment,
              label: selected?.name || placed.payment.label,
            }
          : placed.payment,
      };
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
      // The toast already reports the failure.
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
                onOrderViaWhatsApp={handleOrderViaWhatsApp}
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
                onOrderViaWhatsApp={handleOrderViaWhatsApp}
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
