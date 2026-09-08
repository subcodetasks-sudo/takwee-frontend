import { z } from "zod";

/** Letters (any script), spaces, apostrophes, and hyphens — no digits or other symbols. */
const NAME_LETTERS_ONLY = /^[\p{L}\s'.-]+$/u;

export type ProfileDetailsErrorMessages = {
  nameRequired: string;
  nameLettersOnly: string;
  emailRequired: string;
  emailInvalid: string;
};

export function createProfileDetailsSchema(
  messages: ProfileDetailsErrorMessages
) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .regex(NAME_LETTERS_ONLY, messages.nameLettersOnly),
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    avatarUrl: z.string().optional(),
  });
}

export type ProfileDetailsFormValues = z.infer<
  ReturnType<typeof createProfileDetailsSchema>
>;
