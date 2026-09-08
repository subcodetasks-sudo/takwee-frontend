import { z } from "zod";

/** Letters (any script), spaces, apostrophes, and hyphens — no digits or other symbols. */
const NAME_LETTERS_ONLY = /^[\p{L}\s'.-]+$/u;

export type RegisterFormErrorMessages = {
  nameRequired: string;
  nameMinLength: string;
  nameLettersOnly: string;
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
  confirmPasswordRequired: string;
  passwordMismatch: string;
  termsRequired: string;
};

export function createRegisterSchema(messages: RegisterFormErrorMessages) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, messages.nameRequired)
        .min(2, messages.nameMinLength)
        .regex(NAME_LETTERS_ONLY, messages.nameLettersOnly),
      email: z
        .string()
        .trim()
        .min(1, messages.emailRequired)
        .email(messages.emailInvalid),
      password: z
        .string()
        .min(1, messages.passwordRequired)
        .min(8, messages.passwordMinLength),
      confirmPassword: z.string().min(1, messages.confirmPasswordRequired),
      acceptTerms: z.boolean().refine((val) => val === true, {
        message: messages.termsRequired,
      }),
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

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;

