'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';
import { useCheckout } from '@contexts/checkout';
import { useUserContext } from '@contexts/user';

import { getStores } from '@lib/api/get-stores';
import { formatPrice } from '@lib/helpers';
import normalizeStores from '@lib/normalize-stores';

import Button from '@components/button/button';
import Delivery from '@components/checkout-drawers/delivery';
import SelectLocation from '@components/checkout-drawers/select-location';
import Container from '@components/container/container';
import Loading from '@components/loading/loading';

import DropShipping from '@assets/icons/drop-shipping.svg';
import LocationIcon from '@assets/icons/location-icon.svg';
import SettingIcon from '@assets/icons/setting-icon.svg';
import TruckIcon from '@assets/icons/truck-icon.svg';
import PaymentIcons from '@assets/images/payment-icon.png';
import PaypalIcon from '@assets/images/paypal.png';

import styles from './checkout.module.scss';

function CheckoutForm() {
  const router = useRouter();
  const { user } = useUserContext();

  const [loading, setLoading] = useState(false);

  const {
    cartItems,
    cartSubTotal,
    cartTotal,
    loading: cartLoading,
  } = useCart();

  const {
    appliedCoupons,
    applyCoupon,
    checkoutOrder,
    loading: checkoutLoading,
    totalDiscount,
  } = useCheckout();
  const [couponCode, setCouponCode] = useState('');

  const [isFormFilled, setIsFormFilled] = useState(false);
  const [formData, setFormData] = useState({
    additionalCustomerInfo: {
      customer_email: '',
      customer_first_name: '',
      customer_last_name: '',
    },
    address: '',
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
      description: 'Get your order delivered to your Store',
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
      description: 'Pickup from HSP HQ in Noble Park North VIC 3977',
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
      allowDelivery: true,
      askCutomerInfo: true,
      description:
        'Get your products sent directly to your customers COMMERCIAL address',
      icon: DropShipping,
      id: 'drop-ship-to-customer',
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
        btnTitle: 'Edit Delivery Details',
        title: 'Drop Ship to Customer',
      },
      selectedMenu: {
        content: (
          <>
            <p>Get your products sent directly to a customers address</p>
          </>
        ),
        title: 'Drop Ship to Customer',
      },
      title: 'Drop Ship to Customer',
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
      setAllStores(stores);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      const filteredOptions = allDeliveryOptions.filter(
        opt => opt.role === role,
      );
      setDeliveryOptions(filteredOptions);
    }
  }, [user]);

  const handleSelectOption = id => {
    if (id === 'pickup-from-hsp') {
      const findItem = allStores.find(store => store.databaseId == 2513);
      const item = normalizeStores([findItem])[0];
      setSelectedStore(item);
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
    ];

    const isMissing = requiredFields.some(field => !formData[field]);
    if (isMissing) {
      alert('⚠️ Please fill all required fields.');
      return;
    }

    const payload = {
      ...formData,
      ...(selectedStore?.id && {
        selectedStoreID: (selectedStore?.id).toString(),
      }),
      ...(appliedCoupons[0]?.code && { coupon: appliedCoupons[0]?.code || '' }),
    };

    const result = await checkoutOrder(payload);
    if (result?.order_id) {
      setLoading(false);
      router.push(`/order-status/${result.order_id}`);
    } else {
      alert(`❌ ${result?.message || 'Order failed'}`);
    }

    setLoading(false);
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
                  <h2>Contact Details</h2>
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
                  <div className={clsx(styles.colFull, styles.submitBtn)}>
                    <Button
                      disabled={
                        !formData.first_name ||
                        !formData.last_name ||
                        !formData.email ||
                        !formData.phone ||
                        (role === 'b2b' && !formData.company) ||
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
                </div>
              </div>
            )}
            {/* Receive Details */}{' '}
            <div className={styles.checkOutInfo}>
              <div className={styles.heading}>
                <h2>How would you like to Receive your Order?</h2>
                <p>Choose a Delivery or Install Method</p>
              </div>
              <div className={styles.blackBoxes}>
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
                              ].some(id => id === deliveryOption.id) &&
                                (() => {
                                  const {
                                    address,
                                    city,
                                    country,
                                    postalCode,
                                    stateAbbr,
                                    street,
                                  } = selectedStore.location;

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
                                      'local-installation') && (
                                    <SelectLocation
                                      allStores={allStores}
                                      onSelect={onSelect}
                                    />
                                  )}
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
            </div>
          </div>
        </form>
      </section>
    </Container>
  );
}

export default CheckoutForm;
