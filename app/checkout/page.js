'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useCart } from '@contexts/cart-context';

import { formatPrice } from '@lib/helpers';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Loading from '@components/loading/loading';

import LocationIcon from '@assets/icons/location-icon.svg';
import SettingIcon from '@assets/icons/setting-icon.svg';
import TruckIcon from '@assets/icons/truck-icon.svg';

import styles from './checkout.module.scss';

function LocalInstallationDrawer() {
  return (
    <div className={styles.drawerContent}>
      <h3>Local Installation</h3>
      <p>Choose a local HSP fitter to get your accessories installed</p>
    </div>
  );
}

function ClickCollectDrawer() {
  return (
    <div className={styles.drawerContent}>
      <h3>Click & Collect</h3>
      <p>Convenient Local Pickup</p>
    </div>
  );
}

function DeliverToDoorDrawer({ cartItems }) {
  return (
    <div className={styles.drawerContent}>
      <h3>Deliver to Door</h3>
      <p>{cartItems.length} items</p>
    </div>
  );
}

export default function CheckoutPage() {
  const { cartItems, cartSubTotal, cartTotal, loading } = useCart();

  const [deliveryOptions, setDeliveryOptions] = useState([
    {
      description:
        'Choose a local HSP fitter to get your accessories installed',
      drawerContent: <LocalInstallationDrawer />,
      icon: <SettingIcon />,
      id: 'local-installation',
      title: 'Local Installation',
    },
    {
      description: 'Convenient Local Pickup',
      drawerContent: <ClickCollectDrawer />,
      icon: <LocationIcon />,
      id: 'click-collect',
      title: 'Click & Collect',
    },
    {
      description: 'Sent within 1-3 business days',
      drawerContent: <DeliverToDoorDrawer cartItems={cartItems} />,
      icon: <TruckIcon />,
      id: 'deliver-door',
      title: 'Deliver to Door',
    },
  ]);

  const [openDrawer, setOpenDrawer] = useState('');

  const handleSelectOption = id => {
    setDeliveryOptions(prev => {
      const selected = prev.find(opt => opt.id === id);
      const others = prev.filter(opt => opt.id !== id);

      // if selected is already first → toggle drawer
      if (prev[0].id === id) {
        setOpenDrawer(openDrawer === id ? '' : id);
        return prev; // keep order the same
      }

      // otherwise, move it to the first position and open its drawer
      setOpenDrawer('');
      return [selected, ...others];
    });
  };

  return (
    <Layout title="Checkout | HSP">
      <Container>
        <section className={styles.checkoutMain}>
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
                    <input type="text" />
                  </div>
                </div>
                <div className={styles.colHalf}>
                  <div className={styles.inputGroup}>
                    <label>
                      Last Name<span className={styles.reqStar}>*</span>
                    </label>
                    <input type="text" />
                  </div>
                </div>
                <div className={styles.colFull}>
                  <div className={styles.inputGroup}>
                    <label>
                      Email Address<span className={styles.reqStar}>*</span>
                    </label>
                    <input type="text" />
                  </div>
                </div>
                <div className={styles.colFull}>
                  <div className={styles.inputGroup}>
                    <label>
                      Mobile Number<span className={styles.reqStar}>*</span>
                    </label>
                    <input type="text" />
                  </div>
                </div>
                <div className={styles.colFull}>
                  <div className={styles.inputGroup}>
                    <label>
                      Company Name (Optional)
                      <span className={styles.reqStar}>*</span>
                    </label>
                    <input type="text" />
                  </div>
                </div>
                <div className={styles.colFull}>
                  <div className={styles.inputGroup}>
                    <div className={styles.selectOption}>
                      <label>
                        <input type="checkbox" />{' '}
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
                        <input type="checkbox" />{' '}
                        <span>
                          I agree to receiving Marketing and Promotional emails
                          from HSP
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
                {loading ? (
                  <div className={styles.loading}>
                    <Loading size="large" />
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
                            {option.icon} {option.title}
                          </h3>
                          <p>{option.description}</p>
                        </div>
                        {openDrawer === option.id &&
                          deliveryOptions[0].id === option.id && (
                            <div className={styles.drawer}>
                              {option.drawerContent}
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Checkout Right */}
          <div className={styles.checkOutRight}>
            <div className={styles.checkOutItemsMain}>
              <h3>Products</h3>
              {loading ? (
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
                <input type="text" />
                <button className={styles.couponBtn} disabled>
                  Apply
                </button>
              </div>
              <div className={styles.checkoutSummary}>
                <h3>Summary</h3>
                <div className={styles.subTotal}>
                  <div className={styles.subTotaltitle}>Subtotal</div>
                  <div className={styles.subTotalPrice}>
                    {formatPrice(cartSubTotal)}
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
                  </div>
                </div>
                <div className={styles.finalTotal}>
                  <div className={styles.finalTotaltitle}>TOTAL</div>
                  <div className={styles.finalTotalPrice}>
                    {formatPrice(cartTotal)}
                    <span>(incl. 10% GST)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}
