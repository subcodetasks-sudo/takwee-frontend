import { z } from "zod";

export type VerifyOtpErrorMessages = {
  codeRequired: string;
  codeLength: string;
};

export function createVerifyOtpSchema(messages: VerifyOtpErrorMessages) {
  return z.object({
    code: z
      .string()
      .trim()
      .min(1, messages.codeRequired)
      .length(6, messages.codeLength)
      .regex(/^\d{6}$/, messages.codeLength),
  });
}

export type VerifyOtpFormValues = z.infer<
  ReturnType<typeof createVerifyOtpSchema>
>;
