'use client';

import React, { useEffect, useState } from 'react';

import Link from 'next/link';

import { useUserContext } from '@contexts/user';

import { getStoreById } from '@lib/api/get-store-by-id';
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
                <strong>
                  {data?.address_2 ?? data?.aptUnit ?? data?.aptunit}
                </strong>
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
      {(user?.role === 'b2b' || user?.role === 'dealer') && (
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

    // For B2B + dealer accounts: resolve the user → their assigned store
    // via getStoreByUserId, then hit Lokesh's storeById($storeId: ID!)
    // resolver for the clean delivery/billing address pair the portal
    // wants to render. We can't go straight to storeById because we
    // don't know the storeId from the auth token alone — the user →
    // store mapping lives in the WP store post's assignedB2bUser field,
    // so getStoreByUserId is the bridge.
    //
    // Verbose logging here on purpose: when the Address tab renders
    // empty in production, the user / Lokesh needs the network
    // breakdown to know whether the failure is
    //   (a) no store assigned to this WP user,
    //   (b) the store has no storeId custom field set, or
    //   (c) the storeById resolver isn't returning addresses.
    // Each step logs what it found.
    async function getStoreDetails() {
      try {
        console.log('[Address] resolving store for userId:', userId);
        const store = await getStoreByUserId(userId);
        console.log('[Address] getStoreByUserId →', store);

        // Prefer the storeId set on the assigned Store post in WP. When
        // the field is empty (most existing stores haven't been
        // backfilled yet) fall back to the canonical "hsp" storeId for
        // B2B accounts so Lokesh's storeById resolver can still return
        // the HSP head-office address pair. Dealer accounts have to
        // resolve from their own store post — there's no equivalent
        // shared fallback for them.
        const storeId = store?.storeId || (user?.role === 'b2b' ? 'hsp' : null);
        if (storeId) {
          console.log('[Address] calling storeById with storeId:', storeId);
          const storeData = await getStoreById(storeId);
          console.log('[Address] getStoreById →', storeData);
          if (storeData?.billingAddress || storeData?.deliveryAddress) {
            setBilling(storeData.billingAddress);
            setShipping(storeData.deliveryAddress);
            return;
          }
        } else {
          console.warn(
            '[Address] no storeId on assigned store + no role-level fallback — trying fragment addresses',
          );
        }

        // Fallback path 1: storeById didn't return usable addresses
        // (resolver isn't deployed yet, no storeId set, or its
        // addresses are empty). Try the dedicated billingAddress /
        // deliveryAddress ACF groups that the StoreFragment pulled.
        //
        // Has to look for MEANINGFUL fields, not just "any non-null
        // value". WP defaults the `country` field on these groups to
        // `["AU"]` on every store post even when the admin hasn't
        // touched the rest. A naive `.some(v => v != null)` check
        // therefore treats every store as "populated" and renders an
        // address card with nothing but Country = AU — exactly the
        // empty-looking card the b2b portal was showing. Require at
        // least one of the user-meaningful identifier fields
        // (addressName / streetAddress / city / postalCode) to actually
        // be set before using this path.
        const isPopulatedAddress = addr =>
          Boolean(
            addr?.addressName ||
              addr?.streetAddress ||
              addr?.city ||
              addr?.postalCode,
          );
        if (
          isPopulatedAddress(store?.billingAddress) ||
          isPopulatedAddress(store?.deliveryAddress)
        ) {
          setBilling(store.billingAddress);
          setShipping(store.deliveryAddress);
          return;
        }

        // Fallback path 2: the dealer's billingAddress / deliveryAddress
        // ACF groups haven't been filled in on the WP Store post yet,
        // but the generic `addressFields` (the same data Account
        // Details shows under "Business Address") usually IS populated.
        // Reuse it for both tabs so the dealer sees their store
        // address rather than an empty card. Once WP admin fills in
        // the dedicated billing/delivery groups, those take over.
        //
        // WP's ACF returns multi-select fields (country, state) as
        // arrays — e.g. `["Australia"]`, `["Victoria (AU)"]`. React
        // renders single-element arrays of strings OK, but flatten to
        // strings here so the value is consistent for downstream
        // logic and for direct display.
        const firstOf = v => (Array.isArray(v) ? v[0] : v);
        if (store?.location) {
          const generic = {
            addressName: store.name || store.title || null,
            aptunit: null,
            city: firstOf(store.location.city),
            country: firstOf(store.location.country),
            postalCode: store.location.postalCode,
            state: firstOf(store.location.stateAbbr),
            streetAddress: firstOf(store.location.street),
          };
          console.warn(
            '[Address] billingAddress/deliveryAddress empty in WP — showing generic addressFields as fallback',
            generic,
          );
          setBilling(generic);
          setShipping(generic);
          return;
        }

        console.warn(
          '[Address] no addresses found anywhere — this user likely has no store assigned in WP (assignedB2bUser field on the Store post)',
        );
      } catch (e) {
        console.error('[Address] fetch error:', e);
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === 'b2b' || user?.role === 'dealer') {
      getStoreDetails();
    } else if (user?.role === 'retail') {
      loadAddress();
    } else {
      setLoading(false);
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
