import { z } from "zod";

export type ForgotPasswordFormErrorMessages = {
  emailRequired: string;
  emailInvalid: string;
};

export function createForgotPasswordSchema(
  messages: ForgotPasswordFormErrorMessages
) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
  });
}

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
