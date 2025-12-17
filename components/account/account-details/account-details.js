'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { fetchAPI } from '@lib/fetch-api';
import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';
import Loading from '@components/loading/loading';
import StoreDisplays from '@components/store-displays/store-displays';

import ThanksIcon from '@assets/icons/checklargeicon.svg';

import styles from './account-details.module.scss';

const GET_STORE_BY_ID = `
query GetStoreById($id: ID!) {
  store(id: $id, idType: DATABASE_ID)  {
    id
    title
    storesCustomFields {
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

function AccountDetails() {
  const [loading, setLoading] = useState(true);
  const [storeDetails, setStoreDetails] = useState({});

  useEffect(() => {
    async function getStoreDetails() {
      const userId = parseInt(localStorage.getItem('userId'));
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetchAPI(GET_STORE_BY_USER_ID, {
          variables: { userId },
        });

        const data = res?.getStoreByUserId;

        if (data) {
          let store = { ...data?.storeDetails[0] };

          // now get the store details
          const storeId = store?.store_id;

          const storeData = await fetchAPI(GET_STORE_BY_ID, {
            variables: { id: storeId },
          });

          const storeDetails = storeData?.store;
          storeDetails.storeCategories.nodes[0];

          store = {
            ...store,
            ...storeDetails,
            ...storeDetails.storesCustomFields,
          };

          console.log('my store details', store);
          setStoreDetails(store);
        }
      } catch (e) {
        console.error('Error getting orders:', e);
      } finally {
        setLoading(false);
      }
    }

    getStoreDetails();
  }, []);

  const [showThanks, setShowThanks] = useState(false);

  return (
    <>
      {loading ? (
        <Loading color="white" size="large" />
      ) : (
        <div className={styles.accountDetails}>
          <h2 className={styles.sectionTitle}>{storeDetails?.title}</h2>

          <div className={styles.customBtns}>
            {storeDetails.storeCategories.nodes.map((category, index) => (
              <a className={styles.goldButton} href="#" key={index}>
                <Image
                  alt={category.name}
                  height={50}
                  src={category.storeCategoryCustomFields.icon.node.sourceUrl}
                  width={50}
                />
                {category.name}
              </a>
            ))}
          </div>

          <div className={styles.borderBox}>
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
                        {storeDetails?.addressFields?.state[0]}{' '}
                        {storeDetails?.addressFields?.postalCode}
                      </td>
                    </tr>
                    <tr>
                      <td>Communications Email:</td>
                      <td>
                        <a href="mailto:info@canopieswa.com.au">
                          {storeDetails?.communication_email}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>Accounts Email:</td>
                      <td>
                        <a href="mailto:accounts@canopieswa.com.au">
                          {storeDetails?.account_email}
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>Phone Number:</td>
                      <td>
                        <a href="tel:+1300498432">
                          {storeDetails?.phoneNumber}
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.tableInfo}>
              <h5>Account Terms</h5>
              <div className={styles.tableWrapper}>
                <table>
                  <tbody>
                    <tr>
                      <td>Credit Limit:</td>
                      <td>{formatPrice(storeDetails?.credit_limit)}</td>
                    </tr>
                    <tr>
                      <td>Payment Terms:</td>
                      <td>{storeDetails?.payment_terms}</td>
                    </tr>
                  </tbody>
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
              <StoreDisplays
                alwaysOpen
                displays={storeDetails?.inStoreDisplays}
                hideSeparator
              />
              <div className={styles.btns}>
                <Button
                  className={styles.requestbutton}
                  onClick={() => setShowThanks(true)}
                  size="large"
                  variant="secondary"
                >
                  Request Display Pricing
                </Button>
              </div>
              {showThanks && (
                <div className={styles.thankYouMsg}>
                  <h4>
                    <ThanksIcon />
                    Thank You for being a valued HSP Reseller!
                  </h4>
                  <p>
                    Thank you for your enquiry. A member of our team will be in
                    touch shortly for pricing info on in-store displays.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.bottomText}>
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
