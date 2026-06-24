import { fetchAPI } from '@lib/fetch-api';

// Lokesh's `storeById($storeId: ID!)` resolver. Returns just the
// delivery + billing address pair for a dealer store, keyed by the
// store's custom storeId (e.g. "2558"). Used by the portal's
// /account/* Address tab to render the saved business addresses.
//
// The storeId is the value of the `storeId` custom field on the Store
// post type — not WP's databaseId. The B2B / dealer user's store can be
// resolved first via getStoreByUserId(userId) which returns the
// matching store record (and its storeId), then this helper pulls the
// addresses for that storeId.
const GET_STORE_BY_ID_QUERY = `
  query GetStoreById($storeId: ID!) {
    storeById(storeId: $storeId) {
      storeId
      deliveryAddress {
        addressName
        streetAddress
        aptUnit
        city
        state
        country
        postalCode
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

export async function getStoreById(storeId, { authToken } = {}) {
  if (storeId == null || storeId === '') return null;
  try {
    const res = await fetchAPI(GET_STORE_BY_ID_QUERY, {
      tags: ['store'],
      variables: { storeId: String(storeId) },
      ...(authToken && { authToken }),
    });
    return res?.storeById ?? null;
  } catch (err) {
    console.error('storeById lookup failed:', err?.message);
    return null;
  }
}
