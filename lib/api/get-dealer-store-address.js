import { fetchAPI } from '@lib/fetch-api';

// Lokesh's dealer-only resolver that returns the dealer's STORE
// address (delivery + billing pair) for the /account portal Address
// tab. Distinct from getDealerCustomerDetails: that one carries the
// dealer's customer-shipping contact (the address goods are
// dispatched to when a dealer places an order), this one carries
// the dealer's physical store address (where their dealership
// operates from).
//
// Shape is the legacy storesCustomFields shape (addressName,
// streetAddress, aptUnit, city, state, country, postalCode, phoneNo)
// — same fields the existing AddressForm component already reads,
// so no rendering changes are needed once the data flows in.
const GET_DEALER_STORE_ADDRESS_QUERY = `
  query GetDealerStoreAddress($userId: ID) {
    dealerStoreAddress(userId: $userId) {
      storeId
      deliveryAddress {
        addressName
        streetAddress
        aptUnit
        city
        state
        country
        postalCode
        phoneNo
      }
      billingAddress {
        addressName
        streetAddress
        aptUnit
        city
        state
        country
        postalCode
      }
    }
  }
`;

export async function getDealerStoreAddress(userId, { authToken } = {}) {
  if (userId == null || userId === '') return null;
  try {
    const res = await fetchAPI(GET_DEALER_STORE_ADDRESS_QUERY, {
      tags: ['dealer-store'],
      variables: { userId: String(userId) },
      ...(authToken && { authToken }),
    });
    return res?.dealerStoreAddress || null;
  } catch (err) {
    console.error('getDealerStoreAddress failed:', err?.message);
    return null;
  }
}
