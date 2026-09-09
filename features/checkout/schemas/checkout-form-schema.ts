import { z } from "zod";

export type CheckoutFormErrorMessages = {
  addressRequired: string;
  paymentRequired: string;
};

export function createCheckoutFormSchema(messages: CheckoutFormErrorMessages) {
  return z.object({
    addressId: z.string().trim().min(1, messages.addressRequired),
    paymentMethod: z.enum(["card", "cashOnDelivery", "bankTransfer"], {
      message: messages.paymentRequired,
    }),
  });
}

export type CheckoutFormValues = z.infer<
  ReturnType<typeof createCheckoutFormSchema>
>;
