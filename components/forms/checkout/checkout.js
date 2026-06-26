'use client';

import { useEffect, useState } from 'react';

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
import { getDealerCustomerDetails } from '@lib/api/get-dealer-customer-details';
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
  const [formData, setFormData] = useState({
    additionalCustomerInfo: {
      customer_email: '',
      customer_first_name: '',
      customer_last_name: '',
    },
    address: '',
    address_2: '',
    city: '',

    company: '',

    country: 'AU',

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
    email: '',
    first_name: '',
    last_name: '',
    marketing: false,
    orderType: '',
    payment_method: '',
    phone: '',
    postcode: '',
    purchaseOrderNumber: '',
    selectedStoreAddress: '',
    state: '',
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
  const [dealerAddressLine, setDealerAddressLine] = useState('');

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
      if (profile) {
        setFormData(prev => ({
          ...prev,
          company: profile.company || prev.company,
          first_name: profile.firstName || prev.first_name,
          last_name: profile.lastName || prev.last_name,
          phone: profile.phone || prev.phone,
        }));
        setCustomerLookup({ ...profile, isLoggedIn: true });
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
        const addrRes = await fetchAPI(
          `query($userId: Int!) {
            userAddress(userId: $userId) {
              success
              billing { first_name last_name email phone }
            }
          }`,
          { variables: { userId: user.id } },
        );
        if (cancelled) return;
        const billing = addrRes?.userAddress?.billing;
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
        //   Dealer → getDealerCustomerDetails.customerShippingAddress
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
        const pickPopulated = (...addrs) =>
          addrs.find(
            a =>
              a && Object.values(a).some(v => v != null && v !== '' && v !== 0),
          ) || null;

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
          const details = await getDealerCustomerDetails(user.id, {
            authToken: user.token,
          });
          if (cancelled) return;
          shipping = pickPopulated(
            details?.customerShippingAddress,
            details?.customerBillingAddress,
          );
        }

        setFormData(prev => ({
          ...prev,
          company: shipping?.company || profile?.company || prev.company,
          email: shipping?.email || billing.email || prev.email,
          first_name:
            shipping?.firstName ||
            postNameFallback ||
            profile?.firstName ||
            billing.first_name ||
            prev.first_name,
          last_name:
            shipping?.lastName ||
            // If we fell back to the post-name slug (B2B, blank
            // firstName from the resolver), null out last_name so
            // the summary line renders as just "canopies-wa" rather
            // than appending a stale personal last name.
            (postNameFallback && !shipping?.firstName
              ? ''
              : profile?.lastName || billing.last_name || prev.last_name),
          phone:
            shipping?.phone || profile?.phone || billing.phone || prev.phone,
        }));
        setSubmitContactDetails(true);

        // Same payload drives the address line under Contact Details
        // (the small grey one with the street address). No fallback
        // chain needed — the new resolvers carry the full address.
        if (shipping) {
          const line = [
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
  //   Retail  → click-collect, local-installation, pickup-from-hsp
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
      roles: ['retail', 'b2b', 'dealer'],
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

  const [submitContactDetails, setSubmitContactDetails] = useState(false);

  const handleSubmitContactDetails = () => {
    setSubmitContactDetails(true);
  };

  const handleEditContactDetails = () => {
    setSubmitContactDetails(false);
  };

  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState('');

  const [allStores, setAllStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState({});

  const onSelect = item => {
    setSelectedStore(item);
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
    };

    const result = await checkoutOrder(payload);
    if (result?.order_id) {
      // Wipe the shadow cart so the dealer doesn't accidentally re-order.
      if (typeof clearCart === 'function') clearCart();
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
            {/* Contact Details */}
            {submitContactDetails ? (
              <div
                className={clsx(styles.contactDetails, styles.editDetailMain)}
              >
                <div className={styles.heading}>
                  <h2>Contact Details</h2>
                  {/* Edit Details is retail-only. B2B and Dealer accounts
                      already have their profile populated server-side
                      (loaded from their dealer record), so the checkout
                      flow doesn't let them rewrite name/email/phone/
                      company inline — those changes go through Contact
                      Us per the portal Address tab's existing pattern. */}
                  {role === 'retail' && (
                    <Button
                      onClick={handleEditContactDetails}
                      size="large"
                      variant="ghost"
                    >
                      Edit Details
                    </Button>
                  )}
                </div>
                <div className={styles.submittedInfo}>
                  <p>
                    {formData.first_name} {formData.last_name}
                  </p>
                  <p>{formData.email}</p>
                  <p>{formData.phone}</p>
                  {formData.company && <p>{formData.company}</p>}
                  {dealerAddressLine && <p>{dealerAddressLine}</p>}
                </div>
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
                      5443:36032. The toggle below decides whether the
                      order ships here too (default) or to a separate
                      delivery address asked for inside Deliver-to-Door.

                      The outer colFull carries the formRow gutter
                      padding so the inner black card aligns with the
                      Email / Mobile / Company inputs above instead of
                      bleeding into the negative-margin overflow. */}
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
                        onClick={() => {
                          /* Visual confirm — fields already live in state */
                        }}
                        size="large"
                        variant="primary"
                      >
                        Confirm Address
                      </Button>
                    </div>
                  </div>

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
                          The delivery address is the same as the address listed
                          above.
                        </span>
                      </label>
                    </div>
                  </div>

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
                                  {(deliveryOption.id === 'click-collect' ||
                                    deliveryOption.id ===
                                      'local-installation' ||
                                    deliveryOption.id === 'on-site-fitting') &&
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
            {/* After Filling the form this will be appeared */}
            {isFormFilled && (
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
                        <label>
                          <input
                            checked={formData.termsAndConditions}
                            name="termsAndConditions"
                            onChange={handleCheckboxChange}
                            type="checkbox"
                          />{' '}
                          <span>
                            I accept the Privacy Policy and Terms & Conditions
                            <Link
                              href="/privacy-terms-and-conditions"
                              target="_blank"
                            >
                              Read our T&Cs{' '}
                              <span className={styles.reqStar}>*</span>
                            </Link>
                          </span>
                        </label>
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
                {/* Installation cost is suppressed for B2B accounts. B2B
                    customers resell rather than install themselves, so
                    showing (and charging) per-item installation cost on the
                    order summary is wrong. Dealer accounts keep it because
                    on-site-fitting is one of their delivery options. */}
                {role !== 'b2b' && (
                  <div className={styles.subTotal}>
                    <div className={styles.subTotaltitle}>
                      Installation Cost
                    </div>
                    <div className={styles.subTotalPrice}>
                      {formatPrice(
                        cartItems.reduce(
                          (total, item) =>
                            total + item.installation_cost * item.quantity,
                          0,
                        ),
                      )}
                    </div>
                  </div>
                )}
                <div className={styles.subTotal}>
                  <div className={styles.subTotaltitle}>Freight</div>
                  <div className={styles.subTotalPrice}>
                    {formatPrice(
                      cartItems.reduce(
                        (total, item) => total + item.freight * item.quantity,
                        0,
                      ),
                    )}
                  </div>
                </div>
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
                      cartTotal -
                        totalDiscount -
                        (role === 'b2b'
                          ? cartItems.reduce(
                              (total, item) =>
                                total + item.installation_cost * item.quantity,
                              0,
                            )
                          : 0),
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
                          cartTotal -
                            cartItems.reduce(
                              (total, item) =>
                                total + item.installation_cost * item.quantity,
                              0,
                            ) -
                            totalDiscount,
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
                        {formatPrice(
                          cartItems.reduce(
                            (total, item) =>
                              total + item.installation_cost * item.quantity,
                            0,
                          ),
                        )}
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
