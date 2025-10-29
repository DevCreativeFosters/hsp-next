'use client';

// 1. सुनिश्चित करें कि useState import किया गया है
import { useState } from 'react';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import styles from './retail.module.scss';

export default function RetailPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const TabContent = ({ tab }) => {
    switch (tab) {
      case 'orders':
        return (
          <div>
            <h3>Order</h3>
          </div>
        );
      case 'wishlist':
        return (
          <div className={styles.wishlistBoxes}>
            <div className={styles.wishlistBox}>
              <figure>
                <img
                  alt="Sample Product"
                  src="http://localhost:3000/_next/image?url=https%3A%2F%2Fwordpress-1505184-5847603.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2023%2F12%2FP1014750-1-scaled.jpg&w=256&q=75"
                />
              </figure>
              <div className={styles.wContent}>
                <h4>Roll R Cover 3.5 for Ford Ranger Raptor</h4>
                <p>
                  <strong>Part No</strong> NGR42RS3.5
                </p>
                <p>
                  <strong>Variant:</strong> Ranger Raptor suits no sport bars
                </p>
                <div className={styles.price}>$3,300.00</div>
              </div>
              <div className={styles.wActions}>
                <a className={styles.button} href="#">
                  View
                </a>
                <a className={styles.link} href="#">
                  Remove
                </a>
              </div>
            </div>
            <div className={styles.wishlistBox}>
              <figure>
                <img
                  alt="Sample Product"
                  src="http://localhost:3000/_next/image?url=https%3A%2F%2Fwordpress-1505184-5847603.cloudwaysapps.com%2Fwp-content%2Fuploads%2F2023%2F12%2FP1014750-1-scaled.jpg&w=256&q=75"
                />
              </figure>
              <div className={styles.wContent}>
                <h4>Roll R Cover 3.5 for Ford Ranger Raptor</h4>
                <p>
                  <strong>Part No</strong> NGR42RS3.5
                </p>
                <p>
                  <strong>Variant:</strong> Ranger Raptor suits no sport bars
                </p>
                <div className={styles.price}>$3,300.00</div>
              </div>
              <div className={styles.wActions}>
                <a className={styles.button} href="#">
                  View
                </a>
                <a className={styles.link} href="#">
                  Remove
                </a>
              </div>
            </div>

            <div className={styles.moreBtn}>
              <a className={styles.button} href="#">
                Add More Items to Wishlist
              </a>
            </div>
          </div>
        );
      case 'accountdetails':
        return (
          <div className={styles.accountDetails}>
            <div className={styles.info}>
              <div className={styles.dRow}>
                <div className={styles.dTitle}>First Name</div>
                <div className={styles.dDesc}>Ash</div>
                <div className={styles.dAction}></div>
              </div>
              <div className={styles.dRow}>
                <div className={styles.dTitle}>Last Name</div>
                <div className={styles.dDesc}>Bouyer</div>
                <div className={styles.dAction}></div>
              </div>
              <div className={styles.dRow}>
                <div className={styles.dTitle}>Phone Number</div>
                <div className={styles.dDesc}>1300 441 498</div>
                <div className={styles.dAction}></div>
              </div>
              <div className={styles.dRow}>
                <div className={styles.dTitle}>Email</div>
                <div className={styles.dDesc}>
                  <a href="mailto:info@hsputelids.com">info@hsputelids.com</a>
                </div>
                <div className={styles.dAction}></div>
              </div>
            </div>

            <div className={styles.currentStatus}>
              <div className={styles.title}>Member Since</div>
              <div className={styles.date}>21st July, 2025</div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout title="Retail Account">
      <Container>
        <section className={styles.accountHeader}>
          <div className={styles.headerWrapper}>
            <h1>Account</h1>
            <div className={styles.btns}>
              <a className={styles.button} href="#">
                SIGN OUT
              </a>
            </div>
          </div>
        </section>
        <section className={styles.accountContent}>
          <div className={styles.tabsMain}>
            {/* START: Tab Nav */}
            <div className={styles.tabsNav}>
              <button
                className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'wishlist' ? styles.active : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                Wishlist
              </button>
              <button
                className={`${styles.tabButton} ${activeTab === 'accountdetails' ? styles.active : ''}`}
                onClick={() => setActiveTab('accountdetails')}
              >
                Account Details
              </button>
            </div>
            {/* END: Tab Nav */}

            {/* START: Tab Content */}
            <div className={styles.tabsMain}>
              <TabContent tab={activeTab} />
            </div>
            {/* END: Tab Content */}
          </div>
        </section>
      </Container>
    </Layout>
  );
}
