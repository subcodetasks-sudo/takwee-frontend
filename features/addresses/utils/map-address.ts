import type { Address, AddressFormData, AddressType } from "../types";
import type { ApiAddress, ApiAddressInput } from "../types/api";

const HOME_LABELS = new Set(["home", "منزل", "المنزل", "ev"]);
const WORK_LABELS = new Set(["work", "office", "عمل", "العمل", "iş", "is", "ofis"]);

function optionalText(value: string | null | undefined): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function mapLabelToType(label: string | null | undefined): {
  type: AddressType;
  customLabel?: string;
} {
  const normalized = (label ?? "").trim();
  if (!normalized) return { type: "other" };

  const key = normalized.toLowerCase();
  if (HOME_LABELS.has(key)) return { type: "home" };
  if (WORK_LABELS.has(key)) return { type: "work" };
  return { type: "other", customLabel: normalized };
}

export function mapTypeToLabel(formData: Pick<AddressFormData, "type" | "customLabel">): string {
  if (formData.type === "home") return "Home";
  if (formData.type === "work") return "Work";
  return formData.customLabel?.trim() || "Other";
}

export function mapAddress(data: ApiAddress): Address {
  const { type, customLabel } = mapLabelToType(data.label);

  return {
    id: String(data.id),
    type,
    customLabel,
    fullName: data.recipient_name || "",
    phone: data.phone || "",
    phoneCountryCode: data.phone_code || "",
    countryId: toNumber(data.country_id),
    cityId: toNumber(data.city_id),
    countryCode: data.country?.code || "",
    countryName: data.country?.name || "",
    stateOrProvince: optionalText(data.region) ?? "",
    city: data.city?.name || "",
    district: optionalText(data.district) ?? "",
    streetAddress: data.street || "",
    apartmentOrSuite: optionalText(data.apartment),
    postalCode: optionalText(data.postal_code),
    deliveryNotes: optionalText(data.delivery_instructions),
    isDefault: Boolean(data.is_default),
    deliveryPrice:
      data.delivery_price == null ? undefined : toNumber(data.delivery_price),
    createdAt: data.created_at || new Date().toISOString(),
  };
}

export function mapAddresses(items: ApiAddress[] | null | undefined): Address[] {
  if (!Array.isArray(items)) return [];
  return items.map(mapAddress);
}

export function mapAddressFormToApi(formData: AddressFormData): ApiAddressInput {
  const payload: ApiAddressInput = {
    label: mapTypeToLabel(formData),
    recipient_name: formData.fullName.trim(),
    phone_code: formData.phoneCountryCode.trim(),
    phone: formData.phone.trim(),
    country_id: formData.countryId,
    city_id: formData.cityId,
    street: formData.streetAddress.trim(),
    is_default: formData.isDefault,
  };

  const region = optionalText(formData.stateOrProvince);
  const district = optionalText(formData.district);
  const apartment = optionalText(formData.apartmentOrSuite);
  const postal = optionalText(formData.postalCode);
  const notes = optionalText(formData.deliveryNotes);

  if (region) payload.region = region;
  if (district) payload.district = district;
  if (apartment) payload.apartment = apartment;
  if (postal) payload.postal_code = postal;
  if (notes) payload.delivery_instructions = notes;

  return payload;
}
