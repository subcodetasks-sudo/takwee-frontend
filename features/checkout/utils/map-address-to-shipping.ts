import type { Address } from "@/features/addresses/types";
import type { OrderShippingAddress } from "@/features/orders/types";

export function mapAddressToShipping(address: Address): OrderShippingAddress {
  return {
    fullName: address.fullName,
    line1: [address.streetAddress, address.apartmentOrSuite]
      .filter(Boolean)
      .join(", "),
    line2: [address.district, address.stateOrProvince].filter(Boolean).join(", ") ||
      undefined,
    city: address.city,
    region: address.stateOrProvince || undefined,
    postalCode: address.postalCode || undefined,
    country: address.countryName,
    phone: `${address.phoneCountryCode} ${address.phone}`.trim(),
  };
}
