export type { ApiAddress, ApiAddressInput, ApiCountry, ApiCity } from "./api";

export type AddressType = "home" | "work" | "other";

export interface Address {
  id: string;
  type: AddressType;
  customLabel?: string;
  fullName: string;
  phone: string;
  phoneCountryCode: string;
  countryId: number;
  cityId: number;
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
  deliveryPrice?: number;
  createdAt: string;
}

export type AddressFormData = Omit<Address, "id" | "createdAt" | "deliveryPrice">;

export interface ShippingCountry {
  id: number;
  name: string;
  code: string;
  deliveryPrice: number;
}

export interface ShippingCity {
  id: number;
  name: string;
  deliveryPrice: number;
  countryId?: number;
}
