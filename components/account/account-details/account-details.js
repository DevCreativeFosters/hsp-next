'use client';

import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { useUserContext } from '@contexts/user';

import { getDealerStoreAddress } from '@lib/api/get-dealer-store-address';
import { fetchAPI } from '@lib/fetch-api';
import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';
import Loading from '@components/loading/loading';
import StoreDisplays from '@components/store-displays/store-displays';

import wideShotHero from '@assets/images/WideSHotExt1.png';

import styles from './account-details.module.scss';

const GET_STORE_BY_ID = `
query GetStoreById($id: ID!) {
  store(id: $id, idType: DATABASE_ID)  {
    id
    title
    odooCreditLimit
    odooPaymentTermName
    odooCompanyName
    storesCustomFields {
      priceList {
        node {
          id
          title
          sourceUrl
          mediaItemUrl
          mimeType
        }
      }
      addressFields {
        city
        cityTw
        country
        state
        stateMy
        stateNz
        streetAddress
        postalCode
      }
      directionsLink
      inStoreDisplays {
        productCategory {
          nodes {
            databaseId
            name
            ... on WithAcfMainCategoryDetails {
              mainCategoryDetails {
                inStoreImage {
                  node {
                    mediaItemUrl
                  }
                }
              }
            }
          }
        }
      }
      learnMore {
        title
        url
      }
      phoneNumber
      productInstallationCost {
        installationCost
        product {
          nodes {
            id
            slug
          }
        }
      }
      storeId
      storeLocationCoordinates {
        latitude
        longitude
      }
      rankingMultiplier
    }
    storeCategories {
      nodes {
        name
        slug
        storeCategoryCustomFields {
          color
          icon {
            node {
              sourceUrl
            }
          }
          pinIcon {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
}
`;

const GET_STORE_BY_USER_ID = `
  mutation GetStoreByUserId($userId: ID!) {
    getStoreByUserId(input: { userId: $userId }) {
      storeDetails {
        store_id
        communication_email
        account_email
        credit_limit
        payment_terms
      }
    }
  }
`;

const REQUEST_DISPLAY_PRICING = `
  mutation {
    requestDisplayPricing(input: {}) {
      success
      message
    }
  }
`;

function AccountDetails() {
  const { user } = useUserContext();

  const [loading, setLoading] = useState(true);
  const [storeDetails, setStoreDetails] = useState({});
  // Guards createPortal against SSR — document isn't available
  // during Next's server render pass, so we wait for the client
  // mount effect to flip this before touching document.body.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function getStoreDetails() {
      const userId = parseInt(localStorage.getItem('userId'));
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // Dealers don't have an assigned Store post, so the legacy
        // getStoreByUserId chain returns null and the Business
        // Details card renders empty. Lokesh's dealerStoreAddress
        // query carries the dealer's store address pair (delivery +
        // billing) in the same legacy shape the StoreFragment uses
        // (addressName, streetAddress, aptUnit, city, state,
        // country, postalCode, phoneNo) — map it into the same
        // storeDetails fields the JSX below reads, so the existing
        // table rendering works unchanged. Communications email is
        // not in this resolver; just leave it null.
        if (user?.role === 'dealer') {
          const storeAddr = await getDealerStoreAddress(userId, {
            authToken: user?.token,
          });
          const a =
            // Pick whichever address has the street fields.
            // Resolver returns both delivery + billing even when
            // only one is populated.
            [storeAddr?.deliveryAddress, storeAddr?.billingAddress].find(
              addr =>
                addr && (addr.streetAddress || addr.city || addr.postalCode),
            ) || null;

          if (a) {
            setStoreDetails({
              // Communications + Accounts emails come from the top
              // level of dealerStoreAddress (Lokesh added them
              // 2026-07-07). The Business Details table already
              // reads communication_email / account_email — reuse
              // those exact keys so the JSX renders them the same
              // way it does for B2B accounts.
              account_email: storeAddr?.accountEmail || null,
              // Business Address card pulls from addressFields.* —
              // map the dealer payload into the same shape.
              addressFields: {
                city: a.city || '',
                postalCode: a.postalCode || '',
                state: a.state ? [a.state] : null,
                streetAddress: [a.streetAddress, a.aptUnit]
                  .filter(Boolean)
                  .join(' '),
              },
              communication_email: storeAddr?.communicationEmail || null,
              // Account Terms card guards on odooCreditLimit/
              // odooPaymentTermName OR credit_limit/payment_terms
              // — pipe the dealer fields into the second pair so the
              // card renders without a JSX change.
              credit_limit: storeAddr?.creditLimit ?? null,
              odooCompanyName: a.addressName || null,
              payment_terms: storeAddr?.paymentTerm || null,
              phoneNumber: a.phoneNo || null,
              // Header: store name (addressName is what the resolver
              // uses for the dealer's store label).
              title: a.addressName || null,
            });
          }
          return;
        }

        const res = await fetchAPI(GET_STORE_BY_USER_ID, {
          variables: { userId },
        });

        const data = res?.getStoreByUserId;

        if (data) {
          // data.storeDetails can come back as null when WP doesn't have a
          // store linked to this dealer. Optional chaining on the array
          // access prevents null[0] from crashing the page.
          let store = { ...(data?.storeDetails?.[0] ?? {}) };

          // now get the store details
          const storeId = store?.store_id;

          const storeData = await fetchAPI(GET_STORE_BY_ID, {
            variables: { id: storeId },
          });

          const storeDetails = storeData?.store;

          const priceList =
            storeDetails?.storesCustomFields?.priceList?.node ?? null;

          store = {
            ...store,
            ...(storeDetails ?? {}),
            ...(storeDetails?.storesCustomFields ?? {}),
            priceList,
          };

          setStoreDetails(store);
        }
      } catch (e) {
        console.error('Error getting orders:', e);
      } finally {
        setLoading(false);
      }
    }

    getStoreDetails();
    // role/token now drive which resolver fires — re-run when they
    // hydrate (was previously a one-shot mount-only fetch).
  }, [user?.role, user?.token]);

  const [showThanks, setShowThanks] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const res = await fetchAPI(REQUEST_DISPLAY_PRICING, {
      authToken: user?.token,
    });

    if (res?.requestDisplayPricing?.success) {
      setLoading(false);
      setShowThanks(true);
      // No auto-dismiss timer — the new Figma confirmation is a full-page
      // takeover with a "Return to Account Details" CTA that clears the
      // showThanks flag, so the user drives the return.
    }
  };

  // Full-page confirmation takeover. Portalled to document.body
  // so it escapes the vertical-tabs container (which is only ~55%
  // of the viewport wide) — otherwise the confirmation renders
  // inside the tab panel and the heading wraps 5 lines. See
  // Figma node 772:24963 — the confirmation is a full-viewport
  // takeover, not a card next to the sidebar.
  if (!loading && showThanks && mounted) {
    return createPortal(
      <div className={styles.demoConfirmation}>
        <div className={styles.demoConfirmationInner}>
          <div className={styles.demoConfirmationHero}>
            <Image alt="" placeholder="blur" priority src={wideShotHero} />
          </div>
          <div className={styles.demoConfirmationPanel}>
            <h2>Your Request Has Been Sent</h2>
            {user?.role === 'dealer' && (
              <p>
                Thank you for your enquiry. A member of our team will be in
                touch shortly for info on display demo vehicle stock.
              </p>
            )}
            {user?.role === 'b2b' && (
              <p>
                Thank you for your enquiry. A member of our team will be in
                touch shortly for pricing info on in-store displays.
              </p>
            )}
            <Button
              className={styles.demoConfirmationBtn}
              onClick={() => setShowThanks(false)}
              size="large"
              variant="primary"
            >
              Return to Account Details
            </Button>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <>
      {loading ? (
        <Loading color="white" size="large" />
      ) : (
        <div className={styles.accountDetails}>
          <h2 className={styles.sectionTitle}>
            {storeDetails?.odooCompanyName || storeDetails?.title}
          </h2>

          {(storeDetails?.storeCategories?.nodes?.length > 0 ||
            storeDetails?.priceList) && (
            <div className={styles.customBtns}>
              {storeDetails.storeCategories.nodes.map((category, index) => (
                <a
                  className={styles.goldButton}
                  href="#"
                  key={index}
                  style={{
                    color: category.storeCategoryCustomFields.color,
                  }}
                >
                  <Image
                    alt={category.name}
                    height={50}
                    src={category.storeCategoryCustomFields.icon.node.sourceUrl}
                    width={50}
                  />
                  {category.name}
                </a>
              ))}
              {storeDetails?.priceList?.mediaItemUrl && (
                <Link
                  className={clsx(styles.goldButton, styles.priceListBtn)}
                  href={storeDetails?.priceList?.mediaItemUrl}
                  target="_blank"
                >
                  <svg
                    fill="none"
                    height="33"
                    viewBox="0 0 32 33"
                    width="32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.54167 32.4583L0 26.9167L5.54167 21.375L7.79792 23.5917L6.05625 25.3333H25.6104L23.9083 23.5917L26.125 21.375L31.6667 26.9167L26.125 32.4583L23.8688 30.2417L25.6104 28.5H6.05625L7.75833 30.2417L5.54167 32.4583ZM15.8333 14.25C14.5139 14.25 13.3924 13.7882 12.4688 12.8646C11.5451 11.941 11.0833 10.8194 11.0833 9.5C11.0833 8.18056 11.5451 7.05903 12.4688 6.13542C13.3924 5.21181 14.5139 4.75 15.8333 4.75C17.1528 4.75 18.2743 5.21181 19.1979 6.13542C20.1215 7.05903 20.5833 8.18056 20.5833 9.5C20.5833 10.8194 20.1215 11.941 19.1979 12.8646C18.2743 13.7882 17.1528 14.25 15.8333 14.25ZM4.75 19C3.87917 19 3.13368 18.6899 2.51354 18.0698C1.8934 17.4497 1.58333 16.7042 1.58333 15.8333V3.16667C1.58333 2.29583 1.8934 1.55035 2.51354 0.930208C3.13368 0.310069 3.87917 0 4.75 0H26.9167C27.7875 0 28.533 0.310069 29.1531 0.930208C29.7733 1.55035 30.0833 2.29583 30.0833 3.16667V15.8333C30.0833 16.7042 29.7733 17.4497 29.1531 18.0698C28.533 18.6899 27.7875 19 26.9167 19H4.75ZM7.91667 15.8333H23.75C23.75 14.9625 24.0601 14.217 24.6802 13.5969C25.3004 12.9767 26.0458 12.6667 26.9167 12.6667V6.33333C26.0458 6.33333 25.3004 6.02326 24.6802 5.40312C24.0601 4.78299 23.75 4.0375 23.75 3.16667H7.91667C7.91667 4.0375 7.6066 4.78299 6.98646 5.40312C6.36632 6.02326 5.62083 6.33333 4.75 6.33333V12.6667C5.62083 12.6667 6.36632 12.9767 6.98646 13.5969C7.6066 14.217 7.91667 14.9625 7.91667 15.8333Z"
                      fill="black"
                    />
                  </svg>
                  Access Platinum Price List Here
                </Link>
              )}
            </div>
          )}

          <div className={clsx(styles.borderBox, styles.mobWhiteBox)}>
            <div className={styles.tableInfo}>
              <h5>Business Details</h5>
              <div className={styles.tableWrapper}>
                <table>
                  <tbody>
                    <tr>
                      <td>Business Address:</td>
                      <td>
                        {storeDetails?.addressFields?.streetAddress},{' '}
                        {storeDetails?.addressFields?.city}{' '}
                        {storeDetails?.addressFields?.state?.[0]}{' '}
                        {storeDetails?.addressFields?.postalCode}
                      </td>
                    </tr>
                    {storeDetails?.communication_email && (
                      <tr>
                        <td>Communications Email:</td>
                        <td>
                          <a href="mailto:info@canopieswa.com.au">
                            {storeDetails?.communication_email}
                          </a>
                        </td>
                      </tr>
                    )}
                    {storeDetails?.account_email && (
                      <tr>
                        <td>Accounts Email:</td>
                        <td>
                          <a href="mailto:accounts@canopieswa.com.au">
                            {storeDetails?.account_email}
                          </a>
                        </td>
                      </tr>
                    )}
                    {storeDetails?.phoneNumber && (
                      <tr>
                        <td>Phone Number:</td>
                        <td>
                          <a href="tel:+1300498432">
                            {storeDetails?.phoneNumber}
                          </a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {(storeDetails?.odooCreditLimit ||
              storeDetails?.odooPaymentTermName ||
              storeDetails?.credit_limit ||
              storeDetails?.payment_terms) && (
              <div className={styles.tableInfo}>
                <h5>Account Terms</h5>
                <div className={styles.tableWrapper}>
                  <table>
                    <tbody>
                      {(storeDetails?.odooCreditLimit ||
                        storeDetails?.credit_limit) && (
                        <tr>
                          <td>Credit Limit:</td>
                          <td>
                            {formatPrice(
                              storeDetails?.odooCreditLimit ??
                                storeDetails?.credit_limit,
                            )}
                          </td>
                        </tr>
                      )}
                      {(storeDetails?.odooPaymentTermName ||
                        storeDetails?.payment_terms) && (
                        <tr>
                          <td>Payment Terms:</td>
                          <td>
                            {storeDetails?.odooPaymentTermName ||
                              storeDetails?.payment_terms}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className={clsx(styles.bottomText, styles.forMobile)}>
            <p>
              To Edit Any Business Information, Please{' '}
              <Link href="/contact-us">Contact Us</Link>
            </p>
          </div>

          {user?.role === 'dealer' && (
            <div className={styles.borderBox}>
              <div className={styles.demoVehicleStock}>
                <h4>Demo Vehicle Stock</h4>
                <div className={styles.btns}>
                  <Button
                    className={styles.requestbutton}
                    onClick={handleClick}
                    size="large"
                    variant="secondary"
                  >
                    Request display demo vehicle stock
                  </Button>
                </div>
              </div>
            </div>
          )}
          {user?.role === 'b2b' && (
            <div className={styles.borderBox}>
              <div className={styles.logosList}>
                {storeDetails?.inStoreDisplays ? (
                  <StoreDisplays
                    alwaysOpen
                    displays={storeDetails?.inStoreDisplays}
                    flexStoresList
                    hideSeparator
                    showNumberOfProducts={false}
                  />
                ) : (
                  <div className={styles.noDisplays}>
                    <h4>In-Store Displays</h4>
                    <p>
                      Currently, there are no in-store displays at your location
                      — take advantage of this opportunity to drive more
                      attention and increase sales by ordering one today!
                    </p>
                    <p>
                      Already have a display? Let us know so we can update our
                      records. <Link href="/contact-us">Contact Us</Link>
                    </p>
                  </div>
                )}
                <div className={styles.btns}>
                  <Button
                    className={styles.requestbutton}
                    onClick={handleClick}
                    size="large"
                    variant="secondary"
                  >
                    Request Display Pricing
                  </Button>
                </div>
                {showThanks && (
                  <div className={styles.thankYouMsg}>
                    <h4>
                      {/* <ThanksIcon /> */}
                      Your Pricing Request Has Been Sent
                    </h4>
                    <p>
                      Thank you for your enquiry. A member of our team will be
                      in touch shortly for pricing info on in-store displays.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={clsx(styles.bottomText, styles.forDesktop)}>
            <p>
              To Edit Any Business Information, Please{' '}
              <Link href="/contact-us">Contact Us</Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default AccountDetails;
