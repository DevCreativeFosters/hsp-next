import { fetchAPI } from '@lib/fetch-api';

// Lokesh's Dealer-role equivalent of getAssignedStoreAddress. Returns
// the dealer's customer-facing billing + shipping contact (the address
// the order ships to / invoices from) in one round-trip.
//
// Use the customerShippingAddress when populating the Dealer checkout
// Contact Details summary — that's where the order actually goes.
// customerBillingAddress is returned for completeness.
const GET_DEALER_CUSTOMER_DETAILS_QUERY = `
  mutation GetDealerCustomerDetails($userId: ID!) {
    getDealerCustomerDetails(input: { userId: $userId }) {
      success
      message
      customerBillingAddress {
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
      customerShippingAddress {
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

export async function getDealerCustomerDetails(userId, { authToken } = {}) {
  if (userId == null || userId === '') return null;
  try {
    const res = await fetchAPI(GET_DEALER_CUSTOMER_DETAILS_QUERY, {
      tags: ['dealer-customer'],
      variables: { userId: String(userId) },
      ...(authToken && { authToken }),
    });
    const payload = res?.getDealerCustomerDetails;
    return payload?.success ? payload : null;
  } catch (err) {
    console.error('getDealerCustomerDetails failed:', err?.message);
    return null;
  }
}
