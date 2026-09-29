import { z } from "zod";
import { addPasswordStrengthIssues } from "@/lib/password-rules";

export type PasswordFormErrorMessages = {
  currentRequired: string;
  newRequired: string;
  newStrength: string;
  confirmRequired: string;
  mismatch: string;
  sameAsCurrent: string;
};

export function createPasswordFormSchema(messages: PasswordFormErrorMessages) {
  return z
    .object({
      currentPassword: z.string().min(1, messages.currentRequired),
      newPassword: z.string().min(1, messages.newRequired),
      confirmPassword: z.string().min(1, messages.confirmRequired),
    })
    .superRefine((data, ctx) => {
      if (data.newPassword) {
        addPasswordStrengthIssues(
          data.newPassword,
          ctx,
          messages.newStrength,
          ["newPassword"],
        );
      }

      if (
        data.currentPassword &&
        data.newPassword &&
        data.newPassword === data.currentPassword
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["newPassword"],
          message: messages.sameAsCurrent,
        });
      }

      if (
        data.confirmPassword &&
        data.newPassword &&
        data.confirmPassword !== data.newPassword
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: messages.mismatch,
        });
      }
    });
}

export type PasswordFormValues = z.infer<
  ReturnType<typeof createPasswordFormSchema>
>;
