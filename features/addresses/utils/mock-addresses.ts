import type { Address } from "../types";

export const INITIAL_MOCK_ADDRESSES: Address[] = [
  {
    id: "addr_1",
    type: "home",
    fullName: "Layla Al-Hassan",
    phone: "501234567",
    phoneCountryCode: "+966",
    countryCode: "SA",
    countryName: "Saudi Arabia",
    stateOrProvince: "Riyadh Province",
    city: "Riyadh",
    district: "Al Olaya",
    streetAddress: "Prince Muhammad Ibn Abd Al Aziz St, Building 42",
    apartmentOrSuite: "Apt 5B",
    postalCode: "12213",
    deliveryNotes: "Ring doorbell twice, please handle garment parcel with care.",
    isDefault: true,
    createdAt: "2024-03-15T10:00:00.000Z",
  },
  {
    id: "addr_2",
    type: "work",
    fullName: "Layla Al-Hassan",
    phone: "559876543",
    phoneCountryCode: "+971",
    countryCode: "AE",
    countryName: "United Arab Emirates",
    stateOrProvince: "Dubai",
    city: "Dubai",
    district: "Downtown Dubai",
    streetAddress: "Sheikh Mohammed bin Rashid Blvd, Emaar Square",
    apartmentOrSuite: "Building 3, Level 7",
    postalCode: "00000",
    deliveryNotes: "Deliver to front reception desk.",
    isDefault: false,
    createdAt: "2024-04-10T14:30:00.000Z",
  },
];

export function getInitialAddresses(): Address[] {
  return [...INITIAL_MOCK_ADDRESSES];
}

