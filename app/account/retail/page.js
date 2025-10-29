'use client';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useWishlist } from '@contexts/wishlist';

import { formatPrice } from '@lib/helpers';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import styles from './retail.module.scss';

export default function RetailPage() {
  const { removeFromWishlist, wishlistItems } = useWishlist();

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
            {wishlistItems.map(item => (
              <div className={styles.wishlistBox} key={item.productId}>
                <figure>
                  <Image alt="Sample Product" src={item.variantImage} />
                </figure>
                <div className={styles.wContent}>
                  <h4>{item.productName}</h4>
                  <p>
                    <strong>Part No.</strong> {item.variantSlug}
                  </p>
                  <p>
                    <strong>Variant:</strong> {item.variantName}
                  </p>
                  <div className={styles.price}>{formatPrice(item.price)}</div>
                </div>
                <div className={styles.wActions}>
                  <Link
                    className={styles.button}
                    href={`/products/${item.productSlug}`}
                  >
                    View
                  </Link>
                  <a
                    className={styles.link}
                    href="#"
                    onClick={() => removeFromWishlist(item.productId)}
                  >
                    Remove
                  </a>
                </div>
              </div>
            ))}

            <div className={styles.moreBtn}>
              <Link className={styles.button} href="/products">
                Add More Items to Wishlist
              </Link>
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
