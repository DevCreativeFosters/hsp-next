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

import LinkIcon from '@assets/icons/link-icon.svg';
import PdfIcon from '@assets/icons/pdf-icon.svg';
import AccessImg from '@assets/images/access-img.png';
import GoldIcon from '@assets/images/gold-icon.png';
import Logo2 from '@assets/images/load-bar.png';
import Logo1 from '@assets/images/rollcover.png';
import SilverIcon from '@assets/images/silver-icon.png';
import Logo3 from '@assets/images/tall-assist.png';

import styles from './b2b.module.scss';

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
    return <div className={styles.pageLoad}>Loading...</div>;
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
              <Link className={styles.button} href={item.productSlug}>
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
      <h2 className={styles.sectionTitle}>Canopies WA</h2>

      <div className={styles.customBtns}>
        <a className={styles.goldButton} href="#">
          <Image alt={'HSP Logo'} height={50} src={GoldIcon} width={50} />
          Grand Master Store
        </a>
        <a className={styles.silverButton} href="#">
          <Image alt={'HSP Logo'} height={38} src={SilverIcon} width={38} />
          Access Platinum Price List Here
        </a>
      </div>

      <div className={styles.borderBox}>
        <div className={styles.tableInfo}>
          <h5>Business Details</h5>
          <div className={styles.tableWrapper}>
            <table>
              <tr>
                <td>Business Address:</td>
                <td>Unit 2/1956 Beach Rd, Malaga WA 6090</td>
              </tr>
              <tr>
                <td>Communications Email:</td>
                <td>
                  <a href="mailto:info@canopieswa.com.au">
                    info@canopieswa.com.au
                  </a>
                </td>
              </tr>
              <tr>
                <td>Accounts Email:</td>
                <td>
                  <a href="mailto:accounts@canopieswa.com.au">
                    accounts@canopieswa.com.au
                  </a>
                </td>
              </tr>
              <tr>
                <td>Phone Number:</td>
                <td>
                  <a href="tel:+1300498432">1300 498 432</a>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <div className={styles.tableInfo}>
          <h5>Account Terms</h5>
          <div className={styles.tableWrapper}>
            <table>
              <tr>
                <td>Credit Limit:</td>
                <td>$100,000</td>
              </tr>
              <tr>
                <td>Payment Terms:</td>
                <td>45 Days</td>
              </tr>
            </table>
          </div>
        </div>

        <div className={styles.currentStatus}>
          <div className={styles.title}>HSP Reseller Since</div>
          <div className={styles.date}>21st July, 2025</div>
        </div>
      </div>

      <div className={styles.borderBox}>
        <div className={styles.logosList}>
          <h4>In-Store Displays</h4>
          <ul>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={44} src={Logo1} width={187} />
              </figure>
            </li>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={38} src={Logo2} width={127} />
              </figure>
            </li>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={38} src={Logo2} width={127} />
              </figure>
            </li>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={40} src={Logo3} width={128} />
              </figure>
            </li>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={40} src={Logo3} width={128} />
              </figure>
            </li>
          </ul>
          <div className={styles.btns}>
            <button className={styles.button} type="button">
              Request Display Pricing
            </button>
          </div>
        </div>
      </div>

      <div className={styles.bottomText}>
        <p>
          To Edit Any Business Information, Please <a href="#">Contact Us</a>
        </p>
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
                content: <AccountDetails />,
                slug: 'accountdetails',
                title: 'Account Details',
              },
              {
                content: (
                  <div className={styles.addressBlock}>
                    <div className={styles.info}>
                      <div className={styles.dRow}>
                        <div className={styles.dTitle}>Address Name</div>
                        <div className={styles.dDesc}>
                          <strong>Canopies Store Front</strong>
                        </div>
                      </div>
                      <div className={styles.halfColInfo}>
                        <div className={styles.colInfo}>
                          <div className={styles.dRow}>
                            <div className={styles.dTitle}>Street Address</div>
                            <div className={styles.dDesc}>
                              <strong>6 Raiders Street</strong>
                            </div>
                          </div>
                        </div>
                        <div className={styles.colInfo}>
                          <div className={styles.dRow}>
                            <div className={styles.dTitle}>Apt/Unit</div>
                            <div className={styles.dDesc}>
                              <strong>302</strong>
                            </div>
                          </div>
                        </div>
                        <div className={styles.colInfo}>
                          <div className={styles.dRow}>
                            <div className={styles.dTitle}>City</div>
                            <div className={styles.dDesc}>
                              <strong>Melbourne</strong>
                            </div>
                          </div>
                        </div>
                        <div className={styles.colInfo}>
                          <div className={styles.dRow}>
                            <div className={styles.dTitle}>State</div>
                            <div className={styles.dDesc}>
                              <strong>WA</strong>
                            </div>
                          </div>
                        </div>
                        <div className={styles.colInfo}>
                          <div className={styles.dRow}>
                            <div className={styles.dTitle}>Country</div>
                            <div className={styles.dDesc}>
                              <strong>Australia</strong>
                            </div>
                          </div>
                        </div>
                        <div className={styles.colInfo}>
                          <div className={styles.dRow}>
                            <div className={styles.dTitle}>Post Code</div>
                            <div className={styles.dDesc}>
                              <strong>3031</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className={styles.button}>
                      Edit Saved Address
                    </button>
                  </div>
                ),
                slug: 'Address',
                title: 'Address',
              },
              {
                content: (
                  <div className={styles.orderBox}>
                    <div className={styles.orderWrap}>
                      <div className={styles.heading}>
                        <div className={styles.left}>
                          <h5>Order #245678</h5>
                          <h6>2 Products | 13:45pm Nov 10, 2025</h6>
                        </div>
                        <div className={styles.right}>
                          <button className={styles.statusButton}>
                            Awaiting Collection
                          </button>
                        </div>
                      </div>
                      <div className={styles.orderBody}>
                        <div className={styles.productInfo}>
                          <div className={styles.orderRow}>
                            <div className={styles.title}>Order Total:</div>
                            <div className={styles.desc}>
                              <del>RRP $3694</del>
                              <strong>$2000</strong>
                            </div>
                          </div>
                          <div className={styles.orderRow}>
                            <div className={styles.title}>
                              Fulfillment Method:
                            </div>
                            <div className={styles.desc}>Pickup from HSP</div>
                          </div>
                          <div className={styles.orderRow}>
                            <div className={styles.title}>
                              Collection Address:
                            </div>
                            <div className={styles.desc}>40 Overseas Drive</div>
                          </div>
                          <div className={styles.orderRow}>
                            <div className={styles.title}>
                              Purchase Order Number:
                            </div>
                            <div className={styles.desc}>12345678901203</div>
                          </div>
                        </div>
                        <div className={styles.orderBottom}>
                          <a className={styles.button} href="#">
                            Download Invoice
                          </a>
                          <a className={styles.outlineButton} href="#">
                            See Products
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
                slug: 'OrderDashboard',
                title: 'Order Dashboard',
              },
              {
                content: <WishList />,
                slug: 'wishlist',
                title: 'Wishlist',
              },
              {
                content: (
                  <div className={styles.resourceMain}>
                    <h3 className={styles.sectionTitle}>Marketing Resources</h3>
                    <ul>
                      <li>
                        <LinkIcon />
                        <a href="#">HSP Logos & Branding Guides</a>
                      </li>
                      <li>
                        <LinkIcon />
                        <a href="#">Social Media Posts</a>
                      </li>
                      <li>
                        <LinkIcon />
                        <a href="#">Product Photos</a>
                      </li>
                      <li>
                        <LinkIcon />
                        <a href="#">Editable Flyers</a>
                      </li>
                      <li>
                        <LinkIcon />
                        <a href="#">Lifestyle Images</a>
                      </li>
                      <li>
                        <LinkIcon />
                        <a href="#">Display Signage Options</a>
                      </li>
                    </ul>

                    <div className={styles.lmsBlock}>
                      <div className={styles.left}>
                        <h4>Learning Management System</h4>
                        <p>
                          The Learning Module System (LMS) is an online training
                          platform designed to equip your new and existing staff
                          with in-depth knowledge of HSP products, so they can
                          deliver exceptional service and drive sales.
                        </p>
                        <a className={styles.button} href="#">
                          Access LMS Here
                        </a>
                      </div>
                      <div className={styles.right}>
                        <figure>
                          <Image
                            alt={'HSP Logo'}
                            height={188}
                            src={AccessImg}
                            width={417}
                          />
                        </figure>
                      </div>
                    </div>
                  </div>
                ),
                slug: 'resources',
                title: 'Resources',
              },
              {
                content: (
                  <div className={styles.warrantyBlock}>
                    <h3 className={styles.sectionTitle}>Warranty Procedures</h3>
                    <p>
                      At HSP Vehicle Accessories, we take immense pride in our
                      after-sales service, ensuring that our customers receive
                      exceptional support long after their purchase. We’ve
                      established clear and thorough warranty procedures,
                      ensuring prompt resolution of any issues that may arise.
                    </p>
                    <ul>
                      <li>
                        <PdfIcon />
                        <a href="#">Roll Cover Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Load Racks and Load Bar Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Armour Bar Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Load Slide Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Tail Lock Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Tail Assist Warranty Guide </a>
                      </li>
                      <li>
                        <LinkIcon />
                        <a href="#">Spare Parts Price List</a>
                      </li>
                    </ul>
                  </div>
                ),
                slug: 'support',
                title: 'Support',
              },
            ]}
            type="vertical"
          />
        </Container>
      </Layout>
    </CheckUser>
  );
}
