'use client';

import { memo, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useUserContext } from '@contexts/user';
import { useWishlist } from '@contexts/wishlist';

import { formatPrice } from '@lib/helpers';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Tabs from '@components/tabs/tabs';

import EditIconSvg from '@assets/icons/pencil-icon.svg';

import styles from './retail.module.scss';

function CheckUser({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('userId');

    if (user) {
      setIsLoggedIn(true);
    } else {
      router.replace('/login'); // redirect to login if not found
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    // Optional: You can show a loader or skeleton while checking
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    // Nothing to render because redirect will happen
    return null;
  }

  return <>{children}</>;
}

function WishList() {
  const { removeFromWishlist, wishlistItems } = useWishlist();

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
}

const AccountDetails = memo(function AccountDetailsComponent() {
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

        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

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
});

function AccountHeader() {
  const { handleLogout } = useUserContext();

  return (
    <section className={styles.accountHeader}>
      <div className={styles.headerWrapper}>
        <h1>Account</h1>
        <div className={styles.btns}>
          <button
            className={styles.button}
            onClick={() => handleLogout()}
            type="button"
          >
            SIGN OUT
          </button>
        </div>
      </div>
    </section>
  );
}

export default function RetailPage() {
  return (
    <CheckUser>
      <Layout title="Retail Account">
        <Container>
          <AccountHeader />
          <Tabs
            tabs={[
              {
                content: (
                  <div>
                    <h3>Order</h3>
                  </div>
                ),
                slug: 'orders',
                title: 'Orders',
              },
              {
                content: <WishList />,
                slug: 'wishlist',
                title: 'Wishlist',
              },
              {
                content: <AccountDetails />,
                slug: 'accountdetails',
                title: 'Account Details',
              },
            ]}
            type="vertical"
          />
        </Container>
      </Layout>
    </CheckUser>
  );
}
