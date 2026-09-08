import { z } from "zod";

/** Letters (any script), spaces, apostrophes, and hyphens — no digits or other symbols. */
const NAME_LETTERS_ONLY = /^[\p{L}\s'.-]+$/u;

/** Digits only (no spaces, dashes, or letters). */
const PHONE_DIGITS_ONLY = /^\d+$/;

export type AddressFormErrorMessages = {
  nameRequired: string;
  nameLettersOnly: string;
  phoneRequired: string;
  phoneNumbersOnly: string;
  countryRequired: string;
  cityRequired: string;
  streetRequired: string;
};

/**
 * Postal / ZIP formats are not numeric in every country (e.g. UK, Canada),
 * so postalCode stays an optional free-text field.
 */
export function createAddressFormSchema(messages: AddressFormErrorMessages) {
  return z.object({
    type: z.enum(["home", "work", "other"]),
    customLabel: z.string(),
    fullName: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .regex(NAME_LETTERS_ONLY, messages.nameLettersOnly),
    phone: z
      .string()
      .trim()
      .min(1, messages.phoneRequired)
      .regex(PHONE_DIGITS_ONLY, messages.phoneNumbersOnly),
    phoneCountryCode: z.string().min(1),
    countryCode: z.string().trim().min(1, messages.countryRequired),
    countryName: z.string().trim().min(1, messages.countryRequired),
    stateOrProvince: z.string(),
    city: z.string().trim().min(1, messages.cityRequired),
    district: z.string(),
    streetAddress: z.string().trim().min(1, messages.streetRequired),
    apartmentOrSuite: z.string(),
    postalCode: z.string(),
    deliveryNotes: z.string(),
  });
}

export type AddressFormValues = z.infer<
  ReturnType<typeof createAddressFormSchema>
>;
