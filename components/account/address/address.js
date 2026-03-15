'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useUserContext } from '@contexts/user';

import { getStoreByUserId } from '@lib/api/get-store-by-user-id';
import { fetchAPI } from '@lib/fetch-api';

import Button from '@components/button/button';
import Loading from '@components/loading/loading';
import Tabs from '@components/tabs/tabs';

import styles from './address.module.scss';

const GET_USER_ADDRESS = `
  query GetUserAddress($userId: Int!) {
    userAddress(userId: $userId) {
      success
      message
      
      billing {
        first_name
        last_name
        address_name
        email
        phone
        address_1
        address_2
        city
        state
        postcode
        country
      }

      shipping {
        first_name
        last_name
        address_name
        phone
        address_1
        address_2
        city
        state
        postcode
        country
      }
    }
  }
`;

function AddressForm({ data }) {
  const { user } = useUserContext();

  return (
    <>
      <div className={styles.info}>
        <div className={styles.dRow}>
          <div className={styles.dTitle}>Address Name</div>
          <div className={styles.dDesc}>
            <strong>{data?.address_name ?? data?.addressName}</strong>
          </div>
        </div>
        <div className={styles.halfColInfo}>
          <div className={styles.colInfo}>
            <div className={styles.dRow}>
              <div className={styles.dTitle}>Street Address</div>
              <div className={styles.dDesc}>
                <strong>{data?.address_1 ?? data?.streetAddress}</strong>
              </div>
            </div>
          </div>
          <div className={styles.colInfo}>
            <div className={styles.dRow}>
              <div className={styles.dTitle}>Apt/Unit</div>
              <div className={styles.dDesc}>
                <strong>{data?.address_2 ?? data?.aptunit}</strong>
              </div>
            </div>
          </div>
          <div className={styles.colInfo}>
            <div className={styles.dRow}>
              <div className={styles.dTitle}>City</div>
              <div className={styles.dDesc}>
                <strong>{data?.city ?? data?.cityTw}</strong>
              </div>
            </div>
          </div>
          <div className={styles.colInfo}>
            <div className={styles.dRow}>
              <div className={styles.dTitle}>State</div>
              <div className={styles.dDesc}>
                <strong>{data?.state ?? data?.stateMy ?? data?.stateNz}</strong>
              </div>
            </div>
          </div>
          <div className={styles.colInfo}>
            <div className={styles.dRow}>
              <div className={styles.dTitle}>Country</div>
              <div className={styles.dDesc}>
                <strong>{data?.country}</strong>
              </div>
            </div>
          </div>
          <div className={styles.colInfo}>
            <div className={styles.dRow}>
              <div className={styles.dTitle}>Post Code</div>
              <div className={styles.dDesc}>
                <strong>{data?.postcode ?? data?.postalCode}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
      {user?.role === 'retail' && (
        <Button size="large">Edit Saved Address</Button>
      )}
      {user?.role === 'b2b' && (
        <div className={styles.bottomText}>
          <p>
            To Edit Any Business Information, Please{' '}
            <Link href="/contact-us">Contact Us</Link>
          </p>
        </div>
      )}
    </>
  );
}

function Address() {
  const { user } = useUserContext();

  const [billing, setBilling] = useState(null);
  const [shipping, setShipping] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

    async function loadAddress() {
      try {
        const res = await fetchAPI(GET_USER_ADDRESS, { variables: { userId } });

        const info = res?.userAddress;

        if (info?.success) {
          setBilling(info.billing);
          setShipping(info.shipping);
        }
      } catch (e) {
        console.error('Address fetch error:', e);
      } finally {
        setLoading(false);
      }
    }

    async function getStoreDetails() {
      try {
        const store = await getStoreByUserId(userId);
        console.log(store?.billingAddress, store?.deliveryAddress);

        if (store) {
          setBilling(store?.billingAddress);
          setShipping(store?.deliveryAddress);
        }
      } catch (e) {
        console.error('Error getting orders:', e);
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === 'b2b') {
      getStoreDetails();
    } else if (user?.role === 'retail') {
      loadAddress();
    }
  }, [user?.id, user?.role]);

  if (loading) return <Loading color="white" size="large" />;
  return (
    <div className={styles.addressBlock}>
      <Tabs
        tabs={[
          {
            content: <AddressForm data={shipping} />,
            slug: 'deliveryaddress',
            title: 'Delivery Address',
          },
          {
            content: <AddressForm data={billing} />,
            slug: 'billingaddress',
            title: 'Billing Address',
          },
        ]}
        type="horizontal"
      />
    </div>
  );
}

export default Address;
