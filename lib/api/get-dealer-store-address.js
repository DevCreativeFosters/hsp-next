import { fetchAPI } from '@lib/fetch-api';

// Lokesh's dealer resolver — returns the dealer's store address
// pair (delivery + billing) used to populate:
//
//   /checkout         → Contact Details + delivery address line
//   /account dealer   → Account Details Business Address card
//   /account dealer   → Address tab (Delivery + Billing sub-tabs)
//
// Shape is the legacy storesCustomFields shape (addressName,
// streetAddress, aptUnit, city, state, country, postalCode, phoneNo)
// — same fields the existing AddressForm component already reads,
// so no rendering changes are needed once the data flows in. No
// firstName / lastName / email / company fields — callers must
// fall back to the user profile for those.
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
