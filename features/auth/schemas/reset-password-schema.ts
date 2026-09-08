import { z } from "zod";

export type ResetPasswordFormErrorMessages = {
  passwordRequired: string;
  passwordMinLength: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
};

export function createResetPasswordSchema(
  messages: ResetPasswordFormErrorMessages
) {
  return z
    .object({
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMinLength),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
    .superRefine((data, ctx) => {
      if (
        data.confirmPassword &&
        data.password &&
        data.confirmPassword !== data.password
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: messages.passwordMismatch,
        });
      }
    });
}

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
