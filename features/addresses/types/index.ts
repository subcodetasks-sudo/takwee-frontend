export type AddressType = "home" | "work" | "other";

export interface Address {
  id: string;
  type: AddressType;
  customLabel?: string;
  fullName: string;
  phone: string;
  phoneCountryCode: string;
  countryCode: string;
  countryName: string;
  stateOrProvince: string;
  city: string;
  district: string;
  streetAddress: string;
  apartmentOrSuite?: string;
  postalCode?: string;
  deliveryNotes?: string;
  isDefault: boolean;
  createdAt: string;
}

export type AddressFormData = Omit<Address, "id" | "createdAt">;
