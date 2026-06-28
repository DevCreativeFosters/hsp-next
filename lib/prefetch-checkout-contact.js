import { getAssignedStoreAddress } from '@lib/api/get-assigned-store-address';
import { getCustomerByEmail } from '@lib/api/get-customer-by-email';
import { getDealerStoreAddress } from '@lib/api/get-dealer-store-address';
import { fetchAPI } from '@lib/fetch-api';

const RETAIL_USER_ADDRESS_QUERY = `
  query($userId: Int!) {
    userAddress(userId: $userId) {
      success
      billing {
        first_name
        last_name
        email
        phone
        address_1
        address_2
        city
        state
        postcode
        country
      }
      shipping {
        first_name
        last_name
        phone
        address_1
        address_2
        city
        state
        postcode
        country
      }
    }
  }
`;

// One-shot cache primer for the /checkout Contact Details summary.
// Run this as soon as the user context resolves to "authenticated"
// (login event OR session restored from localStorage on page load)
// and the result lands in the same localStorage key the /checkout
// page reads on initial render. Net effect: the FIRST visit to
// /checkout paints with populated Contact Details instead of an
// empty card that fills in 300ms later.
//
// Mirrors a trimmed subset of the autofill effect in
// components/forms/checkout/checkout.js — only the bits needed to
// populate the summary card (name, company, email, phone, address
// line). The checkout effect itself still runs and refreshes the
// cache after page-mount, so this is purely a head-start.
//
// Safe to call multiple times — last write wins. Safe to call for
// guests (early-returns on missing id). All network errors are
// swallowed so a flaky WP doesn't cascade into the auth flow.

const STORAGE_KEY_PREFIX = 'hsp_checkout_contact_';

const pickPopulated = (...addrs) =>
  addrs.find(a => a && (a.address1 || a.city || a.postcode)) || null;

const pickPopulatedLegacy = (...addrs) =>
  addrs.find(a => a && (a.streetAddress || a.city || a.postalCode)) || null;

export async function prefetchCheckoutContact(user) {
  if (typeof window === 'undefined') return;
  if (!user?.id || !user?.role) return;

  try {
    let shipping = null;
    let postNameFallback = null;

    if (user.role === 'b2b') {
      const assigned = await getAssignedStoreAddress(user.id, {
        authToken: user.token,
      });
      shipping = pickPopulated(
        assigned?.deliveryAddress,
        assigned?.billingAddress,
      );
      postNameFallback = assigned?.postName || null;
    } else if (user.role === 'dealer') {
      const storeAddr = await getDealerStoreAddress(user.id, {
        authToken: user.token,
      });
      const a = pickPopulatedLegacy(
        storeAddr?.deliveryAddress,
        storeAddr?.billingAddress,
      );
      if (a) {
        // Re-shape to the same `shipping` keys the cache expects.
        shipping = {
          address1: a.streetAddress || '',
          address2: a.aptUnit || '',
          city: a.city || '',
          company: a.addressName || '',
          country: a.country || '',
          phone: a.phoneNo || '',
          postcode: a.postalCode || '',
          state: a.state || '',
        };
      }
    } else {
      // Retail: pull the saved billing+shipping pair from
      // userAddress(userId) and combine with the profile (for
      // company). Same shape /checkout's autofill builds for
      // retail — snake_case from the resolver gets re-mapped to
      // the camelCase keys the cache writer reads below.
      const addrRes = await fetchAPI(RETAIL_USER_ADDRESS_QUERY, {
        variables: { userId: Number(user.id) },
        ...(user.token && { authToken: user.token }),
      });
      const billing = addrRes?.userAddress?.billing;
      const shippingAddr = addrRes?.userAddress?.shipping;
      const src = shippingAddr?.address_1 ? shippingAddr : billing;
      const profile = user.email
        ? await getCustomerByEmail(user.email, {
            authToken: user.token,
          })
        : null;

      if (src?.address_1 || src?.city || src?.postcode || profile) {
        shipping = {
          address1: src?.address_1 || '',
          address2: src?.address_2 || '',
          city: src?.city || '',
          company: profile?.company || '',
          country: src?.country || 'AU',
          phone: src?.phone || profile?.phone || '',
          postcode: src?.postcode || '',
          state: src?.state || '',
        };
      }
    }

    if (!shipping && !postNameFallback) return;

    const resolvedFirstName =
      shipping?.firstName || postNameFallback || user.firstName || '';
    const resolvedLastName =
      shipping?.lastName ||
      (postNameFallback && !shipping?.firstName ? '' : user.lastName || '');
    const resolvedCompany = shipping?.company || '';
    const resolvedEmail = shipping?.email || user.email || '';
    const resolvedPhone = shipping?.phone || '';

    const line = shipping
      ? [
          shipping.address1,
          shipping.address2,
          shipping.city,
          shipping.state,
          shipping.postcode,
          shipping.country,
        ]
          .filter(p => p != null && p !== '' && p !== 0)
          .map(String)
          .join(', ')
      : '';

    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${user.id}`,
      JSON.stringify({
        address: shipping?.address1 || '',
        address_2: shipping?.address2 || '',
        city: shipping?.city || '',
        company: resolvedCompany,
        country: shipping?.country || 'AU',
        dealerAddressLine: line,
        email: resolvedEmail,
        first_name: resolvedFirstName,
        last_name: resolvedLastName,
        phone: resolvedPhone,
        postcode: shipping?.postcode || '',
        state: shipping?.state || '',
      }),
    );
  } catch (err) {
    // Best-effort cache primer — swallow all errors so a flaky WP
    // doesn't cascade into the auth flow. /checkout will still hit
    // the same resolvers on mount and surface any persistent
    // failure there.
    console.warn('[prefetchCheckoutContact] skipped:', err?.message);
  }
}

export function clearCheckoutContactCache(userId) {
  if (typeof window === 'undefined' || !userId) return;
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${userId}`);
  } catch {
    /* localStorage failures aren't actionable here. */
  }
}
