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

export function createCheckoutFormSchema(messages: CheckoutFormErrorMessages) {
  return z.object({
    addressId: z.string().trim().min(1, messages.addressRequired),
    paymentMethod: z.literal("bankTransfer"),
    transferHolderName: z
      .string()
      .trim()
      .min(1, messages.holderNameRequired)
      .max(150, messages.holderNameMax),
    transferDate: z
      .string()
      .trim()
      .min(1, messages.transferDateRequired)
      .regex(/^\d{4}-\d{2}-\d{2}$/, messages.transferDateInvalid)
      .refine((value) => value <= todayYmd(), {
        message: messages.transferDateFuture,
      }),
    receipt: z
      .custom<File>((value) => value instanceof File, {
        message: messages.receiptRequired,
      })
      .refine((file) => RECEIPT_MIME_TYPES.has(file.type), {
        message: messages.receiptInvalidType,
      })
      .refine((file) => file.size <= RECEIPT_MAX_BYTES, {
        message: messages.receiptTooLarge,
      }),
  });
}

export type CheckoutFormValues = z.infer<
  ReturnType<typeof createCheckoutFormSchema>
>;

export { RECEIPT_MAX_BYTES, RECEIPT_MIME_TYPES };
