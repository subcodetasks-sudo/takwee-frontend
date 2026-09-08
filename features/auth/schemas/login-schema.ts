import { z } from "zod";

export type LoginFormErrorMessages = {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
};

export function createLoginSchema(messages: LoginFormErrorMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(8, messages.passwordMinLength),
    rememberMe: z.boolean(),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
