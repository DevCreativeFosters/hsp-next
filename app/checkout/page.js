'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';
import { CheckoutProvider, useCheckout } from '@contexts/checkout';
import { UserProvider } from '@contexts/user';
import { useUserContext } from '@contexts/user';

import { getStores } from '@lib/api/get-stores';
import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';
import Delivery from '@components/checkout-drawers/delivery';
import SelectLocation from '@components/checkout-drawers/select-location';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Loading from '@components/loading/loading';

import DropShipping from '@assets/icons/drop-shipping.svg';
import LocationIcon from '@assets/icons/location-icon.svg';
import SettingIcon from '@assets/icons/setting-icon.svg';
import TruckIcon from '@assets/icons/truck-icon.svg';
import PaymentIcons from '@assets/images/payment-icon.png';
import PaypalIcon from '@assets/images/paypal.png';

import styles from './checkout.module.scss';

function CheckoutPage() {
  const router = useRouter();
  const { user } = useUserContext();

  const [loading, setLoading] = useState(false);

  const {
    cartItems,
    cartSubTotal,
    cartTotal,
    getCartItems,
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
    // End
    // Deliver to Door (deliver-door)
    // Start
    country: 'AU',
    deliveryCompanyName: '',

    email: '',
    // Start
    first_name: '',
    last_name: '',

    marketing: false,

    // End
    orderType: '',

    payment_method: '',

    phone: '',

    postcode: '',

    purchaseOrderNumber: '',

    // End
    // Local Installation (local-installation), Click & Collect (click-collect)
    // Start
    selectedStore: '',

    state: '',
    termsAndConditions: false,
  });

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
        btnTitle: 'Change Method',
        title: 'Local Installation',
      },
      selectedMenu: {
        content: (
          <>
            <p>
              Choose a local HSP fitter to get your accessories installed. Your
              selected store will reach out to you to book a suitable fitting
              time.
            </p>
          </>
        ),
        title: 'Local Installation',
      },
      title: 'Local Installation',
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
        btnTitle: 'Edit Selection',
        title: 'Click & Collect',
      },
      selectedMenu: {
        content: (
          <>
            <p>
              Your Selected Store Will Reach Out To You To Provide a Collection
              Time.
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
      description: 'Sent within 1-3 business days',
      icon: TruckIcon,
      id: 'deliver-door',
      noteContent: <></>,
      role: 'retail',
      selectedAddress: {
        btnTitle: 'Edit Selection',
        title: 'Delivery',
      },
      selectedMenu: {
        content: (
          <>
            <p>
              Appropriate delivery costs will be added to the final order
              summary
            </p>
          </>
        ),
        title: 'Deliver to Door',
      },
      title: 'Deliver to Door',
    },
    {
      allowDelivery: true,
      askCutomerInfo: false,
      description:
        'Get your products dispatched to your store within 1-2 business days*',
      icon: TruckIcon,
      id: 'standard-delivery',
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
        btnTitle: 'Edit Selection',
        title: 'Deliver to You',
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
        title: 'Deliver to You',
      },
      title: 'Standard Delivery',
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
        btnTitle: 'Edit Selection',
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
      askCutomerInfo: true,
      description: 'Get your products sent directly to a customers address',
      icon: DropShipping,
      id: 'drop-shipping',
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
        btnTitle: 'Edit Selection',
        title: 'Drop Shipping',
      },
      selectedMenu: {
        content: (
          <>
            <p>
              Appropriate delivery costs will be added to the final order
              summary
            </p>
          </>
        ),
        title: 'Drop Shipping',
      },
      title: 'Drop Shipping',
    },
  ];

  const role = user.role;

  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState('');

  const [allStores, setAllStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');

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
    const currentOpenDrawer = openDrawer === id ? '' : id;

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
    console.log(formData);
    // return;

    setLoading(true);

    const requiredFields = [
      'first_name',
      'last_name',
      'email',
      'phone',
      'company',
      'termsAndConditions',
      'marketing',
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
      selectedStore,
      ...(appliedCoupons[0]?.code && { coupon: appliedCoupons[0]?.code || '' }),
    };

    const result = await checkoutOrder(payload);
    if (result?.order_id) {
      await getCartItems();
      setLoading(false);
      router.push(`/order-status/${result.order_id}`);
    } else {
      alert(`❌ ${result?.message || 'Order failed'}`);
    }

    setLoading(false);
  };

  return (
    <Layout title="Checkout | HSP">
      <Container className={styles.checkoutContainer}>
        <section className={clsx(styles.checkoutMain, 'checkoutMain')}>
          <form onSubmit={handleSubmit}>
            {/* Checkout Left */}
            <div className={styles.checkOutLeft}>
              {/* Contact Details */}
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
                  <div
                    className={clsx({
                      [styles.colHalf]: role === 'b2b',
                      [styles.colFull]: role !== 'b2b',
                    })}
                  >
                    <div className={styles.inputGroup}>
                      <label>Company Name</label>
                      <input
                        name="company"
                        onChange={handleChange}
                        type="text"
                        value={formData.company}
                      />
                    </div>
                  </div>
                  {role === 'b2b' && (
                    <div className={styles.colHalf}>
                      <div className={styles.inputGroup}>
                        <label>Purchase Order Number</label>
                        <input
                          name="purchaseOrderNumber"
                          onChange={handleChange}
                          type="text"
                          value={formData.purchaseOrderNumber}
                        />
                      </div>
                    </div>
                  )}
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
                            I accept the
                            <Link href="/privacy-terms-and-conditions">
                              Privacy Policy
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy-terms-and-conditions">
                              Terms and Conditions
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
              </div>

              {/* Receive Details */}
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
                              {openDrawer === deliveryOption.id ? (
                                <>
                                  <h3>
                                    <deliveryOption.icon />{' '}
                                    {deliveryOption.selectedMenu.title}
                                  </h3>
                                  <div>
                                    {deliveryOption.selectedMenu.content}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <h3>
                                    <deliveryOption.icon />{' '}
                                    {deliveryOption.title}
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
                                  'standard-delivery',
                                  'drop-shipping',
                                ].some(id => id === deliveryOption.id) && (
                                  <>
                                    <div className={styles.deliveryAddressBox}>
                                      {deliveryOption.askCutomerInfo && (
                                        <p>
                                          Customer Name:{' '}
                                          {
                                            formData.additionalCustomerInfo
                                              .customer_first_name
                                          }{' '}
                                          {
                                            formData.additionalCustomerInfo
                                              .customer_last_name
                                          }
                                        </p>
                                      )}
                                      <p>
                                        Delivery Address: {formData.address},{' '}
                                        {formData.city}, {formData.state}{' '}
                                        {formData.postcode}, {formData.country}
                                      </p>
                                    </div>
                                  </>
                                )}
                                {[
                                  'local-installation',
                                  'click-collect',
                                  'pickup-from-hsp',
                                ].some(id => id === deliveryOption.id) && (
                                  <div className={styles.deliveryAddressBox}>
                                    <div className={styles.left}>
                                      Selected Address:{' '}
                                      <b>HSP Vehicle Accessories</b>{' '}
                                    </div>
                                    <div className={styles.right}>
                                      {selectedStore}{' '}
                                    </div>
                                  </div>
                                )}

                                <button
                                  className={styles.link}
                                  onClick={() => setIsFormFilled(false)}
                                >
                                  {deliveryOption.selectedAddress.btnTitle}
                                </button>
                              </div>
                            ) : (
                              <div className={styles.storeLocate}>
                                {openDrawer === deliveryOption.id && (
                                  <div className={styles.drawer}>
                                    {(deliveryOption.id === 'click-collect' ||
                                      deliveryOption.id ===
                                        'local-installation' ||
                                      deliveryOption.id ===
                                        'pickup-from-hsp') && (
                                      <SelectLocation
                                        allStores={allStores}
                                        onSelect={onSelect}
                                      />
                                    )}
                                    {(deliveryOption.id === 'deliver-door' ||
                                      deliveryOption.id ===
                                        'standard-delivery' ||
                                      deliveryOption.id ===
                                        'drop-shipping') && (
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
                  <div className={styles.couponBox}>
                    <input placeholder="Gift Card Number" type="text" />
                    <button disabled type="button">
                      Apply
                    </button>
                  </div>

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

                  <Button
                    className={styles.placeOrderBtn}
                    disabled={
                      !formData.first_name ||
                      !formData.last_name ||
                      !formData.email ||
                      !formData.phone ||
                      !formData.company ||
                      !formData.termsAndConditions ||
                      !formData.marketing ||
                      !formData.payment_method ||
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
                                  total +
                                  item.installation_cost * item.quantity,
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
                            Fitting cost to be paid to the store on the day of
                            the installation
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
    </Layout>
  );
}

function Checkout() {
  return (
    <UserProvider>
      <CheckoutProvider>
        <CheckoutPage />
      </CheckoutProvider>
    </UserProvider>
  );
}

export default Checkout;
