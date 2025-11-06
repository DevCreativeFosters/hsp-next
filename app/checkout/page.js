'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useCart } from '@contexts/cart-context';
import { CheckoutProvider, useCheckout } from '@contexts/checkout';

import { getStores } from '@lib/api/get-stores';
import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';
import ClickCollect from '@components/checkout-drawers/click-collect';
import DeliverToDoor from '@components/checkout-drawers/deliver-to-door';
import LocalInstallation from '@components/checkout-drawers/local-installation';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Loading from '@components/loading/loading';

import LocationIcon from '@assets/icons/location-icon.svg';
import SettingIcon from '@assets/icons/setting-icon.svg';
import TruckIcon from '@assets/icons/truck-icon.svg';
import PaymentIcons from '@assets/images/payment-icon.png';
import PaypalIcon from '@assets/images/paypal.png';

import styles from './checkout.module.scss';

function CheckoutPage() {
  const router = useRouter();

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
    address: '',

    city: '',

    company: '',

    // Deliver to Door
    country: 'AU',

    deliveryCompanyName: '',

    email: '',

    // Contact Details
    first_name: '',

    last_name: '',
    marketing: false,
    orderType: '',
    payment_method: '',
    phone: '',
    postcode: '',

    selectedStore: '',

    state: '',

    termsAndConditions: false,
  });

  const [deliveryOptions, setDeliveryOptions] = useState([
    {
      description:
        'Choose a local HSP fitter to get your accessories installed',
      icon: SettingIcon,
      id: 'local-installation',
      selectedAddress: {
        btnTitle: 'Change Method',
        title: 'Local Installation',
      },
      title: 'Local Installation',
    },
    {
      description: 'Convenient Local Pickup',
      icon: LocationIcon,
      id: 'click-collect',
      selectedAddress: {
        btnTitle: 'Edit Selection',
        title: 'Click & Collect',
      },
      title: 'Click & Collect',
    },
    {
      description: 'Sent within 1-3 business days',
      icon: TruckIcon,
      id: 'deliver-door',
      selectedAddress: {
        btnTitle: 'Edit Selection',
        title: 'Delivery',
      },
      title: 'Deliver to Door',
    },
  ]);
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

  const handleSelectOption = id => {
    setDeliveryOptions(prev => {
      const selected = prev.find(opt => opt.id === id);
      const others = prev.filter(opt => opt.id !== id);

      // if selected is already first → toggle drawer
      if (prev[0].id === id) {
        // setOpenDrawer(openDrawer === id ? '' : id);
        setOpenDrawer(id);
        setFormData({ ...formData, orderType: id });
        // setSelectedStore('');
        return prev; // keep order the same
      }

      // otherwise, move it to the first position and open its drawer
      setOpenDrawer('');
      return [selected, ...others];
    });
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
                  <div className={styles.colFull}>
                    <div className={styles.inputGroup}>
                      <label>
                        Company Name (Optional)
                        <span className={styles.reqStar}>*</span>
                      </label>
                      <input
                        name="company"
                        onChange={handleChange}
                        type="text"
                        value={formData.company}
                      />
                    </div>
                  </div>
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
                            <Link href="/privacy-terms-and-conditions">
                              Read our T&Cs
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
                  ) : isFormFilled ? (
                    <div className={styles.editSelection}>
                      <div className={styles.heading}>
                        <h2>
                          {(() => {
                            const Icon = deliveryOptions[0].icon;
                            return <Icon className={styles.icon} />;
                          })()}
                          {deliveryOptions[0].selectedAddress.title}
                        </h2>
                        <button
                          className={styles.link}
                          onClick={() => setIsFormFilled(false)}
                        >
                          {deliveryOptions[0].selectedAddress.btnTitle}
                        </button>
                      </div>
                      {deliveryOptions[0].id === 'deliver-door' ? (
                        <div className={styles.deliveryAddressBox}>
                          Delivery Address: {formData.address}, {formData.city},{' '}
                          {formData.state} {formData.postcode},{' '}
                          {formData.country}
                        </div>
                      ) : (
                        <div className={styles.deliveryAddressBox}>
                          <div className={styles.left}>
                            Selected Address: <b>HSP Vehicle Accessories</b>{' '}
                          </div>
                          <div className={styles.right}>{selectedStore} </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    deliveryOptions.map(option => (
                      <div
                        className={styles.boxItem}
                        key={option.id}
                        onClick={() => handleSelectOption(option.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.contentBox}>
                          <div className={styles.contentWrap}>
                            <h3>
                              <option.icon /> {option.title}
                            </h3>
                            <p>{option.description}</p>
                          </div>
                          <div className={styles.storeLocate}>
                            {openDrawer === option.id &&
                              deliveryOptions[0].id === option.id && (
                                <div className={styles.drawer}>
                                  {/* hello */}
                                  {/* {option.drawerContent} */}
                                  {option.id === 'local-installation' && (
                                    <LocalInstallation
                                      allStores={allStores}
                                      onSelect={onSelect}
                                    />
                                  )}
                                  {option.id === 'click-collect' && (
                                    <ClickCollect
                                      allStores={allStores}
                                      onSelect={onSelect}
                                    />
                                  )}
                                  {option.id === 'deliver-door' && (
                                    <DeliverToDoor
                                      formData={formData}
                                      isFormFilled={isFormFilled}
                                      setFormData={setFormData}
                                      setIsFormFilled={setIsFormFilled}
                                    />
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))
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
    <CheckoutProvider>
      <CheckoutPage />
    </CheckoutProvider>
  );
}

export default Checkout;
