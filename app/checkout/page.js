'use client';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import LocationIcon from '@assets/icons/location-icon.svg';
import SettingIcon from '@assets/icons/setting-icon.svg';
import TruckIcon from '@assets/icons/truck-icon.svg';

import styles from './checkout.module.scss';

export default function LoginPage() {
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
                          <a href="#">Read our T&Cs</a>
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
                <div className={styles.boxItem}>
                  <div className={styles.contentBox}>
                    <div className={styles.contentWrap}>
                      <h3>
                        <SettingIcon /> Local Installation
                      </h3>
                      <p>
                        Choose a local HSP fitter to get your accessories
                        installed
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.boxItem}>
                  <div className={styles.contentBox}>
                    <div className={styles.contentWrap}>
                      <h3>
                        <LocationIcon /> Click & Collect
                      </h3>
                      <p>Convenient Local Pickup</p>
                    </div>
                  </div>
                </div>
                <div className={styles.boxItem}>
                  <div className={styles.contentBox}>
                    <div className={styles.contentWrap}>
                      <h3>
                        <TruckIcon /> Deliver to Door
                      </h3>
                      <p>Sent within 1-3 business days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Right */}
          <div className={styles.checkOutRight}>
            <div className={styles.checkOutItemsMain}>
              <h3>Products</h3>
              <div className={styles.checkOutItem}>
                <div className={styles.itemImg}>
                  <img src="https://wordpress-1505184-5847603.cloudwaysapps.com/wp-content/uploads/2024/08/A12-Web.jpg" />
                </div>
                <div className={styles.itemInfo}>
                  <h6>HSP Roll R Cover 3.5 for Ford Ranger Raptor</h6>
                  <p>
                    Qty: 1 <a href="#">View Details</a>
                  </p>
                </div>
                <div className={styles.itemPrice}>$3,300.00</div>
              </div>
              <div className={styles.checkOutItem}>
                <div className={styles.itemImg}>
                  <img src="https://wordpress-1505184-5847603.cloudwaysapps.com/wp-content/uploads/2024/08/A12-Web.jpg" />
                </div>
                <div className={styles.itemInfo}>
                  <h6>HSP Roll R Cover 3.5 for Ford Ranger Raptor</h6>
                  <p>
                    Qty: 1 <a href="#">View Details</a>
                  </p>
                </div>
                <div className={styles.itemPrice}>$3,300.00</div>
              </div>
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
                  <div className={styles.subTotalPrice}>$6,600.00</div>
                </div>
                <div className={styles.finalTotal}>
                  <div className={styles.finalTotaltitle}>TOTAL</div>
                  <div className={styles.finalTotalPrice}>
                    AUD 6,600.00<span>(incl. 10% GST)</span>
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
