import { fetchAPI } from '@lib/fetch-api';

// Checkout email-validation lookup. Returns whether the email is already
// registered, whether there's a live session, and (when authed) the
// customer's saved profile fields so the checkout form can autofill
// firstName/lastName/phone/company instead of forcing them to retype.
//
// Pass authToken when the caller already has a JWT (e.g. immediately after
// a fresh login via userLogin) so the resolver returns the full profile.
// Without authToken, the response is the safe subset: exists, isLoggedIn,
// showPassword — enough to drive the "do you want to log in?" UI.
const CUSTOMER_BY_EMAIL_QUERY = `
  query CustomerByEmail($email: String!) {
    customerByEmail(email: $email) {
      exists
      isLoggedIn
      showPassword
      userId
      email
      firstName
      lastName
      phone
      company
    }
  }
`;

export async function getCustomerByEmail(email, { authToken } = {}) {
  const trimmed = (email || '').trim();
  if (!trimmed || !trimmed.includes('@')) return null;
  try {
    const res = await fetchAPI(CUSTOMER_BY_EMAIL_QUERY, {
      variables: { email: trimmed },
      ...(authToken && { authToken }),
    });
    return res?.customerByEmail ?? null;
  } catch (err) {
    console.error('customerByEmail lookup failed:', err?.message);
    return null;
  }
}
