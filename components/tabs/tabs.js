'use client';

// You can reuse retail.module.scss if you want
import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { useUserContext } from '@contexts/user';
import { useWishlist } from '@contexts/wishlist';

import { formatPrice } from '@lib/helpers';

import EditIconSvg from '@assets/icons/pencil-icon.svg';

import styles from './vertical-tabs.module.scss';

export default function VerticalTabs({ tab }) {
  const { removeFromWishlist, wishlistItems } = useWishlist();
  const { getUserById } = useUserContext();

  const [user, setUser] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      const userId =
        sessionStorage.getItem('userId') || localStorage.getItem('userId');
      if (!userId) return;

      try {
        const userData = await getUserById(Number(userId));
        console.log(userData);

        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, [getUserById]);

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
          {wishlistItems.length > 0 ? (
            wishlistItems.map(item => (
              <div className={styles.wishlistBox} key={item.productId}>
                <figure>
                  <Image
                    alt={item.productName}
                    height={100}
                    src={item.variantImage}
                    width={100}
                  />
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
            ))
          ) : (
            <p>No items in wishlist.</p>
          )}

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
              <div className={styles.dDesc}>{user?.firstName}</div>
              <div className={styles.dAction}>
                <a href="#">
                  <EditIconSvg />
                </a>
              </div>
            </div>
            <div className={styles.dRow}>
              <div className={styles.dTitle}>Last Name</div>
              <div className={styles.dDesc}>{user?.lastName}</div>
              <div className={styles.dAction}>
                <a href="#">
                  <EditIconSvg />
                </a>
              </div>
            </div>
            <div className={styles.dRow}>
              <div className={styles.dTitle}>Phone Number</div>
              <div className={styles.dDesc}>{user?.phone}</div>
            </div>
            <div className={styles.dRow}>
              <div className={styles.dTitle}>Email</div>
              <div className={styles.dDesc}>
                <a href={`mailto:${user?.email}`}>{user?.email}</a>
              </div>
            </div>
          </div>

          <div className={styles.currentStatus}>
            <div className={styles.title}>Member Since</div>
            <div className={styles.date}>{user?.member_since}</div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
