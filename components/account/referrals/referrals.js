'use client';

import React, { useEffect, useState } from 'react';

import { clsx } from 'clsx';
import Image from 'next/image';

import { useUserContext } from '@contexts/user';

import { fetchAPI } from '@lib/fetch-api';
import { formatPrice } from '@lib/helpers';

import Loading from '@components/loading/loading';
import Tabs from '@components/tabs/tabs';

import CheckLargeIcon from '@assets/icons/checklargeicon.svg';
import ErrorIcon from '@assets/icons/error-icon.svg';

import styles from './referrals.module.scss';

const GET_REFERRALS = `
  query GetStoreEntries($limit: Int) {
    storeEntries(limit: $limit) {
      id
      gformID
      firstName
      lastName
      email
      phone
      products
      optionType
      totalAmount
      storeName
      marksAsContact
      updateIsWon
      createdAt

      variants {
        productId
        productName
        variantName
        variantSlug
        sku
        price
        installation
        freight
        gallery {
          id
          url
        }
      }
    }
  }
`;

const MarkAsContact = `
  mutation MarkAsContact($id: Int!, $value: Int!) {
    markAsContact(input: {
      id: $id
      value: $value
    }) {
      id
      markAsContact
      success
    }
  }
`;

const UpdateIsWon = `
  mutation UpdateIsWon($id: Int!, $value: Int!) {
    updateIsWon(input: {
      id: $id
      value: $value
    }) {
      id
      isWon
      success
    }
  }
`;

const GENERATE_ORDER_PDF = `
  mutation GenerateOrderPDF($orderId: Int!) {
    generateOrderPDF(input: { orderId: $orderId }) {
      success
      message
      pdfUrl
      debug
    }
  }
`;

function Order({ item, onStatusChange }) {
  const [showProducts, setShowProducts] = useState(false);
  const { user } = useUserContext();
  const total = item?.variants.reduce(
    (acc, curr) => acc + (curr.price + curr.installation + curr.freight),
    0,
  );

  const [customerContacted, setCustomerContacted] = useState(
    item?.marksAsContact,
  );

  async function handleDownloadInvoice() {
    try {
      const res = await fetchAPI(GENERATE_ORDER_PDF, {
        variables: { orderId: item.order_id },
      });

      const pdf = res?.generateOrderPDF;

      if (pdf?.success && pdf.pdfUrl) {
        window.open(pdf.pdfUrl, '_blank');
      } else {
        console.error('PDF generation failed:', pdf?.message);
      }
    } catch (err) {
      console.error('Error downloading invoice:', err);
    }
  }

  async function handleContact(id, value) {
    try {
      const res = await fetchAPI(MarkAsContact, {
        authToken: user?.token,
        variables: { id, value },
      });

      if (res?.markAsContact?.success) {
        setCustomerContacted(value);
      }
    } catch (err) {
      console.error('Error downloading invoice:', err);
    }
  }

  async function handleUpdateIsWon(id, value) {
    try {
      const res = await fetchAPI(UpdateIsWon, {
        authToken: user?.token,
        variables: { id, value },
      });

      onStatusChange(res?.updateIsWon?.id, res?.updateIsWon?.isWon);
    } catch (err) {
      console.error('Error downloading invoice:', err);
    }
  }

  return (
    <div className={clsx(styles.orderBox)}>
      <div className={styles.orderWrap}>
        <div className={styles.heading}>
          <div className={styles.left}>
            <h5>Referral #{item.gformID}</h5>
            <h6>
              {item?.variants?.length} Products | {item.createdAt}
            </h6>
          </div>
          <div className={styles.right}>
            {item?.updateIsWon === 1 && (
              <div>
                <div className={styles.greenCheck}>
                  <CheckLargeIcon />
                </div>
              </div>
            )}
            {item?.updateIsWon === 0 && (
              <div>
                <div className={styles.redCross}>
                  <ErrorIcon />
                </div>
              </div>
            )}
            {item?.updateIsWon === null &&
              (customerContacted ? (
                <>
                  <div>
                    <button className={styles.confirmButton}>
                      Customer Contacted
                      <svg
                        fill="none"
                        height="32"
                        viewBox="0 0 32 32"
                        width="32"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect fill="white" height="32" rx="16" width="32" />
                        <path
                          d="M24 10L13 21L8 16"
                          stroke="#319F18"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <div className={styles.wonORloss}>
                      <button
                        className={styles.wonBtn}
                        onClick={() => handleUpdateIsWon(item.id, 1)}
                      >
                        Won <CheckLargeIcon />
                      </button>
                      <button
                        className={styles.lostBtn}
                        onClick={() => handleUpdateIsWon(item.id, 0)}
                      >
                        Lost <ErrorIcon />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <button
                    className={styles.statusButton}
                    onClick={() => handleContact(item.id, 1)}
                  >
                    Mark as Contacted
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className={styles.orderBody}>
          <div className={styles.productInfo}>
            <div className={styles.orderRow}>
              <div className={styles.title}>Order Total:</div>
              <div className={styles.desc}>
                <strong>RRP {formatPrice(total)}</strong>
              </div>
            </div>
            <div className={styles.orderRow}>
              <div className={styles.title}>Fulfillment Method:</div>
              <div className={styles.desc}>
                {item.optionType === 'install' && 'Installation'}
                {item.optionType === 'pickup' && 'Pickup from HSP'}
              </div>
            </div>
            {item.selected_store && (
              <div className={styles.orderRow}>
                <div className={styles.title}>Collection Address:</div>
                <div className={styles.desc}>{item.selected_store}</div>
              </div>
            )}
            <div className={styles.orderRow}>
              <div className={styles.title}>Customer Info:</div>
              <div className={styles.desc}>
                {item.firstName} {item.lastName}
              </div>
            </div>
          </div>
          <div className={styles.orderBottom}>
            <button className={styles.button} onClick={handleDownloadInvoice}>
              Download Invoice
            </button>
            <button
              className={styles.outlineButton}
              onClick={() => setShowProducts(!showProducts)}
            >
              See Products
            </button>
          </div>
          {showProducts && (
            <div className={styles.recentLists}>
              {item.variants.map((item, index) => (
                <div className={styles.productBox} key={index}>
                  <figure>
                    <Image
                      alt="product"
                      height={93}
                      src={item?.gallery?.[0]?.url}
                      width={100}
                    />
                  </figure>
                  <div className={styles.info}>
                    <div className={styles.desc}>
                      <div className={styles.left}>
                        <h6>{item.productName}</h6>
                        <p>SKU: {item.sku}</p>
                      </div>
                      <div className={styles.right}>
                        <div className={styles.sNo}>
                          <p>
                            <strong>{formatPrice(item.price)}</strong>
                          </p>
                          {item.installation > 0 && (
                            <h5>+ {item.installation} Fitting</h5>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const CheckNoOrders = ({ children, onStatusChange, orders }) => {
  return orders.length == 0 ? (
    <div className={styles.noOrders}>{children}</div>
  ) : (
    orders.map(item => (
      <Order item={item} key={item.order_id} onStatusChange={onStatusChange} />
    ))
  );
};

function Orders() {
  const [loading, setLoading] = useState(true);
  const [allReferrals, setAllReferrals] = useState([]);

  const { user } = useUserContext();

  useEffect(() => {
    async function getAllReferrals() {
      if (!user?.token) return;

      try {
        const res = await fetchAPI(GET_REFERRALS, {
          authToken: user?.token,
          variables: { limit: 100 },
        });

        const data = res?.storeEntries;

        setAllReferrals(data);
      } catch (e) {
        console.error('Error getting orders:', e);
      } finally {
        setLoading(false);
      }
    }

    getAllReferrals();
  }, [user?.token]);

  function updateReferralStatus(id, value) {
    setAllReferrals(prev =>
      prev.map(item =>
        item.id === id ? { ...item, updateIsWon: value } : item,
      ),
    );
  }

  return (
    <div className={styles.orders}>
      {loading ? (
        <Loading color="white" size="large" />
      ) : (
        <Tabs
          tabs={[
            {
              content: (
                <CheckNoOrders
                  onStatusChange={updateReferralStatus}
                  orders={allReferrals.filter(
                    order => order.updateIsWon === null,
                  )}
                >
                  <h3>
                    Looks like you haven&apos;t received any referrals yet
                  </h3>
                  <p>Please check back later to see any new referrals</p>
                </CheckNoOrders>
              ),
              slug: 'requiringaction',
              title: 'Requiring Action',
            },
            {
              content: (
                <CheckNoOrders
                  onStatusChange={updateReferralStatus}
                  orders={allReferrals.filter(order => order.updateIsWon === 1)}
                >
                  <h3>
                    Looks like you haven&apos;t received any referrals yet
                  </h3>
                  <p>Please check back later to see any new referrals</p>
                </CheckNoOrders>
              ),
              slug: 'won',
              title: 'Won',
            },
            {
              content: (
                <CheckNoOrders
                  onStatusChange={updateReferralStatus}
                  orders={allReferrals.filter(order => order.updateIsWon === 0)}
                >
                  <h3>
                    Looks like you haven&apos;t received any referrals yet
                  </h3>
                  <p>Please check back later to see any new referrals</p>
                </CheckNoOrders>
              ),
              slug: 'lost',
              title: 'Lost',
            },
          ]}
          type="horizontal"
        />
      )}
    </div>
  );
}
export default Orders;
