import { fetchAPI } from '@lib/fetch-api';

// Lokesh's dealer resolver — returns the dealer's store address
// pair (delivery + billing) plus contact + account-terms fields,
// used to populate:
//
//   /checkout         → Contact Details + delivery address line
//   /account dealer   → Account Details Business + Account Terms
//                       cards (Communications / Accounts email,
//                       Credit Limit, Payment Terms)
//   /account dealer   → Address tab (Delivery + Billing sub-tabs)
//
// Address pair uses the legacy storesCustomFields shape
// (addressName, streetAddress, aptUnit, city, state, country,
// postalCode, phoneNo) — same fields the existing AddressForm
// component reads, so no rendering changes are needed on the
// Address tab. communicationEmail / accountEmail / creditLimit /
// paymentTerm are new (2026-07-07) — mapped into the Account
// Details view alongside the address.
const GET_DEALER_STORE_ADDRESS_QUERY = `
  query GetDealerStoreAddress($userId: ID) {
    dealerStoreAddress(userId: $userId) {
      storeId
      communicationEmail
      accountEmail
      creditLimit
      paymentTerm
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
