'use client';

import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import clsx from 'clsx';
import { State } from 'country-state-city';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';
import { useCheckout } from '@contexts/checkout';
import { useUserContext } from '@contexts/user';

import { getAssignedStoreAddress } from '@lib/api/get-assigned-store-address';
import { getCustomerByEmail } from '@lib/api/get-customer-by-email';
import { getDealerStoreAddress } from '@lib/api/get-dealer-store-address';
import { getStoreByUserId } from '@lib/api/get-store-by-user-id';
import { getStores } from '@lib/api/get-stores';
import { fetchAPI } from '@lib/fetch-api';
import { formatPrice } from '@lib/helpers';
import normalizeStores from '@lib/normalize-stores';

import Button from '@components/button/button';
import Delivery from '@components/checkout-drawers/delivery';
import SelectLocation from '@components/checkout-drawers/select-location';
import Container from '@components/container/container';
import Loading from '@components/loading/loading';

import LocationIcon from '@assets/icons/location-icon.svg';
import OnSiteFittingIcon from '@assets/icons/onsite-fitting-icon.svg';
import SettingIcon from '@assets/icons/setting-icon.svg';
import TruckIcon from '@assets/icons/truck-icon.svg';
import PaymentIcons from '@assets/images/payment-icon.png';
import PaypalIcon from '@assets/images/paypal.png';

import styles from './checkout.module.scss';

const GET_ACCOUNT_TERMS_QUERY = `
  query GetStoreAccountTerms($userId: Int!) {
    stores(where: { assignedB2bUser: $userId }, first: 1) {
      nodes {
        odooCreditLimit
        odooPaymentTermName
        odooCompanyName
      }
    }
  }
`;

function CheckoutForm() {
  const router = useRouter();
  const { loading: userLoading, setUser, user } = useUserContext();

  const [loading, setLoading] = useState(false);

  const {
    cartItems = [],
    cartSubTotal = 0,
    cartTotal = 0,
    clearCart,
    getCartItems,
    loading: cartLoading,
  } = useCart() || {};

  // Force a fresh cart fetch when the checkout form mounts. Page navigations
  // to /checkout remount the per-page CartProvider, and the provider's own
  // mount-time fetch can race with auth-token hydration — pulling again here
  // makes sure the form always reflects the user's actual cart.
  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  const {
    appliedCoupons,
    applyCoupon,
    checkoutOrder,
    couponMessage,
    createQuote,
    loading: checkoutLoading,
    totalDiscount,
  } = useCheckout();
  const [couponCode, setCouponCode] = useState('');

  // Dealer quote form (amount + notes) shown via "Get A Quote Instead"
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  const [isFormFilled, setIsFormFilled] = useState(false);
  // On-Site Fitting only: after the dealer clicks Confirm
  // Selection (store + date), the drawer collapses to a
  // "Fitting Time Availability" summary and two CTAs appear
  // below the delivery section — Get a Quote and Continue to
  // Payment. The payment card stays gated behind
  // paymentContinued so it only appears once the dealer
  // explicitly opts into the payment step. Other delivery
  // methods ignore this flag (payment card unlocks with
  // isFormFilled directly).
  const [paymentContinued, setPaymentContinued] = useState(false);

  // Read the cached contact-details snapshot from localStorage on
  // initial render so logged-in B2B/dealer users see their populated
  // card the moment /checkout mounts, not after the autofill effect
  // round-trips. The cache is keyed by userId so different accounts
  // never see each other's data. The autofill effect still runs and
  // refreshes from the live resolver — this only solves the
  // first-paint flash.
  const readCachedContactDetails = () => {
    if (typeof window === 'undefined') return null;
    try {
      const uid = localStorage.getItem('userId');
      if (!uid) return null;
      const raw = localStorage.getItem(`hsp_checkout_contact_${uid}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const cachedContact = readCachedContactDetails();

  const [formData, setFormData] = useState({
    additionalCustomerInfo: {
      customer_email: '',
      customer_first_name: '',
      customer_last_name: '',
    },
    address: cachedContact?.address || '',
    address_2: cachedContact?.address_2 || '',
    city: cachedContact?.city || '',

    company: cachedContact?.company || '',

    country: cachedContact?.country || 'AU',

    deliveryCompanyName: '',
    // Optional alternate delivery address — only used when the customer
    // unticks "delivery address is the same as the address listed above"
    // on the Address Details card. When ticked (default), the order ships
    // to the primary address (formData.address, .city, .state, etc.).
    delivery_address: '',
    delivery_address_2: '',
    delivery_city: '',
    delivery_company: '',
    delivery_country: 'AU',
    delivery_postcode: '',
    delivery_same_as_billing: true,
    delivery_state: '',
    email: cachedContact?.email || '',
    first_name: cachedContact?.first_name || '',
    // Dealer-only: chosen availability date for an On-Site
    // Fitting order. After the dealer picks a fitter store, a
    // date input appears in the drawer — this field holds their
    // ISO yyyy-mm-dd selection and is forwarded to WP so the
    // fitter can be scheduled.
    fittingDate: '',
    last_name: cachedContact?.last_name || '',
    marketing: false,
    orderType: '',
    payment_method: '',
    phone: cachedContact?.phone || '',
    postcode: cachedContact?.postcode || '',
    purchaseOrderNumber: '',
    selectedStoreAddress: '',
    state: cachedContact?.state || '',
    termsAndConditions: false,
    vehicleIdentifier: '',
  });

  // Existing-customer email lookup. When the guest enters an email that's
  // already registered, we surface an inline "log in to autofill" prompt
  // below the email field so they don't have to retype everything.
  const [customerLookup, setCustomerLookup] = useState(null);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [emailLookupInFlight, setEmailLookupInFlight] = useState(false);
  const [continueAsGuest, setContinueAsGuest] = useState(false);
  // Portal-mount guard for the guest-gate overlay — createPortal
  // needs document.body which doesn't exist during SSR, so we
  // wait for the client mount effect before flipping this true.
  const [guestGateMounted, setGuestGateMounted] = useState(false);
  useEffect(() => setGuestGateMounted(true), []);
  // Inline "Forgot password?" handler state. The login-form's full
  // forgotPassword flow lives at /login (toggle on that page) — but a
  // user mid-checkout shouldn't have to navigate away. Fire the same
  // forgotPassword mutation here and show the response inline below
  // the password row.
  const [forgotPasswordInProgress, setForgotPasswordInProgress] =
    useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  // Dealer/B2B saved address (for the Contact Details summary card).
  // Same data the portal Address tab shows — same fetch chain too:
  // storeById($storeId) → fall back to the StoreFragment's
  // billingAddress / deliveryAddress → fall back to addressFields
  // (generic store address). Stored as a single flat string for
  // display in the summary block.
  const [dealerAddressLine, setDealerAddressLine] = useState(
    cachedContact?.dealerAddressLine || '',
  );

  const handleForgotPassword = async () => {
    if (!formData.email || !formData.email.includes('@')) {
      setForgotPasswordMessage('❌ Enter a valid email first');
      return;
    }
    setForgotPasswordInProgress(true);
    setForgotPasswordMessage('');
    try {
      const data = await fetchAPI(
        `mutation ForgotPassword($email: String!) {
          forgotPassword(input: { email: $email }) {
            success
            message
          }
        }`,
        { variables: { email: formData.email } },
      );
      const res = data?.forgotPassword;
      if (res?.success) {
        setForgotPasswordMessage(
          `✅ ${res.message || 'Check your email for a reset link'}`,
        );
      } else {
        setForgotPasswordMessage(
          `❌ ${res?.message || 'Something went wrong'}`,
        );
      }
    } catch (err) {
      setForgotPasswordMessage(`❌ ${err?.message || 'Something went wrong'}`);
    } finally {
      setForgotPasswordInProgress(false);
    }
  };

  const checkEmailExists = async emailToCheck => {
    if (!emailToCheck || !emailToCheck.includes('@')) {
      setCustomerLookup(null);
      return;
    }
    setEmailLookupInFlight(true);
    const result = await getCustomerByEmail(emailToCheck);
    setEmailLookupInFlight(false);
    setCustomerLookup(result);
  };

  const handleInlineLogin = async () => {
    if (!formData.email || !loginPassword) return;
    setLoginInProgress(true);
    setLoginError('');
    try {
      // Guest cart migration is now handled centrally by
      // contexts/cart-context.js's authchange listener — it reads the
      // `hsp_local_cart_guest` localStorage key, looks up the
      // dealer's tier pricing for each item, replays via addToCart,
      // and clears the guest shadow. We used to also snapshot+replay
      // here but it caused double-migration (cart-context's listener
      // fires on the same authchange event we dispatch below). Drop
      // the local snapshot so the cart-context migrate is the single
      // source of truth.

      const loginRes = await fetchAPI(
        `
          mutation UserLogin($username: String!, $password: String!) {
            userLogin(input: { username: $username, password: $password }) {
              token
              userId
              role
              error
              message
            }
          }
        `,
        { variables: { password: loginPassword, username: formData.email } },
      );
      const login = loginRes?.userLogin;
      if (!login?.token) {
        setLoginError(login?.error || login?.message || 'Login failed');
        setLoginInProgress(false);
        return;
      }
      // Persist auth the same way login-form.js does so the rest of the
      // app picks up the session. Three frontend roles: retail / b2b /
      // dealer — collapse the backend's `dealer` and `dealership` variants
      // to `dealer`, leave everything else as-is.
      const dealerVariants = ['dealer', 'dealership'];
      const normalizedRole = dealerVariants.includes(login.role)
        ? 'dealer'
        : login.role;
      localStorage.setItem('authToken', login.token);
      localStorage.setItem('userId', String(login.userId));
      localStorage.setItem('userRole', normalizedRole);
      // Push the new user into UserContext so the header's Login/Sign Up
      // button immediately flips to "Account" / "Dealer Account". Without
      // this the header doesn't notice the inline login until a hard
      // refresh because UserContext only reads from storage on mount.
      setUser({
        id: login.userId,
        role: normalizedRole,
        token: login.token,
      });
      window.dispatchEvent(new Event('authchange'));

      // (Guest cart replay removed — see comment above the userLogin
      // mutation. cart-context's authchange listener runs the
      // migration with tier-price lookups for each item.)

      // Re-query with the new auth token so the resolver returns the full
      // profile (firstName/lastName/phone/company), then prefill.
      const profile = await getCustomerByEmail(formData.email, {
        authToken: login.token,
      });
      // Also pull the saved address from userAddress so the Address
      // Details form and the Contact Details summary line both
      // populate post-login (was missing — only profile fields were
      // fetched here, which is why retail users who saved an
      // address in /account/address still saw a blank address on
      // /checkout immediately after inline-login).
      let addrSrc = null;
      if (profile?.userId) {
        try {
          const addrRes = await fetchAPI(
            `query($userId: Int!) {
              userAddress(userId: $userId) {
                success
                billing {
                  address_1 address_2 city state postcode country
                }
                shipping {
                  address_1 address_2 city state postcode country
                }
              }
            }`,
            {
              authToken: login.token,
              variables: { userId: Number(profile.userId) },
            },
          );
          const b = addrRes?.userAddress?.billing;
          const s = addrRes?.userAddress?.shipping;
          addrSrc = s?.address_1 ? s : b;
        } catch (err) {
          console.warn(
            '[Checkout] post-login address fetch failed:',
            err?.message,
          );
        }
      }
      if (profile) {
        setFormData(prev => ({
          ...prev,
          address: addrSrc?.address_1 || prev.address,
          address_2: addrSrc?.address_2 || prev.address_2,
          city: addrSrc?.city || prev.city,
          company: profile.company || prev.company,
          country: addrSrc?.country || prev.country,
          first_name: profile.firstName || prev.first_name,
          last_name: profile.lastName || prev.last_name,
          phone: profile.phone || prev.phone,
          postcode: addrSrc?.postcode || prev.postcode,
          state: addrSrc?.state || prev.state,
        }));
        setCustomerLookup({ ...profile, isLoggedIn: true });
        // Populate the summary address line too. Same shape the
        // logged-in autofill effect uses.
        if (addrSrc) {
          const line = [
            addrSrc.address_1,
            addrSrc.address_2,
            addrSrc.city,
            addrSrc.state,
            addrSrc.postcode,
            addrSrc.country,
          ]
            .filter(Boolean)
            .join(', ');
          if (line) setDealerAddressLine(line);
        }
      }
      // Collapse Contact Details into the read-only summary card so the
      // user lands in the "John Smith / johnsmith@gmail.com / 0400…" state
      // instead of being asked to re-fill the same fields they just
      // authenticated for. They can hit Edit Details to reopen.
      setSubmitContactDetails(true);
      setLoginPassword('');
    } catch (err) {
      setLoginError(err?.message || 'Login failed');
    } finally {
      setLoginInProgress(false);
    }
  };

  const showInlineLoginPrompt =
    customerLookup?.exists &&
    customerLookup?.isLoggedIn === false &&
    !continueAsGuest;

  // When the user lands on /checkout already logged in (session from a
  // previous /login or from clicking "Buy" while authenticated), the
  // inline-email-blur autofill never fires because they haven't typed
  // anything. Pull their saved profile up front so they don't have to
  // re-enter name / email / phone / company. userAddress(userId) gives
  // us the email + name + phone; a follow-on customerByEmail gives us
  // the company. After autofill, collapse the card into summary state
  // so the dealer doesn't see an empty edit form between logging in
  // and selecting a delivery method.
  useEffect(() => {
    if (!user?.id || formData.email) return;
    let cancelled = false;
    (async () => {
      try {
        // Pull the full billing address — not just name/email/phone.
        // Prior to this, the retail Contact Details summary showed
        // name + email + phone but no street/city/state — so when a
        // retail user saved their address in /account/address (which
        // does request the full shape) and then went to /checkout,
        // the address was silently dropped. Same userAddress
        // resolver, just asking for everything Lokesh's resolver
        // already returns.
        const addrRes = await fetchAPI(
          `query($userId: Int!) {
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
          }`,
          { variables: { userId: user.id } },
        );
        if (cancelled) return;
        const billing = addrRes?.userAddress?.billing;
        const shippingAddr = addrRes?.userAddress?.shipping;
        if (!billing?.email) return;

        // customerByEmail with the auth token returns company etc. that
        // userAddress doesn't carry. Run it after we have the email.
        const profile = await getCustomerByEmail(billing.email, {
          authToken: user.token,
        });
        if (cancelled) return;

        // For B2B / Dealer accounts, populate Contact Details from
        // the single all-in-one resolver Lokesh ships for each role:
        //
        //   B2B    → getAssignedStoreAddress.deliveryAddress
        //   Dealer → dealerStoreAddress.deliveryAddress
        //
        // Both resolvers return the same field shape (firstName,
        // lastName, company, address1/2, city, state, postcode,
        // country, phone, email), so once we've selected the right
        // address payload the autofill is uniform. This replaces the
        // old multi-fetch chain (getAssignedStoreAddress thin shape
        // + getStoreByUserId + store(databaseId) + addressFields
        // fallback) — one call, everything we need.
        // Both resolvers return both delivery + billing as OBJECTS,
        // even when WP only has one of them populated. `{firstName:
        // "", address1: "", ...}` is truthy in JS, so a naive
        // `delivery || billing` short-circuits to the empty
        // delivery side and we lose the real billing data. Pick
        // whichever object has at least one populated field.
        // Stricter than "any non-empty field" — check for street-
        // address fields specifically. For dealer accounts the
        // resolver auto-fills firstName/lastName on the shipping
        // side from the user record, so a generic "anything
        // populated" check picks the address-less shipping object
        // and we lose the real billing address.
        const pickPopulated = (...addrs) =>
          addrs.find(a => a && (a.address1 || a.city || a.postcode)) || null;

        let shipping = null;
        let postNameFallback = null;
        if (user?.role === 'b2b') {
          const assigned = await getAssignedStoreAddress(user.id, {
            authToken: user.token,
          });
          if (cancelled) return;
          shipping = pickPopulated(
            assigned?.deliveryAddress,
            assigned?.billingAddress,
          );
          // Keep postName as a name-line fallback in case the
          // resolver returns blank firstName/lastName for a store.
          postNameFallback = assigned?.postName || null;
        } else if (user?.role === 'dealer') {
          const storeAddr = await getDealerStoreAddress(user.id, {
            authToken: user.token,
          });
          if (cancelled) return;
          // dealerStoreAddress is the address-only resolver (no
          // firstName/lastName/email/company in this shape). Map
          // its legacy fields (streetAddress, aptUnit, postalCode,
          // phoneNo, addressName) into the same `shipping` keys
          // the autofill below reads. Names + email fall through
          // to the user profile / billing chain.
          const a =
            [storeAddr?.deliveryAddress, storeAddr?.billingAddress].find(
              addr =>
                addr && (addr.streetAddress || addr.city || addr.postalCode),
            ) || null;
          if (a) {
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
        }

        // Retail fallback: B2B + Dealer branches above didn't run, so
        // `shipping` is still null. Build it from the userAddress
        // response (preferring shipping; falling back to billing).
        // userAddress uses snake_case keys (address_1, postcode);
        // map them to the camelCase shape the autofill below
        // reads, so retail flows through the same code path B2B
        // and Dealer use.
        if (!shipping) {
          const src = shippingAddr?.address_1 ? shippingAddr : billing;
          if (src?.address_1 || src?.city || src?.postcode) {
            shipping = {
              address1: src.address_1 || '',
              address2: src.address_2 || '',
              city: src.city || '',
              company: '',
              country: src.country || 'AU',
              phone: src.phone || '',
              postcode: src.postcode || '',
              state: src.state || '',
            };
          }
        }

        const resolvedFirstName =
          shipping?.firstName ||
          postNameFallback ||
          profile?.firstName ||
          billing.first_name ||
          '';
        const resolvedLastName =
          shipping?.lastName ||
          (postNameFallback && !shipping?.firstName
            ? ''
            : profile?.lastName || billing.last_name || '');
        const resolvedCompany = shipping?.company || profile?.company || '';
        const resolvedEmail = shipping?.email || billing.email || '';
        const resolvedPhone =
          shipping?.phone || profile?.phone || billing.phone || '';

        setFormData(prev => ({
          ...prev,
          // Address fields (now populated for retail too, not just
          // B2B/Dealer). Empty `shipping` leaves them untouched.
          address: shipping?.address1 || prev.address,
          address_2: shipping?.address2 || prev.address_2,
          city: shipping?.city || prev.city,
          company: resolvedCompany || prev.company,
          country: shipping?.country || prev.country,
          email: resolvedEmail || prev.email,
          first_name: resolvedFirstName || prev.first_name,
          last_name:
            shipping?.lastName ||
            // If we fell back to the post-name slug (B2B, blank
            // firstName from the resolver), null out last_name so
            // the summary line renders as just "canopies-wa" rather
            // than appending a stale personal last name.
            (postNameFallback && !shipping?.firstName
              ? ''
              : resolvedLastName || prev.last_name),
          phone: resolvedPhone || prev.phone,
          postcode: shipping?.postcode || prev.postcode,
          state: shipping?.state || prev.state,
        }));
        setSubmitContactDetails(true);

        // Same payload drives the address line under Contact Details
        // (the small grey one with the street address). No fallback
        // chain needed — the new resolvers carry the full address.
        let line = '';
        if (shipping) {
          line = [
            shipping.address1,
            shipping.address2,
            shipping.city,
            shipping.state,
            shipping.postcode,
            shipping.country,
          ]
            .filter(p => p != null && p !== '' && p !== 0)
            .map(String)
            .join(', ');
          if (!cancelled && line) setDealerAddressLine(line);
        }

        // Cache the resolved contact snapshot so the NEXT /checkout
        // mount paints with this data instantly instead of waiting
        // for the autofill round-trip again. Keyed by userId so
        // signing out / signing in as someone else doesn't leak.
        try {
          if (typeof window !== 'undefined' && user?.id) {
            localStorage.setItem(
              `hsp_checkout_contact_${user.id}`,
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
          }
        } catch {
          /* localStorage write failed (quota / disabled) — skip cache. */
        }
      } catch (err) {
        console.error('[Checkout] autofill failed:', err?.message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role, user?.token]); // eslint-disable-line react-hooks/exhaustive-deps

  const noGiftCard = cartItems.every(item => item.recipientEmail == null);

  // Delivery options follow the per-role slug spec:
  //   Retail  → click-collect, local-installation, deliver-to-door
  //   B2B     → deliver-to-store, pickup-from-hsp, drop-shipping-to-customer
  //   Dealer  → deliver-to-store, pickup-from-hsp, on-site-fitting
  // pickup-from-hsp is shared across all three, deliver-to-store across
  // b2b and dealer. `roles` is an array; filtering uses .includes(role).
  const allDeliveryOptions = [
    {
      allowDelivery: false,
      askCutomerInfo: false,
      description: 'Convenient Local Pickup',
      icon: LocationIcon,
      id: 'click-collect',
      noteContent: <></>,
      roles: ['retail'],
      selectedAddress: {
        btnTitle: 'Change Store',
        title: 'Click & Collect',
      },
      selectedMenu: {
        content: (
          <>
            <p>
              Your selected store will reach out to you to provide a collection
              time.
            </p>
          </>
        ),
        title: 'Click & Collect',
      },
      title: 'Click & Collect',
    },
    {
      allowDelivery: false,
      askCutomerInfo: false,
      description:
        'Choose a local HSP fitter to get your accessories installed',
      icon: SettingIcon,
      id: 'local-installation',
      noteContent: <></>,
      roles: ['retail'],
      selectedAddress: {
        btnTitle: 'Change Store',
        title: 'Local Installation',
      },
      selectedMenu: {
        content: (
          <>
            <p>Choose a local HSP fitter to get your accessories installed</p>
          </>
        ),
        title: 'Local Installation',
      },
      title: 'Local Installation',
    },
    {
      allowDelivery: false,
      askCutomerInfo: false,
      description:
        'Appropriate delivery costs will be added to the final order summary',
      icon: TruckIcon,
      id: 'deliver-to-store',
      noteContent: (
        <>
          <p>
            <strong>Please Note:</strong> Freight times will vary depending on
            location
          </p>
        </>
      ),
      roles: ['b2b', 'dealer'],
      selectedAddress: {
        // No Edit Address button — the destination is the dealer's
        // store address from Contact Details above, which can't be
        // edited per-order on this card. (The button trigger renders
        // when btnTitle is truthy; empty string skips it.)
        btnTitle: '',
        title: 'Deliver to Store',
      },
      selectedMenu: {
        content: (
          <>
            <p>
              Appropriate delivery costs will be added to the final order
              summary
            </p>
            <p>
              <strong>Please Note:</strong> Freight times will vary depending on
              location
            </p>
          </>
        ),
        title: 'Deliver to Store',
      },
      title: 'Deliver to Store',
    },
    {
      allowDelivery: false,
      askCutomerInfo: false,
      description: 'Arrange your own freight pickup from HSP HQ',
      icon: LocationIcon,
      id: 'pickup-from-hsp',
      noteContent: (
        <>
          <p>
            <strong>Please Note:</strong> The team at HSP will reach out to you
            once the order is ready for collection
          </p>
        </>
      ),
      // Retail was removed from this list (2026-07-01) — retail
      // customers use "Deliver to Door" instead. Pickup From HSP
      // is now B2B/Dealer-only (they collect commercial orders
      // from the HSP warehouse).
      roles: ['b2b', 'dealer'],
      selectedAddress: {
        btnTitle: '',
        title: 'Pickup From HSP',
      },
      selectedMenu: {
        content: (
          <>
            <p>Arrange your own freight pickup from HSP HQ</p>
          </>
        ),
        title: 'Pickup From HSP',
      },
      title: 'Pickup From HSP',
    },
    {
      // Retail door-to-door delivery. Freight applies; no install
      // (the customer receives at their door — installation, if
      // any, is on them). Restored 2026-07-01 after being replaced
      // briefly by Pickup From HSP.
      allowDelivery: true,
      askCutomerInfo: false,
      description: 'Sent within 1-3 business days',
      icon: TruckIcon,
      id: 'deliver-to-door',
      noteContent: <p>Sent within 1-3 business days</p>,
      roles: ['retail'],
      selectedAddress: {
        btnTitle: 'Edit Delivery Details',
        title: 'Deliver to Door',
      },
      selectedMenu: {
        content: <p>Sent within 1-3 business days</p>,
        title: 'Deliver to Door',
      },
      title: 'Deliver to Door',
    },
    {
      allowDelivery: true,
      askCutomerInfo: true,
      description:
        'Get your products sent directly to your customers COMMERCIAL address',
      icon: TruckIcon,
      id: 'drop-shipping-to-customer',
      noteContent: (
        <>
          <p>
            <strong>Please Note:</strong> Freight times will vary depending on
            location
          </p>
        </>
      ),
      roles: ['b2b'],
      selectedAddress: {
        btnTitle: 'Edit Delivery Details',
        title: 'Drop Shipping to Customer',
      },
      selectedMenu: {
        content: (
          <>
            <p>Get your products sent directly to a customers address</p>
          </>
        ),
        title: 'Drop Shipping to Customer',
      },
      title: 'Drop Shipping to Customer',
    },
    {
      allowDelivery: false,
      askCutomerInfo: false,
      description:
        'Get your products fitted on-site at your dealership from our local HSP specialists.',
      icon: OnSiteFittingIcon,
      id: 'on-site-fitting',
      noteContent: <></>,
      roles: ['dealer'],
      selectedAddress: {
        btnTitle: 'Change Store',
        title: 'On-Site Fitting',
      },
      selectedMenu: {
        content: (
          <>
            <p>
              Get your products fitted on-site at your dealership from our local
              HSP specialists.
            </p>
          </>
        ),
        title: 'On-Site Fitting',
      },
      title: 'On-Site Fitting',
    },
  ];

  const role = user?.role ?? 'retail';
  // True for any "dealer-like" account — b2b OR dealer. Both share the
  // dealer-style checkout (PO Number, VIN, Dealership Details heading,
  // Account Terms, etc.) and only the delivery options differ between
  // them. Use this instead of repeating `role === 'b2b'` everywhere so
  // the dealer role doesn't accidentally get the retail form.
  const isDealerLike = role === 'b2b' || role === 'dealer';

  // Per-option install / freight / fitting-charge visibility, per
  // Darshan's spec (2026-07-01):
  //
  //   Retail
  //     click-collect       → no install,  no freight
  //     local-installation  → install,     freight
  //     deliver-to-door     → no install,  freight
  //   B2B (no install, ever — they resell, never install)
  //     deliver-to-store    → freight
  //     pickup-from-hsp     → no freight
  //     drop-shipping-to-customer → freight
  //   Dealer
  //     deliver-to-store    → no install,  freight
  //     pickup-from-hsp     → no install,  no freight
  //     on-site-fitting     → install,     freight,  + $175 fitting
  //
  // Used by the Summary block to render rows AND in the TOTAL math
  // (must stay in lockstep so the breakdown matches the AUD figure).
  const ONSITE_FITTING_CHARGE = 175;
  const installSum = cartItems.reduce(
    (t, i) => t + (i.installation_cost || 0) * i.quantity,
    0,
  );
  const freightSum = cartItems.reduce(
    (t, i) => t + (i.freight || 0) * i.quantity,
    0,
  );
  const showInstallation =
    (role === 'retail' && formData.orderType === 'local-installation') ||
    (role === 'dealer' && formData.orderType === 'on-site-fitting');
  const showFreight =
    formData.orderType !== '' &&
    formData.orderType !== 'pickup-from-hsp' &&
    formData.orderType !== 'click-collect';
  const showFittingCharge =
    role === 'dealer' && formData.orderType === 'on-site-fitting';

  const [submitContactDetails, setSubmitContactDetails] = useState(false);

  // For logged-in B2B/dealer users, jump straight to the summary
  // view as soon as the user context resolves. Without this they
  // see the empty "B2B Details / First Name / Last Name / Email
  // / Mobile / Company" form for a beat before the autofill effect
  // populates it and the summary collapses over the top. The
  // summary block itself reads from formData, so it just renders
  // blank until autofill completes — but the user sees a stable
  // "Contact Details" heading instead of a form they shouldn't be
  // filling in.
  useEffect(() => {
    if (userLoading) return;
    if (user?.role === 'b2b' || user?.role === 'dealer') {
      setSubmitContactDetails(true);
    }
  }, [user?.role, userLoading]);

  // Per-section confirm state — clicking Confirm Address in the
  // Address Details box collapses only that box; clicking Confirm
  // Address in the Billing Address box collapses only that. Both
  // reset when the user hits "Edit Details" on the Contact Details
  // summary block. Distinct from submitContactDetails, which
  // collapses the whole Contact Details card into the read-only
  // summary view.
  const [addressConfirmed, setAddressConfirmed] = useState(false);
  const [invoiceAddressConfirmed, setInvoiceAddressConfirmed] = useState(false);

  // Chain the per-section confirms into the whole-card collapse
  // per Figma B2B flow (node 5445:37496): once the user has
  // confirmed Address Details AND either ticked "billing same as
  // above" OR confirmed the separate Billing Address, drop the
  // whole Contact Details card into its read-only summary view
  // (name/email/phone + Edit Details button + the two dark
  // address cards). The user doesn't have to click a third
  // "Submit Details" button to finish the section.
  useEffect(() => {
    if (!addressConfirmed) return;
    const billingSameAsAddress = formData.delivery_same_as_billing !== false;
    if (billingSameAsAddress || invoiceAddressConfirmed) {
      setSubmitContactDetails(true);
    }
  }, [
    addressConfirmed,
    formData.delivery_same_as_billing,
    invoiceAddressConfirmed,
  ]);

  const handleSubmitContactDetails = () => {
    setSubmitContactDetails(true);
  };

  const handleEditContactDetails = () => {
    setSubmitContactDetails(false);
    // Also reset the per-section confirms so hitting Edit Details
    // takes the user back to the fully-editable state (both address
    // forms visible) rather than leaving one still collapsed.
    setAddressConfirmed(false);
    setInvoiceAddressConfirmed(false);
  };

  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState('');

  const [allStores, setAllStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState({});

  const onSelect = item => {
    setSelectedStore(item);
    // On-Site Fitting has an extra step after store selection:
    // the dealer picks a fitting availability date before the
    // payment card can appear. All other delivery flows
    // (Click & Collect, Local Installation, Pickup From HSP,
    // Delivery drop-ship / to-store) unlock the payment card
    // the moment their sub-form is complete.
    if (formData.orderType === 'on-site-fitting') return;
    setIsFormFilled(true);
  };

  useEffect(() => {
    async function fetchData() {
      const stores = await getStores();
      setAllStores(Array.isArray(stores) ? stores : []);
    }
    fetchData();
  }, []);

  const [accountTerms, setAccountTerms] = useState(null);

  useEffect(() => {
    if (user?.role !== 'b2b' || !user?.id) {
      setAccountTerms(null);
      return;
    }
    let cancelled = false;
    fetchAPI(GET_ACCOUNT_TERMS_QUERY, {
      variables: { userId: Number(user.id) },
    })
      .then(res => {
        if (cancelled) return;
        const node = res?.stores?.nodes?.[0];
        if (node?.odooCreditLimit || node?.odooPaymentTermName) {
          setAccountTerms({
            creditLimit: node.odooCreditLimit,
            paymentTermName: node.odooPaymentTermName,
          });
        } else {
          setAccountTerms(null);
        }
        if (node?.odooCompanyName) {
          setFormData(prev =>
            prev.company ? prev : { ...prev, company: node.odooCompanyName },
          );
        }
      })
      .catch(() => {
        if (!cancelled) setAccountTerms(null);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id, user?.role]);

  async function getStoreDeliveryOptions(userId) {
    try {
      const store = await getStoreByUserId(userId);
      const opts = store?.availableDeliveryOptions || [];
      // Surfaces in the build log + browser console when a B2B / dealer
      // user lands on /checkout and only sees a subset of their role's
      // delivery options. The filter step later drops any option whose
      // id isn't in this array (when it has at least one entry), so
      // this is the only place to see exactly which option IDs the
      // assigned Store post enables. When this prints `[]`, no filter
      // is applied and all role-default options should render.
      console.log(
        '[Checkout] availableDeliveryOptions from assigned store:',
        opts,
      );
      return opts;
    } catch (e) {
      console.error('Error getting orders:', e);
      return [];
    }
  }

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      if (user) {
        let filteredOptions = allDeliveryOptions.filter(opt =>
          opt.roles?.includes(role),
        );

        if (user?.id && isDealerLike) {
          const options = await getStoreDeliveryOptions(user.id);
          // Only restrict to the store's configured options when it actually
          // has some. If the dealer's store has none set (or no store linked),
          // fall back to showing all default b2b options instead of a blank
          // section.
          if (options && options.length > 0) {
            // Slug aliasing for backwards-compatibility. We renamed
            // `drop-ship-to-customer` → `drop-shipping-to-customer` in
            // the frontend to match the WP/Odoo bridge spec, but
            // existing Store posts in WP still have the legacy slug
            // in their availableDeliveryOptions ACF. Without this,
            // the intersection drops Drop Shipping for every dealer
            // until WP admin migrates every store record.
            // Normalize WP's values to the frontend canonical slugs
            // before intersecting — once WP is migrated this map is a
            // no-op and can be deleted.
            const SLUG_ALIASES = {
              'drop-ship-to-customer': 'drop-shipping-to-customer',
            };
            const normalizedAllowed = options.map(o => SLUG_ALIASES[o] || o);
            filteredOptions = filteredOptions.filter(opt =>
              normalizedAllowed.includes(opt.id),
            );
          }
        }

        // Diagnostic — when only 2 of the 3 B2B options render, we
        // need to know whether the missing one was filtered out by
        // the assigned-store availableDeliveryOptions check OR isn't
        // in the role-default set at all. Print the final list of
        // ids so a quick console.log answers it without source-mapping
        // through chunks.
        console.log(
          `[Checkout] final deliveryOptions for role=${role}:`,
          filteredOptions.map(o => o.id),
        );

        setDeliveryOptions(filteredOptions);
      }
      setLoading(false);
    };

    run();
  }, [user]);

  const handleSelectOption = id => {
    if (id === 'pickup-from-hsp') {
      // Find the HSP HQ store record (hard-coded to databaseId 2513 in prod).
      // If allStores hasn't loaded yet OR the WP environment doesn't have
      // that exact row (staging may have different IDs), normalizeStores
      // crashes on undefined input — bail out gracefully and let the user
      // still select the option with a placeholder address.
      const findItem = allStores.find(store => store.databaseId == 2513);
      let item = null;
      if (findItem) {
        try {
          item = normalizeStores([findItem])[0] ?? null;
        } catch (err) {
          console.error('normalizeStores failed for pickup-from-hsp:', err);
          item = null;
        }
      } else if (typeof window !== 'undefined') {
        console.warn(
          'Pickup from HSP: store with databaseId 2513 not found in allStores',
          { allStoresCount: allStores.length },
        );
      }
      setSelectedStore(
        item || {
          // Minimal shape so downstream consumers (the address card display
          // in particular) don't crash on null when the lookup misses.
          id: 'pickup-from-hsp',
          location: {
            city: 'Noble Park North',
            country: 'AU',
            postalCode: '3977',
            stateAbbr: 'VIC',
            street: 'HSP HQ',
          },
          name: 'HSP HQ',
        },
      );
      setFormData({ ...formData, orderType: id });
      setOpenDrawer('pickup-from-hsp');
      setIsFormFilled(true);
      return;
    }

    const currentOpenDrawer = openDrawer === id ? '' : id;

    if (isFormFilled && currentOpenDrawer === '') {
      return;
    }

    setOpenDrawer(currentOpenDrawer); // toggle open/close
    setFormData({ ...formData, orderType: currentOpenDrawer });

    setIsFormFilled(false);
  };

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCheckboxChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.checked,
    });
  };
  const handleRadioChange = event => {
    setFormData({
      ...formData,
      payment_method: event.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // return;

    setLoading(true);

    const requiredFields = [
      'first_name',
      // last_name is only required for retail. For B2B/dealer we
      // autofill first_name with the store's postName slug (e.g.
      // "canopies-wa") and intentionally leave last_name empty so
      // the summary card renders just the post name rather than
      // "canopies-wa <stale-personal-name>".
      ...(isDealerLike ? [] : ['last_name']),
      'email',
      'phone',
      'termsAndConditions',
      'payment_method',
      'orderType',
      ...(isDealerLike ? ['purchaseOrderNumber'] : []),
      ...(role === 'dealer' ? ['vehicleIdentifier'] : []),
    ];

    const isMissing = requiredFields.some(field => !formData[field]);
    if (isMissing) {
      alert('⚠️ Please fill all required fields.');
      setLoading(false);
      return;
    }

    // WP's CheckoutOrderInput doesn't accept `vehicleIdentifier` or the
    // local-only `delivery_same_as_billing` toggle. Strip them before
    // sending. If delivery IS the same as the billing/primary address,
    // also strip the delivery_* fields entirely (they would just
    // duplicate the primary address with empty strings). If delivery
    // differs, the delivery_* fields will pass through and either be
    // accepted by WP or rejected with a clear schema error message we
    // can use to wire them later.
    const {
      delivery_address,
      delivery_address_2,
      delivery_city,
      delivery_company,
      delivery_country,
      delivery_postcode,
      delivery_same_as_billing,
      delivery_state,
      fittingDate,
      vehicleIdentifier,
      ...baseFormData
    } = formData;
    const formDataForWP = delivery_same_as_billing
      ? baseFormData
      : {
          ...baseFormData,
          delivery_address,
          delivery_address_2,
          delivery_city,
          delivery_company,
          delivery_country,
          delivery_postcode,
          delivery_state,
        };
    // CheckoutOrderInput schema does NOT accept userId — an earlier
    // attempt to add it surfaced
    // `Field "userId" is not defined by type "CheckoutOrderInput"`.
    // The dealer identification must come from the auth token instead,
    // which is threaded inside checkoutOrder() now (see contexts/checkout.js).
    const payload = {
      ...formDataForWP,
      ...(selectedStore?.id && {
        selectedStoreID: (selectedStore?.id).toString(),
      }),
      ...(appliedCoupons[0]?.code && { coupon: appliedCoupons[0]?.code || '' }),
      ...(formData.payment_method === 'account-terms' &&
        accountTerms?.paymentTermName && {
          payment_term_name: accountTerms.paymentTermName,
        }),
      // On-Site Fitting only — the availability date the dealer
      // picked after choosing a fitter store. Sent as fitting_date
      // (snake_case) to match WP's checkoutOrder input convention.
      ...(formData.orderType === 'on-site-fitting' &&
        fittingDate && { fitting_date: fittingDate }),
    };

    const result = await checkoutOrder(payload);
    if (result?.order_id) {
      // Wipe the shadow cart so the dealer doesn't accidentally re-order.
      if (typeof clearCart === 'function') clearCart();
      // Guests who just placed an order see a "Create an account"
      // CTA on the order-status page — stash the details they
      // just typed into checkout so the register form can pre-fill.
      // Only for guests; a logged-in user obviously doesn't need
      // this. sessionStorage (not localStorage) so it evaporates
      // when the tab closes.
      if (!user?.id && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(
            'hsp_guest_prefill',
            JSON.stringify({
              email: formData.email || '',
              firstName: formData.first_name || '',
              lastName: formData.last_name || '',
              phone: formData.phone || '',
            }),
          );
        } catch {
          /* sessionStorage disabled / quota-exceeded — skip prefill */
        }
      }
      setLoading(false);
      router.push(`/order-status/${result.order_id}`);
    } else {
      alert(`❌ ${result?.message || 'Order failed'}`);
    }

    setLoading(false);
  };

  const openQuoteForm = () => {
    setQuoteAmount(String(cartTotal - totalDiscount));
    setQuoteNotes(
      formData.purchaseOrderNumber ? `PO: ${formData.purchaseOrderNumber}` : '',
    );
    setShowQuoteForm(true);
  };

  const handleSubmitQuote = async () => {
    if (!quoteAmount) return;
    setLoading(true);
    const quote = await createQuote({
      amount: quoteAmount,
      notes: quoteNotes,
    });
    setLoading(false);

    if (quote?.id) {
      router.push(`/quote-status/${quote.id}`);
    } else {
      alert('❌ Could not create quote. Please try again.');
    }
  };

  return (
    <Container className={styles.checkoutContainer}>
      <section className={clsx(styles.checkoutMain, 'checkoutMain')}>
        <form onSubmit={handleSubmit}>
          {/* Checkout Left */}
          <div className={styles.checkOutLeft}>
            {/* "Let's Get Started" guest gate — Figma node
                5475:36507. Portalled to document.body as a
                full-viewport overlay so it dims the checkout
                behind it instead of stacking inline at the top
                of the form. Shown when the visitor is a guest
                AND hasn't picked "Continue As Guest" yet.
                Login / Sign Up route to the auth pages with a
                redirect back to /checkout; Continue As Guest
                sets state so the gate never re-appears this
                session. Logged-in users (any role) never see
                this. */}
            {guestGateMounted && !userLoading && !user?.id && !continueAsGuest
              ? createPortal(
                  <div className={styles.guestGateBackdrop}>
                    <div className={styles.guestGate}>
                      <h2>Let&rsquo;s Get Started</h2>
                      <div className={styles.guestGateActions}>
                        <Link
                          className={styles.guestGateLogin}
                          href="/login?redirect=/checkout"
                        >
                          Login <span aria-hidden>→</span>
                        </Link>
                        <Link
                          className={styles.guestGateSignup}
                          href="/register?redirect=/checkout"
                        >
                          Sign Up <span aria-hidden>→</span>
                        </Link>
                      </div>
                      <button
                        className={styles.guestGateContinue}
                        onClick={() => setContinueAsGuest(true)}
                        type="button"
                      >
                        Continue As Guest
                      </button>
                    </div>
                  </div>,
                  document.body,
                )
              : null}
            {/* Contact Details */}
            {!userLoading &&
            !user?.id &&
            !continueAsGuest ? null : submitContactDetails ? (
              <div
                className={clsx(styles.contactDetails, styles.editDetailMain)}
              >
                <div className={styles.heading}>
                  <h2>Contact Details</h2>
                  {/* Edit Details now visible for every role. Figma
                      B2B flow (node 5446:38251) shows it in the
                      collapsed state so the user can still make
                      corrections to the address / company after
                      clicking Confirm Address. Previously gated to
                      retail only because B2B/dealer contact fields
                      came from the store record — but Confirm
                      Address now also collapses this card, and the
                      user needs a way back. */}
                  <Button
                    onClick={handleEditContactDetails}
                    size="large"
                    variant="ghost"
                  >
                    Edit Details
                  </Button>
                </div>
                <div className={styles.submittedInfo}>
                  <p>
                    {formData.first_name} {formData.last_name}
                  </p>
                  <p>{formData.email}</p>
                  <p>{formData.phone}</p>
                  {formData.company && <p>{formData.company}</p>}
                </div>
                {/* Address Details as a distinct summary card below
                    the contact info — per Figma B2B collapsed state
                    (node 5446:38251). Dark inner card with the full
                    address line on a single row, mimicking the way
                    the delivery drawer's summary already renders. */}
                {(() => {
                  const line =
                    dealerAddressLine ||
                    [
                      formData.address,
                      formData.address_2,
                      formData.city,
                      formData.state,
                      formData.postcode,
                      formData.country,
                    ]
                      .filter(Boolean)
                      .join(', ');
                  if (!line) return null;
                  return (
                    <div className={styles.addressSummaryCard}>
                      <h4>Address Details</h4>
                      <p>{line}</p>
                    </div>
                  );
                })()}
                {/* Billing Address summary card — only renders when
                    the user has unticked "billing same as above"
                    and entered a separate billing address. Matches
                    Figma B2B flow (node 5445:37496) where both
                    Address Details and Billing Address show as
                    stacked dark cards inside the collapsed Contact
                    Details block. Note: the internal state name is
                    still `delivery_same_as_billing` and the fields
                    are `delivery_*` (kept for checkoutOrder payload
                    compatibility), but the label + heading here read
                    as "Billing Address" per the Figma copy. */}
                {formData.delivery_same_as_billing === false &&
                  (() => {
                    // Only render when the user has entered
                    // ACTUAL invoice address data. Previously the
                    // guard just checked whether ANY delivery_*
                    // field was truthy — but delivery_country
                    // defaults to 'AU' from initial state, so the
                    // card rendered as "Invoice Address: AU" the
                    // instant the checkbox was unticked (before
                    // the user typed anything). Require at least
                    // one of the meaningful street fields.
                    const hasInvoiceAddress =
                      formData.delivery_address ||
                      formData.delivery_city ||
                      formData.delivery_postcode;
                    if (!hasInvoiceAddress) return null;
                    const billingLine = [
                      formData.delivery_address,
                      formData.delivery_address_2,
                      formData.delivery_city,
                      formData.delivery_state,
                      formData.delivery_postcode,
                      formData.delivery_country,
                    ]
                      .filter(Boolean)
                      .join(', ');
                    return (
                      <div className={styles.addressSummaryCard}>
                        <h4>Billing Address</h4>
                        <p>{billingLine}</p>
                      </div>
                    );
                  })()}
              </div>
            ) : (
              <div className={styles.contactDetails}>
                <div className={styles.heading}>
                  <h2>
                    {role === 'dealer'
                      ? 'Dealership Details'
                      : role === 'b2b'
                        ? 'B2B Details'
                        : 'Contact Details'}
                  </h2>
                  <p>How Can We Reach You About Your Order?</p>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.colFull}>
                    <div className={styles.inputGroup}>
                      <label>
                        Email Address<span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        name="email"
                        onBlur={e => checkEmailExists(e.target.value)}
                        onChange={handleChange}
                        type="email"
                        value={formData.email}
                      />
                      {emailLookupInFlight && (
                        <p className={styles.emailHelper}>Checking…</p>
                      )}
                    </div>

                    {showInlineLoginPrompt && (
                      <div className={styles.inlineLoginPrompt}>
                        <p className={styles.inlineLoginLead}>
                          Looks like you already have an account. Log in to
                          autofill your details.
                        </p>
                        <div className={styles.inlineLoginRow}>
                          <input
                            autoComplete="current-password"
                            disabled={loginInProgress}
                            onChange={e => setLoginPassword(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleInlineLogin();
                              }
                            }}
                            placeholder="Password"
                            type="password"
                            value={loginPassword}
                          />
                          <button
                            disabled={loginInProgress || !loginPassword}
                            onClick={handleInlineLogin}
                            type="button"
                          >
                            {loginInProgress ? 'Logging in…' : 'Log in'}
                          </button>
                        </div>
                        {loginError && (
                          <p className={styles.inlineLoginError}>
                            ❌ {loginError}
                          </p>
                        )}
                        <div className={styles.inlineLoginLinks}>
                          {/* Inline forgot-password — fires the same
                              forgotPassword mutation /login uses, but
                              without navigating away from /checkout.
                              The email is whatever the user already
                              typed into the Email Address field. */}
                          <button
                            className={styles.inlineLoginForgot}
                            disabled={forgotPasswordInProgress}
                            onClick={handleForgotPassword}
                            type="button"
                          >
                            {forgotPasswordInProgress
                              ? 'Sending…'
                              : 'Forgot password?'}
                          </button>
                          <button
                            className={styles.inlineLoginSkip}
                            onClick={() => setContinueAsGuest(true)}
                            type="button"
                          >
                            Continue as guest
                          </button>
                        </div>
                        {forgotPasswordMessage && (
                          <p className={styles.inlineLoginError}>
                            {forgotPasswordMessage}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={styles.colHalf}>
                    <div className={styles.inputGroup}>
                      <label>
                        First Name<span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        name="first_name"
                        onChange={handleChange}
                        type="text"
                        value={formData.first_name}
                      />
                    </div>
                  </div>
                  <div className={styles.colHalf}>
                    <div className={styles.inputGroup}>
                      <label>
                        Last Name<span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        name="last_name"
                        onChange={handleChange}
                        type="text"
                        value={formData.last_name}
                      />
                    </div>
                  </div>
                  <div className={styles.colFull}>
                    <div className={styles.inputGroup}>
                      <label>
                        Mobile Number<span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        name="phone"
                        onChange={handleChange}
                        type="text"
                        value={formData.phone}
                      />
                    </div>
                  </div>
                  <div className={clsx(styles.colFull)}>
                    <div className={styles.inputGroup}>
                      <label>
                        Company Name
                        {isDealerLike ? (
                          <span className={styles.reqStar}>*</span>
                        ) : (
                          ' (Optional)'
                        )}
                      </label>
                      <input
                        name="company"
                        onChange={handleChange}
                        type="text"
                        value={formData.company}
                      />
                    </div>
                  </div>

                  {/* Address Details — primary/billing address. Nested
                      inside the Contact Details card per Figma node
                      5443:36032. When the user clicks Confirm Address
                      the FORM collapses into a summary strip (dark
                      pill showing the joined address line + Edit
                      button); the Invoice Address form below remains
                      independently editable / confirmable. */}
                  {addressConfirmed ? (
                    <div className={styles.colFull}>
                      <div className={styles.addressSummaryStrip}>
                        <h4>Address Details</h4>
                        <p>
                          {[
                            formData.address,
                            formData.address_2,
                            formData.city,
                            formData.state,
                            formData.postcode,
                            formData.country,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.colFull}>
                      <div className={styles.addressDetails}>
                        <h2 className={styles.addressDetailsHeading}>
                          Address Details
                        </h2>
                        <div className={styles.addressFormRow}>
                          <div className={styles.addressFormCol}>
                            <div className={styles.addressLblSelect}>
                              <span>Country/Region</span>
                              <select
                                name="country"
                                onChange={handleChange}
                                value={formData.country}
                              >
                                <option value="AU">Australia</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className={styles.addressFormRow}>
                          <div className={styles.addressFormCol}>
                            <input
                              name="company"
                              onChange={handleChange}
                              placeholder="Company Name (Optional)"
                              type="text"
                              value={formData.company}
                            />
                          </div>
                        </div>
                        <div className={styles.addressFormRow}>
                          <div className={styles.addressFormCol}>
                            <input
                              name="address"
                              onChange={handleChange}
                              placeholder="Address (We do not ship to PO Boxes)"
                              type="text"
                              value={formData.address}
                            />
                          </div>
                        </div>
                        <div className={styles.addressFormRow}>
                          <div className={styles.addressFormCol}>
                            <input
                              name="address_2"
                              onChange={handleChange}
                              placeholder="Apartment, suite, etc. (optional)"
                              type="text"
                              value={formData.address_2 || ''}
                            />
                          </div>
                        </div>
                        <div className={styles.addressFormRow}>
                          <div className={styles.addressFormCol}>
                            <input
                              name="city"
                              onChange={handleChange}
                              placeholder="City"
                              type="text"
                              value={formData.city}
                            />
                          </div>
                          <div className={styles.addressFormCol}>
                            <input
                              name="postcode"
                              onChange={handleChange}
                              placeholder="Postcode"
                              type="text"
                              value={formData.postcode}
                            />
                          </div>
                          <div className={styles.addressFormCol}>
                            <div className={styles.addressLblSelect}>
                              <span>State/territory</span>
                              <select
                                name="state"
                                onChange={handleChange}
                                value={formData.state}
                              >
                                <option value="">Select state</option>
                                {State.getStatesOfCountry(
                                  formData.country || 'AU',
                                ).map(s => (
                                  <option key={s.isoCode} value={s.name}>
                                    {s.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <Button
                          className={styles.addressConfirmBtn}
                          disabled={
                            !formData.country ||
                            !formData.address ||
                            !formData.city ||
                            !formData.state ||
                            !formData.postcode
                          }
                          // Confirm Address on the Address Details box
                          // collapses THIS box only, not the whole
                          // Contact Details card. Each address block
                          // has its own Confirm Address / independent
                          // collapse.
                          onClick={() => setAddressConfirmed(true)}
                          size="large"
                          variant="primary"
                        >
                          Confirm Address
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* "Delivery same as the address above?" toggle */}
                  <div className={styles.colFull}>
                    <div className={styles.deliverySameBar}>
                      <label>
                        <input
                          checked={formData.delivery_same_as_billing !== false}
                          name="delivery_same_as_billing"
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              delivery_same_as_billing: e.target.checked,
                            }))
                          }
                          type="checkbox"
                        />
                        <span>
                          The billing address is the same as the address listed
                          above.
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Invoice Address section. Renders as a form when
                      the user has unticked "invoice same as above"
                      AND hasn't confirmed it yet; collapses to a
                      summary strip (with its own Edit button) once
                      they hit its Confirm Address. The Address
                      Details box above collapses independently. */}
                  {formData.delivery_same_as_billing === false &&
                    (invoiceAddressConfirmed ? (
                      <div className={styles.colFull}>
                        <div className={styles.addressSummaryStrip}>
                          <h4>Billing Address</h4>
                          <p>
                            {[
                              formData.delivery_address,
                              formData.delivery_address_2,
                              formData.delivery_city,
                              formData.delivery_state,
                              formData.delivery_postcode,
                              formData.delivery_country,
                            ]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.colFull}>
                        <div className={styles.addressDetails}>
                          <h2 className={styles.addressDetailsHeading}>
                            Billing Address
                          </h2>
                          <div className={styles.addressFormRow}>
                            <div className={styles.addressFormCol}>
                              <div className={styles.addressLblSelect}>
                                <span>Country/Region</span>
                                <select
                                  name="delivery_country"
                                  onChange={handleChange}
                                  value={formData.delivery_country || 'AU'}
                                >
                                  <option value="AU">Australia</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className={styles.addressFormRow}>
                            <div className={styles.addressFormCol}>
                              <input
                                name="delivery_company"
                                onChange={handleChange}
                                placeholder="Company Name (Optional)"
                                type="text"
                                value={formData.delivery_company || ''}
                              />
                            </div>
                          </div>
                          <div className={styles.addressFormRow}>
                            <div className={styles.addressFormCol}>
                              <input
                                name="delivery_address"
                                onChange={handleChange}
                                placeholder="Address (We do not ship to PO Boxes)"
                                type="text"
                                value={formData.delivery_address || ''}
                              />
                            </div>
                          </div>
                          <div className={styles.addressFormRow}>
                            <div className={styles.addressFormCol}>
                              <input
                                name="delivery_address_2"
                                onChange={handleChange}
                                placeholder="Apartment, suite, etc. (optional)"
                                type="text"
                                value={formData.delivery_address_2 || ''}
                              />
                            </div>
                          </div>
                          <div className={styles.addressFormRow}>
                            <div className={styles.addressFormCol}>
                              <input
                                name="delivery_city"
                                onChange={handleChange}
                                placeholder="City"
                                type="text"
                                value={formData.delivery_city || ''}
                              />
                            </div>
                            <div className={styles.addressFormCol}>
                              <input
                                name="delivery_postcode"
                                onChange={handleChange}
                                placeholder="Postcode"
                                type="text"
                                value={formData.delivery_postcode || ''}
                              />
                            </div>
                            <div className={styles.addressFormCol}>
                              <div className={styles.addressLblSelect}>
                                <span>State/territory</span>
                                <select
                                  name="delivery_state"
                                  onChange={handleChange}
                                  value={formData.delivery_state || ''}
                                >
                                  <option value="">Select state</option>
                                  {State.getStatesOfCountry(
                                    formData.delivery_country || 'AU',
                                  ).map(s => (
                                    <option key={s.isoCode} value={s.name}>
                                      {s.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                          <Button
                            className={styles.addressConfirmBtn}
                            disabled={
                              !formData.delivery_country ||
                              !formData.delivery_address ||
                              !formData.delivery_city ||
                              !formData.delivery_state ||
                              !formData.delivery_postcode
                            }
                            onClick={() => setInvoiceAddressConfirmed(true)}
                            size="large"
                            variant="primary"
                          >
                            Confirm Address
                          </Button>
                        </div>
                      </div>
                    ))}

                  {/* Retail flow needs a manual Submit Details to
                      collapse the edit form into the summary card.
                      B2B and dealer accounts auto-collapse via the
                      autofill effect, so they don't need this button.
                      Purchase Order Number, VIN, T&Cs and Marketing
                      used to live inside this conditional — but
                      having them here meant they vanished after the
                      auto-collapse and Place Order stayed disabled
                      forever (couldn't tick T&Cs, couldn't enter PO).
                      They're now rendered in a dedicated always-
                      visible section below the delivery options
                      (search for `isDealerLike && (<...orderInfo>`). */}
                  {!isDealerLike && (
                    <div className={clsx(styles.colFull, styles.submitBtn)}>
                      <Button
                        disabled={
                          !formData.first_name ||
                          !formData.last_name ||
                          !formData.email ||
                          !formData.phone ||
                          loading ||
                          cartItems.length === 0
                        }
                        onClick={handleSubmitContactDetails}
                        size="large"
                        variant="primary"
                      >
                        Submit Details
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Receive Details */}{' '}
            <div className={styles.checkOutInfo}>
              <div className={styles.heading}>
                <h2>How would you like to Receive your Order?</h2>
                <p>Choose a Delivery or Install Method</p>
              </div>
              <div
                className={clsx(styles.blackBoxes, {
                  [styles.blackBoxesFull]: isDealerLike,
                })}
              >
                {cartLoading || userLoading ? (
                  // Don't flash the retail-default options while
                  // UserContext is still reading localStorage. Without
                  // this gate, a B2B / dealer landing on /checkout
                  // briefly sees Click&Collect / Local Installation /
                  // Pickup From HSP (the retail role's options that
                  // `role = user?.role ?? 'retail'` falls through to)
                  // before the user hydrates and the right list takes
                  // over.
                  <div className={styles.loading}>
                    <Loading size="large" />
                  </div>
                ) : (
                  deliveryOptions.map(deliveryOption => {
                    return (
                      <div className={styles.boxItem} key={deliveryOption.id}>
                        <div className={styles.contentBox}>
                          <div
                            className={clsx(styles.contentWrap, {
                              [styles.selected]:
                                openDrawer === deliveryOption.id,
                            })}
                            onClick={() =>
                              handleSelectOption(deliveryOption.id)
                            }
                            style={{ cursor: 'pointer' }}
                          >
                            {openDrawer === deliveryOption.id &&
                            !isFormFilled ? (
                              <>
                                <h3>
                                  <deliveryOption.icon />{' '}
                                  {deliveryOption.selectedMenu.title}
                                </h3>
                                <div>{deliveryOption.selectedMenu.content}</div>
                              </>
                            ) : (
                              <>
                                <h3>
                                  <deliveryOption.icon /> {deliveryOption.title}
                                </h3>
                                <p>{deliveryOption.description}</p>
                              </>
                            )}
                          </div>
                          {isFormFilled &&
                          deliveryOption.id === formData.orderType ? (
                            <div className={styles.editSelection}>
                              {/* Deliver-to-Store ships to the dealer's
                                  store address from Contact Details
                                  above — there's no per-order address
                                  to summarise or edit on this card,
                                  and rendering an empty
                                  formData.address produces a useless
                                  ", , , AU" strip. Only the drop-
                                  shipping flow needs the post-fill
                                  address summary (the dealer entered
                                  the customer's address there). */}
                              {['drop-shipping-to-customer'].some(
                                id => id === deliveryOption.id,
                              ) && (
                                <>
                                  <div
                                    className={clsx(
                                      styles.deliveryAddressBox,
                                      styles.delivery,
                                    )}
                                  >
                                    {deliveryOption.askCutomerInfo && (
                                      <div className={styles.customerInfo}>
                                        <div className={styles.smallTitle}>
                                          Customer Info:{' '}
                                        </div>
                                        <p>
                                          <div>
                                            <strong>
                                              {
                                                formData.additionalCustomerInfo
                                                  .customer_first_name
                                              }{' '}
                                            </strong>
                                          </div>
                                          <div>
                                            <strong>
                                              {
                                                formData.additionalCustomerInfo
                                                  .customer_last_name
                                              }
                                            </strong>
                                          </div>
                                        </p>
                                        <p>
                                          <strong>
                                            {
                                              formData.additionalCustomerInfo
                                                .customer_email
                                            }
                                          </strong>
                                        </p>
                                      </div>
                                    )}
                                    <div className={styles.customerInfo}>
                                      <div className={styles.smallTitle}>
                                        Delivery Address:{' '}
                                      </div>
                                      <div>
                                        <strong>
                                          {formData.address}, {formData.city},{' '}
                                          {formData.state} {formData.postcode},{' '}
                                          {formData.country}
                                        </strong>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                              {[
                                'local-installation',
                                'click-collect',
                                'pickup-from-hsp',
                                'on-site-fitting',
                              ].some(id => id === deliveryOption.id) &&
                                selectedStore?.location &&
                                (() => {
                                  const {
                                    city = '',
                                    country = '',
                                    postalCode = '',
                                    stateAbbr = '',
                                    street = '',
                                  } = selectedStore.location || {};

                                  return (
                                    <div className={styles.deliveryAddressBox}>
                                      <div className={styles.left}>
                                        <b>HSP Vehicle Accessories</b>
                                      </div>
                                      <div className={styles.right}>
                                        {`${street}, ${city}, ${stateAbbr} ${postalCode}, ${country}`}
                                      </div>
                                    </div>
                                  );
                                })()}

                              {deliveryOption.noteContent}

                              {deliveryOption.selectedAddress.btnTitle && (
                                <button
                                  className={styles.link}
                                  onClick={() => setIsFormFilled(false)}
                                >
                                  {deliveryOption.selectedAddress.btnTitle}
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className={styles.storeLocate}>
                              {openDrawer === deliveryOption.id && (
                                <div className={styles.drawer}>
                                  {/* On-Site Fitting: swap the store
                                      picker for the "When Can We Fit
                                      Your Vehicle?" panel once a store
                                      is chosen. Click & Collect and
                                      Local Installation still show the
                                      picker straight through. */}
                                  {(deliveryOption.id === 'click-collect' ||
                                    deliveryOption.id ===
                                      'local-installation' ||
                                    (deliveryOption.id === 'on-site-fitting' &&
                                      !selectedStore?.name)) &&
                                    (Array.isArray(allStores) &&
                                    allStores.length > 0 ? (
                                      <SelectLocation
                                        allStores={allStores}
                                        onSelect={onSelect}
                                      />
                                    ) : (
                                      <p style={{ padding: '1rem' }}>
                                        Loading stores…
                                      </p>
                                    ))}
                                  {deliveryOption.id === 'on-site-fitting' &&
                                    selectedStore?.name &&
                                    (() => {
                                      const loc = selectedStore.location || {};
                                      const addressLine = [
                                        loc.street,
                                        loc.city,
                                        loc.stateAbbr || loc.state,
                                      ]
                                        .filter(Boolean)
                                        .join(', ');
                                      // Format the fitting date as
                                      // "Weekday DD/MM" for the summary
                                      // pill — e.g. "Wednesday 29/10".
                                      const formatFittingDate = iso => {
                                        if (!iso) return '';
                                        const [y, m, d] = iso.split('-');
                                        const dt = new Date(
                                          Number(y),
                                          Number(m) - 1,
                                          Number(d),
                                        );
                                        if (Number.isNaN(dt.getTime()))
                                          return iso;
                                        const weekday = dt.toLocaleDateString(
                                          'en-AU',
                                          { weekday: 'long' },
                                        );
                                        return `${weekday} ${d}/${m}`;
                                      };
                                      const storeHeader = (
                                        <>
                                          <div
                                            className={
                                              styles.fittingSelectedStore
                                            }
                                          >
                                            <div
                                              className={
                                                styles.fittingSelectedStoreLeft
                                              }
                                            >
                                              <span
                                                className={
                                                  styles.fittingSelectedStoreLabel
                                                }
                                              >
                                                Selected Store:
                                              </span>
                                              <strong>
                                                {selectedStore.name}
                                              </strong>
                                            </div>
                                            {addressLine && (
                                              <div
                                                className={
                                                  styles.fittingSelectedStoreAddr
                                                }
                                              >
                                                {addressLine}
                                              </div>
                                            )}
                                          </div>
                                          <button
                                            className={
                                              styles.fittingChangeStore
                                            }
                                            onClick={() => {
                                              setSelectedStore({});
                                              setFormData(prev => ({
                                                ...prev,
                                                fittingDate: '',
                                              }));
                                              setIsFormFilled(false);
                                              setPaymentContinued(false);
                                            }}
                                            type="button"
                                          >
                                            Change Store
                                          </button>
                                        </>
                                      );

                                      if (isFormFilled) {
                                        // Confirmed state — summary
                                        // panel with the date shown as
                                        // a red pill and an Edit
                                        // Selection link that drops the
                                        // dealer back into the date
                                        // input.
                                        return (
                                          <div
                                            className={styles.fittingDateBlock}
                                          >
                                            {storeHeader}
                                            <div
                                              className={
                                                styles.fittingPromptHead
                                              }
                                            >
                                              <h3>Fitting Time Availability</h3>
                                              <p>
                                                Our team will get in touch to
                                                confirm a fitting time. You have
                                                indicated availability from the
                                                following date:
                                              </p>
                                            </div>
                                            <div
                                              className={styles.fittingDatePill}
                                            >
                                              {formatFittingDate(
                                                formData.fittingDate,
                                              )}
                                            </div>
                                            <button
                                              className={
                                                styles.fittingEditSelection
                                              }
                                              onClick={() => {
                                                setIsFormFilled(false);
                                                setPaymentContinued(false);
                                              }}
                                              type="button"
                                            >
                                              Edit Selection
                                            </button>
                                          </div>
                                        );
                                      }

                                      // Date-entry state (pre-confirm).
                                      return (
                                        <div
                                          className={styles.fittingDateBlock}
                                        >
                                          {storeHeader}
                                          <div
                                            className={styles.fittingPromptHead}
                                          >
                                            <h3>
                                              When Can We Fit Your Vehicle?
                                            </h3>
                                            <p>
                                              Our local HSP specialists can fit
                                              your products on-site at your
                                              dealership. Please let us know the
                                              date your vehicle will be
                                              available from.
                                            </p>
                                          </div>
                                          <div
                                            className={styles.fittingDateField}
                                          >
                                            <span
                                              className={
                                                styles.fittingDateFloatLabel
                                              }
                                            >
                                              Date
                                            </span>
                                            <input
                                              className={
                                                styles.fittingDateInput
                                              }
                                              id="fittingDate"
                                              min={
                                                new Date()
                                                  .toISOString()
                                                  .split('T')[0]
                                              }
                                              name="fittingDate"
                                              onChange={e =>
                                                setFormData(prev => ({
                                                  ...prev,
                                                  fittingDate: e.target.value,
                                                }))
                                              }
                                              type="date"
                                              value={formData.fittingDate}
                                            />
                                          </div>
                                          <button
                                            className={styles.fittingConfirmBtn}
                                            disabled={!formData.fittingDate}
                                            onClick={() =>
                                              setIsFormFilled(true)
                                            }
                                            type="button"
                                          >
                                            Confirm Selection
                                          </button>
                                        </div>
                                      );
                                    })()}
                                  {(deliveryOption.id === 'deliver-to-store' ||
                                    deliveryOption.id ===
                                      'drop-shipping-to-customer') && (
                                    <Delivery
                                      allowDelivery={
                                        deliveryOption.allowDelivery
                                      }
                                      askCutomerInfo={
                                        deliveryOption.askCutomerInfo
                                      }
                                      formData={formData}
                                      isFormFilled={isFormFilled}
                                      setFormData={setFormData}
                                      setIsFormFilled={setIsFormFilled}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {/* On-Site Fitting only: after Confirm Selection, show
                a Get a Quote / Continue to Payment CTA row instead of
                jumping straight into the payment card. Continue to
                Payment flips paymentContinued so the payment card
                appears below. All other delivery flows skip this row
                entirely and go straight to the payment card. */}
            {isFormFilled &&
              formData.orderType === 'on-site-fitting' &&
              !paymentContinued && (
                <div className={styles.fittingCtaRow}>
                  <button
                    className={styles.fittingCtaQuote}
                    onClick={openQuoteForm}
                    type="button"
                  >
                    Get a Quote
                  </button>
                  <button
                    className={styles.fittingCtaPay}
                    onClick={() => setPaymentContinued(true)}
                    type="button"
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
            {/* After Filling the form this will be appeared */}
            {isFormFilled &&
              (formData.orderType !== 'on-site-fitting' ||
                paymentContinued) && (
                <div className={styles.checkOutPayment}>
                  <div className={styles.heading}>
                    <h2>Payment</h2>
                    <p>All transactions are secure and encrypted</p>
                  </div>

                  {role === 'retail' && noGiftCard && (
                    <div className={styles.couponBox}>
                      <input placeholder="Gift Card Number" type="text" />
                      <button disabled type="button">
                        Apply
                      </button>
                    </div>
                  )}

                  {/* Per Figma 188:8623, B2B Payment block opens with PO
                    Number BEFORE the payment method radios. Dealer VIN
                    follows the same pattern. T&Cs + Marketing stay in
                    the groupTerms section below the payment options. */}
                  {isDealerLike && (
                    <div className={styles.paymentOrderFields}>
                      <div className={styles.colFull}>
                        <div className={styles.inputGroup}>
                          <label>
                            Purchase Order Number
                            <span className={styles.reqStar}>*</span>
                          </label>
                          <input
                            name="purchaseOrderNumber"
                            onChange={handleChange}
                            required
                            type="text"
                            value={formData.purchaseOrderNumber}
                          />
                        </div>
                      </div>
                      {role === 'dealer' && (
                        <div className={styles.colFull}>
                          <div className={styles.inputGroup}>
                            <label>
                              VIN
                              <span className={styles.reqStar}>*</span>
                            </label>
                            <input
                              name="vehicleIdentifier"
                              onChange={handleChange}
                              required
                              type="text"
                              value={formData.vehicleIdentifier}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className={styles.paymenSelection}>
                    {isDealerLike && accountTerms && (
                      <div
                        className={clsx(styles.payBox, styles.accountTermsBox)}
                      >
                        <input
                          checked={formData.payment_method === 'account-terms'}
                          name="payment_method"
                          onChange={handleRadioChange}
                          type="radio"
                          value="account-terms"
                        />
                        <span>Account Terms*</span>
                        <div className={styles.accountTermsInfo}>
                          {accountTerms.creditLimit && (
                            <div className={styles.accountTermsLimit}>
                              {formatPrice(accountTerms.creditLimit)}
                            </div>
                          )}
                          {accountTerms.paymentTermName && (
                            <div className={styles.accountTermsLabel}>
                              {accountTerms.paymentTermName}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className={styles.payBox}>
                      <input
                        checked={formData.payment_method === 'credit-card'}
                        name="payment_method"
                        onChange={handleRadioChange}
                        type="radio"
                        value="credit-card"
                      />
                      <span>Credit Card</span>
                      <Image
                        alt={'Cards'}
                        height={43}
                        src={PaymentIcons}
                        width={154}
                      />
                    </div>
                    <div className={styles.payBox}>
                      <input
                        checked={formData.payment_method === 'paypal'}
                        name="payment_method"
                        onChange={handleRadioChange}
                        type="radio"
                        value="paypal"
                      />
                      <span>PayPal</span>
                      <Image
                        alt={'Cards'}
                        height={49}
                        src={PaypalIcon}
                        width={112}
                      />
                    </div>
                    <div className={styles.payBox}>
                      <input
                        checked={formData.payment_method === 'cod'}
                        name="payment_method"
                        onChange={handleRadioChange}
                        type="radio"
                        value="cod"
                      />
                      <span>COD (Cash on Delivery)</span>
                    </div>
                  </div>

                  {/* T&Cs + Marketing — visible for ALL roles. Used to
                    gate this on `role !== 'b2b'` because B2B had its
                    own T&Cs inside the contact-details edit form, but
                    those vanished when the autofill collapsed the
                    card. Now there's one canonical T&Cs section here
                    near Place Order, visible to every role. */}
                  <div className={styles.groupTerms}>
                    {/* PO Number + VIN now render at the top of the
                      Payment section above (per Figma). Only the T&Cs
                      and Marketing checkboxes live here, near Place
                      Order. */}
                    <div className={styles.colFull}>
                      <div className={styles.inputGroup}>
                        <div className={styles.selectOption}>
                          {/* Link lives OUTSIDE the label. Previously it
                            was nested inside <label><span>…<Link/></span>
                            </label>, and clicking anywhere on the
                            label (including the checkbox itself)
                            bubbled up into the Link's click handler
                            and navigated the whole tab to the T&Cs
                            page instead of just toggling the tick. */}
                          <label>
                            <input
                              checked={formData.termsAndConditions}
                              name="termsAndConditions"
                              onChange={handleCheckboxChange}
                              type="checkbox"
                            />{' '}
                            <span>
                              I accept the Privacy Policy and Terms & Conditions
                            </span>
                          </label>{' '}
                          <Link
                            href="/privacy-terms-and-conditions"
                            onClick={e => e.stopPropagation()}
                            target="_blank"
                          >
                            Read our T&Cs{' '}
                            <span className={styles.reqStar}>*</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className={styles.colFull}>
                      <div className={styles.inputGroup}>
                        <div className={styles.selectOption}>
                          <label>
                            <input
                              checked={formData.marketing}
                              name="marketing"
                              onChange={handleCheckboxChange}
                              type="checkbox"
                            />{' '}
                            <span>
                              I agree to receiving Marketing and Promotional
                              emails from HSP
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className={styles.placeOrderBtn}
                    disabled={
                      !formData.first_name ||
                      // last_name is empty by design for B2B/dealer — see
                      // the comment on the requiredFields list in
                      // handleSubmit. Only block on it for retail.
                      (!isDealerLike && !formData.last_name) ||
                      !formData.email ||
                      !formData.phone ||
                      !formData.termsAndConditions ||
                      !formData.payment_method ||
                      (isDealerLike && !formData.company) ||
                      (isDealerLike && !formData.purchaseOrderNumber) ||
                      (role === 'dealer' && !formData.vehicleIdentifier) ||
                      loading ||
                      cartItems.length === 0
                    }
                    type="submit"
                  >
                    Place Order
                  </Button>
                </div>
              )}
          </div>

          {/* Checkout Right */}
          <div className={styles.checkOutRight}>
            <div className={styles.checkOutItemsMain}>
              <h3>Products</h3>
              {cartLoading ? (
                <div className={styles.loading}>
                  <Loading size="large" />
                </div>
              ) : (
                cartItems.map((item, index) => (
                  <div className={styles.checkOutItem} key={item.product_id}>
                    <div className={styles.itemImg}>
                      <Image
                        alt={item.product_name}
                        height={100}
                        src={item.product_image}
                        width={100}
                      />
                    </div>
                    <div className={styles.itemInfo}>
                      <h6>{item.product_name}</h6>
                      <p>
                        Qty: {item.quantity}{' '}
                        <Link href={item.product_slug}>View Details</Link>
                      </p>
                    </div>
                    <div className={styles.itemPrice}>
                      {formatPrice(item.price)}
                    </div>
                  </div>
                ))
              )}
              <div className={styles.couponBlock}>
                <input
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="Coupon Code"
                  type="text"
                  value={couponCode}
                />
                <button
                  className={styles.couponBtn}
                  disabled={checkoutLoading || !couponCode}
                  onClick={async () => {
                    // Bug fix: the old `if (applyCoupon(couponCode))`
                    // treated the returned Promise as truthy and
                    // cleared the field immediately, before the
                    // resolver returned — so the user never saw their
                    // typed code stick. Await it, and only clear on
                    // success so a failed/invalid code stays in the
                    // field for the user to correct.
                    const ok = await applyCoupon(couponCode);
                    if (ok) setCouponCode('');
                  }}
                  type="button"
                >
                  {checkoutLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              {/* Coupon result feedback — context sets couponMessage to
                  a ✅ / ❌ / ⚠️ string after applyCoupon resolves;
                  without this <p> nothing rendered it and the user
                  thought the click did nothing. */}
              {couponMessage && (
                <p className={styles.couponMessage}>{couponMessage}</p>
              )}
              <div className={styles.checkoutSummary}>
                <h3>Summary</h3>
                <div className={styles.subTotal}>
                  <div className={styles.subTotaltitle}>Subtotal</div>
                  <div className={styles.subTotalPrice}>
                    {formatPrice(cartSubTotal)}
                  </div>
                </div>
                {/* Row visibility driven by showInstallation /
                    showFreight / showFittingCharge constants at the
                    top of the component — see the per-role spec
                    comment there for the full table. */}
                {showInstallation && (
                  <div className={styles.subTotal}>
                    <div className={styles.subTotaltitle}>
                      Installation Cost
                    </div>
                    <div className={styles.subTotalPrice}>
                      {formatPrice(installSum)}
                    </div>
                  </div>
                )}
                {showFittingCharge && (
                  <div className={styles.subTotal}>
                    <div className={styles.subTotaltitle}>Fitting Charge</div>
                    <div className={styles.subTotalPrice}>
                      {formatPrice(ONSITE_FITTING_CHARGE)}
                    </div>
                  </div>
                )}
                {showFreight && (
                  <div className={styles.subTotal}>
                    <div className={styles.subTotaltitle}>Freight</div>
                    <div className={styles.subTotalPrice}>
                      {formatPrice(freightSum)}
                    </div>
                  </div>
                )}
                {appliedCoupons.length > 0 &&
                  appliedCoupons.map((coupon, index) => (
                    <div
                      className={clsx(styles.subTotal, styles.discount)}
                      key={index}
                    >
                      <div className={styles.subTotaltitle}>
                        Discount ({coupon.code})
                      </div>
                      <div className={styles.subTotalPrice}>
                        -
                        {coupon.discount_type === 'percent'
                          ? `${coupon.amount}%`
                          : formatPrice(coupon.amount)}
                      </div>
                    </div>
                  ))}

                <div className={styles.finalTotal}>
                  <div className={styles.finalTotaltitle}>TOTAL</div>
                  <div className={styles.finalTotalPrice}>
                    {formatPrice(
                      // Start from cartTotal (includes install +
                      // freight) and back out anything not visible in
                      // the breakdown above, then add the fitting
                      // charge if it's visible. Keeps the AUD figure
                      // in lockstep with the rendered rows.
                      cartTotal -
                        totalDiscount -
                        (showInstallation ? 0 : installSum) -
                        (showFreight ? 0 : freightSum) +
                        (showFittingCharge ? ONSITE_FITTING_CHARGE : 0),
                      'AUD ',
                    )}
                    <span>(incl. 10% GST)</span>
                  </div>
                </div>

                {formData.orderType === 'local-installation' && (
                  <div className={styles.noInstallationCost}>
                    <div className={styles.finalTotal}>
                      <div className={styles.finalTotaltitle}>Due Now</div>
                      <div className={styles.finalTotalPrice}>
                        {formatPrice(
                          cartTotal - installSum - totalDiscount,
                          'AUD ',
                        )}
                      </div>
                    </div>
                    <div className={styles.instruction}>
                      <div className={styles.left}>
                        <p>
                          Fitting cost to be paid to the store on the day of the
                          installation
                        </p>
                      </div>
                      <div className={styles.right}>
                        {formatPrice(installSum)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {isDealerLike &&
                (showQuoteForm ? (
                  <div className={styles.quoteForm}>
                    <div className={styles.inputGroup}>
                      <label>Quote Amount (AUD)</label>
                      <input
                        min="0"
                        onChange={e => setQuoteAmount(e.target.value)}
                        step="0.01"
                        type="number"
                        value={quoteAmount}
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Notes</label>
                      <textarea
                        onChange={e => setQuoteNotes(e.target.value)}
                        placeholder="Add any notes for this quote (optional)"
                        rows={3}
                        value={quoteNotes}
                      />
                    </div>
                    <Button
                      className={styles.getQuoteBtn}
                      disabled={loading || !quoteAmount}
                      onClick={handleSubmitQuote}
                      type="button"
                    >
                      Submit Quote
                    </Button>
                    <button
                      className={styles.quoteCancel}
                      onClick={() => setShowQuoteForm(false)}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <Button
                    className={styles.getQuoteBtn}
                    disabled={loading || cartItems.length === 0}
                    onClick={openQuoteForm}
                    type="button"
                    variant="ghost"
                  >
                    Get A Quote Instead
                  </Button>
                ))}
            </div>
          </div>
        </form>
      </section>
    </Container>
  );
}

export default CheckoutForm;
