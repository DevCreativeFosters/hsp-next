import { fetchAPI } from '@lib/fetch-api';

// Lokesh's all-in-one resolver for the dealer/B2B store address pair.
// Replaces the previous storeById($storeId) chain (which depended on
// the storeId ACF being populated on the assigned Store post, and fell
// back through StoreFragment-embedded address + generic addressFields
// when it wasn't). This resolver takes a userId and does the user→store
// lookup server-side, then returns both addresses + a few identifying
// fields in a single round-trip.
const GET_ASSIGNED_STORE_ADDRESS_QUERY = `
  mutation GetMyStoreAddress($clientMutationId: String, $userId: ID) {
    getAssignedStoreAddress(input: {
      clientMutationId: $clientMutationId
      userId: $userId
    }) {
      success
      message
      storeId
      storeName
      postName
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

export async function getAssignedStoreAddress(userId, { authToken } = {}) {
  if (userId == null || userId === '') return null;
  try {
    const res = await fetchAPI(GET_ASSIGNED_STORE_ADDRESS_QUERY, {
      tags: ['store'],
      variables: { userId: String(userId) },
      ...(authToken && { authToken }),
    });
    const payload = res?.getAssignedStoreAddress;
    return payload?.success ? payload : null;
  } catch (err) {
    console.error('getAssignedStoreAddress failed:', err?.message);
    return null;
  }
}
