import { z } from "zod";
import { addPasswordStrengthIssues } from "@/lib/password-rules";

export type ResetPasswordFormErrorMessages = {
  passwordRequired: string;
  passwordStrength: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
};

export function createResetPasswordSchema(
  messages: ResetPasswordFormErrorMessages
) {
  return z
    .object({
      password: z.string().min(1, messages.passwordRequired),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
    })
    .superRefine((data, ctx) => {
      if (data.password) {
        addPasswordStrengthIssues(
          data.password,
          ctx,
          messages.passwordStrength,
          ["password"],
        );
      }

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
