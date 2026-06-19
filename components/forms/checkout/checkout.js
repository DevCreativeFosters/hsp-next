'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';
import { useCheckout } from '@contexts/checkout';
import { useUserContext } from '@contexts/user';

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
  const { user } = useUserContext();

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
    billing_address: '',
    billing_address_2: '',
    billing_city: '',
    billing_company: '',
    billing_country: 'AU',
    billing_postcode: '',
    billing_same_as_shipping: true,
    billing_state: '',
    city: '',
    company: '',
    country: 'AU',
    deliveryCompanyName: '',
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

  const noGiftCard = cartItems.every(item => item.recipientEmail == null);

  const allDeliveryOptions = [
    {
      allowDelivery: false,
      askCutomerInfo: false,
      description:
        'Choose a local HSP fitter to get your accessories installed',
      icon: SettingIcon,
      id: 'local-installation',
      noteContent: <></>,
      role: 'retail',
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
      description: 'Sent within 1-3 business days',
      icon: TruckIcon,
      id: 'deliver-door',
      noteContent: <></>,
      role: 'retail',
      selectedAddress: {
        btnTitle: 'Edit Address',
        title: 'Deliver to Door',
      },
      selectedMenu: {
        content: (
          <>
            <p>Sent within 1-3 business days</p>
          </>
        ),
        title: 'Deliver to Door',
      },
      title: 'Deliver to Door',
    },
    {
      allowDelivery: false,
      askCutomerInfo: false,
      description: 'Convenient Local Pickup',
      icon: LocationIcon,
      id: 'click-collect',
      noteContent: <></>,
      role: 'retail',
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
      role: 'b2b',
      selectedAddress: {
        btnTitle: 'Edit Address',
        title: 'Deliver to Door',
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
        title: 'Deliver to Door',
      },
      title: 'Deliver to Door',
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
      role: 'b2b',
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
      allowDelivery: false,
      askCutomerInfo: false,
      description:
        'Get your products fitted on-site at your dealership from our local HSP specialists.',
      icon: OnSiteFittingIcon,
      id: 'on-site-fitting',
      noteContent: <></>,
      role: 'b2b',
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
      return store?.availableDeliveryOptions || [];
    } catch (e) {
      console.error('Error getting orders:', e);
      return [];
    }
  }

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      if (user) {
        let filteredOptions = allDeliveryOptions.filter(
          opt => opt.role === role,
        );

        if (user?.id && user?.role === 'b2b') {
          const options = await getStoreDeliveryOptions(user.id);
          // Only restrict to the store's configured options when it actually
          // has some. If the dealer's store has none set (or no store linked),
          // fall back to showing all default b2b options instead of a blank
          // section.
          if (options && options.length > 0) {
            filteredOptions = filteredOptions.filter(opt =>
              options.includes(opt.id),
            );
          }
        }

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
      'last_name',
      'email',
      'phone',
      'termsAndConditions',
      'payment_method',
      'orderType',
      ...(role === 'b2b' ? ['purchaseOrderNumber', 'vehicleIdentifier'] : []),
    ];

    const isMissing = requiredFields.some(field => !formData[field]);
    if (isMissing) {
      alert('⚠️ Please fill all required fields.');
      setLoading(false);
      return;
    }

    // WP's CheckoutOrderInput doesn't accept `vehicleIdentifier` or the
    // local-only `billing_same_as_shipping` toggle. Strip them before
    // sending. If billing IS the same as shipping, also strip the
    // billing_* fields entirely (they would just duplicate the shipping
    // address with empty strings). If billing differs, the billing_*
    // fields will pass through and either be accepted by WP or rejected
    // with a clear schema error message we can use to wire them later.
    const {
      billing_address,
      billing_address_2,
      billing_city,
      billing_company,
      billing_country,
      billing_postcode,
      billing_same_as_shipping,
      billing_state,
      vehicleIdentifier,
      ...baseFormData
    } = formData;
    const formDataForWP = billing_same_as_shipping
      ? baseFormData
      : {
          ...baseFormData,
          billing_address,
          billing_address_2,
          billing_city,
          billing_company,
          billing_country,
          billing_postcode,
          billing_state,
        };
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
            {submitContactDetails && role !== 'b2b' ? (
              <div
                className={clsx(styles.contactDetails, styles.editDetailMain)}
              >
                <div className={styles.heading}>
                  <h2>Contact Details</h2>
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
                  {role === 'b2b' && <p>{formData.company}</p>}
                </div>
              </div>
            ) : (
              <div className={styles.contactDetails}>
                <div className={styles.heading}>
                  <h2>
                    {role === 'b2b' ? 'Dealership Details' : 'Contact Details'}
                  </h2>
                  <p>How Can We Reach You About Your Order?</p>
                </div>
                <div className={styles.formRow}>
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
                        Email Address<span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        name="email"
                        onChange={handleChange}
                        type="email"
                        value={formData.email}
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
                        {role === 'b2b' ? (
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
                  {role === 'b2b' ? (
                    <>
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
                      <div
                        className={clsx(styles.colFull, styles.dealershipTerms)}
                      >
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
                    </>
                  ) : (
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
                  [styles.blackBoxesFull]: role === 'b2b',
                })}
              >
                {cartLoading ? (
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
                              {[
                                'deliver-door',
                                'deliver-to-store',
                                'drop-ship-to-customer',
                              ].some(id => id === deliveryOption.id) && (
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
                                  {(deliveryOption.id === 'deliver-door' ||
                                    deliveryOption.id === 'deliver-to-store' ||
                                    deliveryOption.id ===
                                      'drop-ship-to-customer') && (
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

                {role === 'b2b' && (
                  <div className={clsx(styles.couponBox, styles.orderNoBox)}>
                    <input
                      maxLength={15}
                      name="purchaseOrderNumber"
                      onChange={handleChange}
                      placeholder="Purchase Order Number *"
                      type="text"
                      value={formData.purchaseOrderNumber}
                    />
                  </div>
                )}

                <div className={styles.paymenSelection}>
                  {role === 'b2b' && accountTerms && (
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

                {role !== 'b2b' && (
                  <div className={styles.groupTerms}>
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
                )}

                <Button
                  className={styles.placeOrderBtn}
                  disabled={
                    !formData.first_name ||
                    !formData.last_name ||
                    !formData.email ||
                    !formData.phone ||
                    !formData.termsAndConditions ||
                    !formData.payment_method ||
                    (role === 'b2b' && !formData.company) ||
                    (role === 'b2b' && !formData.purchaseOrderNumber) ||
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
                  onClick={() => {
                    if (applyCoupon(couponCode)) setCouponCode('');
                  }}
                  type="button"
                >
                  {checkoutLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              <div className={styles.checkoutSummary}>
                <h3>Summary</h3>
                <div className={styles.subTotal}>
                  <div className={styles.subTotaltitle}>Subtotal</div>
                  <div className={styles.subTotalPrice}>
                    {formatPrice(cartSubTotal)}.00
                  </div>
                </div>
                <div className={styles.subTotal}>
                  <div className={styles.subTotaltitle}>Installation Cost</div>
                  <div className={styles.subTotalPrice}>
                    {formatPrice(
                      cartItems.reduce(
                        (total, item) =>
                          total + item.installation_cost * item.quantity,
                        0,
                      ),
                    )}
                    .00
                  </div>
                </div>
                <div className={styles.subTotal}>
                  <div className={styles.subTotaltitle}>Freight</div>
                  <div className={styles.subTotalPrice}>
                    {formatPrice(
                      cartItems.reduce(
                        (total, item) => total + item.freight * item.quantity,
                        0,
                      ),
                    )}
                    .00
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
                        .00
                      </div>
                    </div>
                  ))}

                <div className={styles.finalTotal}>
                  <div className={styles.finalTotaltitle}>TOTAL</div>
                  <div className={styles.finalTotalPrice}>
                    {formatPrice(cartTotal - totalDiscount, 'AUD ')}.00
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
                        .00
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
                        .00
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {role === 'b2b' &&
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
