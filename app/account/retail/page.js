'use client';

import { useState } from 'react';

import Link from 'next/link';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import VerticalTabs from '@components/vertical-tabs/vertical-tabs';

import styles from './retail.module.scss';

export default function RetailPage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <Layout title="Retail Account">
      <Container>
        <section className={styles.accountHeader}>
          <div className={styles.headerWrapper}>
            <h1>Account</h1>
            <div className={styles.btns}>
              <Link className={styles.button} href="/login">
                SIGN OUT
              </Link>
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
              <VerticalTabs tab={activeTab} />
            </div>
            {/* END: Tab Content */}
          </div>
        </section>
      </Container>
    </Layout>
  );
}
