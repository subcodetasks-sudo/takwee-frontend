import { z } from "zod";

const RECEIPT_MAX_BYTES = 5 * 1024 * 1024;
const RECEIPT_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export type CheckoutFormErrorMessages = {
  addressRequired: string;
  paymentWayRequired: string;
  holderNameRequired: string;
  holderNameMax: string;
  transferDateRequired: string;
  transferDateInvalid: string;
  transferDateFuture: string;
  receiptRequired: string;
  receiptInvalidType: string;
  receiptTooLarge: string;
};

function todayYmd(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function createCheckoutFormSchema(
  messages: CheckoutFormErrorMessages,
  options?: { requirePaymentWay?: boolean },
) {
  const requirePaymentWay = options?.requirePaymentWay ?? false;

  return z
    .object({
      addressId: z.string().trim().min(1, messages.addressRequired),
      paymentMethod: z.enum(["bankTransfer", "whatsapp"]),
      paymentWayId: z.string().optional(),
      transferHolderName: z.string().optional(),
      transferDate: z.string().optional(),
      receipt: z.custom<File | undefined>().optional(),
    })
    .superRefine((values, ctx) => {
      if (values.paymentMethod === "whatsapp") return;

      if (requirePaymentWay && !values.paymentWayId?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["paymentWayId"],
          message: messages.paymentWayRequired,
        });
      }

      const holder = values.transferHolderName?.trim() ?? "";
      if (!holder) {
        ctx.addIssue({
          code: "custom",
          path: ["transferHolderName"],
          message: messages.holderNameRequired,
        });
      } else if (holder.length > 150) {
        ctx.addIssue({
          code: "custom",
          path: ["transferHolderName"],
          message: messages.holderNameMax,
        });
      }

      const date = values.transferDate?.trim() ?? "";
      if (!date) {
        ctx.addIssue({
          code: "custom",
          path: ["transferDate"],
          message: messages.transferDateRequired,
        });
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        ctx.addIssue({
          code: "custom",
          path: ["transferDate"],
          message: messages.transferDateInvalid,
        });
      } else if (date > todayYmd()) {
        ctx.addIssue({
          code: "custom",
          path: ["transferDate"],
          message: messages.transferDateFuture,
        });
      }

      const file = values.receipt;
      if (!(file instanceof File)) {
        ctx.addIssue({
          code: "custom",
          path: ["receipt"],
          message: messages.receiptRequired,
        });
        return;
      }
      if (!RECEIPT_MIME_TYPES.has(file.type)) {
        ctx.addIssue({
          code: "custom",
          path: ["receipt"],
          message: messages.receiptInvalidType,
        });
      } else if (file.size > RECEIPT_MAX_BYTES) {
        ctx.addIssue({
          code: "custom",
          path: ["receipt"],
          message: messages.receiptTooLarge,
        });
      }
    });
}

export type CheckoutFormValues = z.infer<
  ReturnType<typeof createCheckoutFormSchema>
>;

export { RECEIPT_MAX_BYTES, RECEIPT_MIME_TYPES };
