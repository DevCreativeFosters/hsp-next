import { fetchAPI } from '@lib/fetch-api';

// Lokesh's updated all-in-one resolver for B2B checkout. Returns the
// dealer's full delivery + billing contact (name, company, address,
// phone, email) in one round-trip. Replaces the previous chain of
// getStoreByUserId mutation + store(databaseId) query + the old
// thin getAssignedStoreAddress shape.
//
// Use the deliveryAddress when populating the checkout Contact
// Details summary — that's the dealer-side shipping contact and is
// what the order should ship against. billingAddress is also
// returned for completeness (invoicing).
const GET_ASSIGNED_STORE_ADDRESS_QUERY = `
  mutation GetAssignedStoreAddress($userId: ID!) {
    getAssignedStoreAddress(input: { userId: $userId }) {
      success
      message
      storeId
      storeName
      postName
      deliveryAddress {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
        phone
        email
      }
      billingAddress {
        firstName
        lastName
        company
        address1
        address2
        city
        state
        postcode
        country
        phone
        email
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
