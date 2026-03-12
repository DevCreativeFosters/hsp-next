'use client';

import React, { useEffect, useState } from 'react';

import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useUserContext } from '@contexts/user';

import { fetchAPI } from '@lib/fetch-api';
import { formatPrice } from '@lib/helpers';

import Button from '@components/button/button';
import Loading from '@components/loading/loading';
import Tabs from '@components/tabs/tabs';

import MapPinIcon from '@assets/icons/mappin-small.svg';
import SettingIcon from '@assets/icons/setting-small-icon.svg';
import TruckIcon from '@assets/icons/truck-small.svg';

import styles from './orders.module.scss';

const GET_ORDERS = `
  query GetOrdersByUser($userId: Int!) {
    userOrders(userId: $userId) {
      success
      message
      orders {
        order_id
        status
        statusColor
        order_total
        order_date
        payment
        total_items
        total_quantity
        order_type
        selected_store
        store_name
        purchase_order_number
        approve_for_return

        items {
          name
          quantity
          unit_price
          price
          installation
          freight
          total
          image
        }
      }
    }
  }
`;

const OUT_ORDERS = `
  mutation fetchOutstandingOrders($userId: Int!) {
    fetchOutstandingOrders(input: { userId: $userId }) {
      success
      message
      orders {
        order_id
        order_date
        status
        statusColor
        installation
        freight
        gst
        order_total
        payment
        total_items
        total_quantity
        order_type
        selected_store
        store_name
        purchase_order_number
        selected_store_user_id
        selected_store_user_name
        items {
          name
          quantity
          price
          total
          image
        }
      }
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

const UPDATE_ORDER_STATUS = `
  mutation UpdateOrderStatus($orderId: Int!, $status: String!) {
    updateOrderStatus(
      input: {
        orderId: $orderId
        status: $status
      }
    ) {
      success
      message
      orderId
      status
    }
  }
`;

const renderButton = (status, statusColor) => {
  return (
    <div>
      <button
        className={styles.customStatusButton}
        style={{
          backgroundColor: statusColor,
        }}
      >
        {status.replace('-', ' ')}
      </button>
    </div>
  );
};

function Order({
  item,
  onlyReturns = false,
  received = false,
  returnRequest = false,
}) {
  const { user } = useUserContext();
  const role = user?.role;

  const router = useRouter();

  const [showProducts, setShowProducts] = useState(onlyReturns);

  const orderTypes = {
    'click-collect': 'Click & Collect',
    'deliver-door': 'Deliver to Door',
    'deliver-to-store': 'Deliver to Store',
    'drop-ship-to-customer': 'Drop Ship to Customer',
    'local-installation': 'Local Installation',
    'pickup-from-hsp': `Pickup From ${item?.store_name}`,
  };

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

  async function handleUpdateStatus(status) {
    try {
      const res = await fetchAPI(UPDATE_ORDER_STATUS, {
        variables: { orderId: item.order_id, status },
      });

      if (res?.updateOrderStatus?.success) {
        router.push('/account/retail#support');
      }
    } catch (err) {
      console.error('Error downloading invoice:', err);
    }
  }

  return (
    <div
      className={clsx(styles.orderBox, { [styles.onlyReturns]: onlyReturns })}
    >
      <div className={styles.orderWrap}>
        <div className={styles.heading}>
          <div className={styles.left}>
            <h5>Order #{item.order_id}</h5>
            <h6>
              {item.total_items} Products | {item.order_date}
            </h6>
          </div>
          <div className={styles.right}>
            {(() => {
              if (returnRequest) {
                return (
                  <Button
                    onClick={() => handleUpdateStatus('wc-refund-initiated')}
                    size="large"
                    variant="secondary"
                  >
                    Initiate Return
                  </Button>
                );
              }

              if (item.status === 'completed') {
                return (
                  <div>
                    <button className={styles.confirmButton}>Completed</button>
                  </div>
                );
              }

              if (onlyReturns) {
                return (
                  <Button size="large" variant="secondary">
                    {item.status.replace('-', ' ')}
                  </Button>
                );
              }

              const orderTypeConfig = {
                'click-collect': {
                  Icon: MapPinIcon,
                  label: 'Click & Collect Order',
                },
                'deliver-door': {
                  Icon: TruckIcon,
                  label: 'Store Placed Order',
                },
                'local-installation': {
                  Icon: SettingIcon,
                  label: 'Local Install Order',
                },
              };

              const orderType = orderTypeConfig[item.order_type];

              return (
                <>
                  {role === 'b2b' && orderType && (
                    <div>
                      <div className={styles.lblIcon}>
                        <label>{orderType.label}</label>
                        <orderType.Icon />
                      </div>
                    </div>
                  )}
                  {renderButton(item.status, item.statusColor)}
                </>
              );

              // switch (role) {
              // case 'retail':
              //   switch (item.order_type) {
              //     case 'click-collect':
              //       return (
              //         <div>
              //           <button className={styles.greyButton}>
              //             Awaiting Collection
              //           </button>
              //         </div>
              //       );
              //     case 'deliver-door':
              //       return (
              //         <div>
              //           <button className={styles.greyButton}>
              //             In Transit
              //           </button>
              //         </div>
              //       );
              //     case 'local-installation':
              //       return (
              //         <div>
              //           <button className={styles.greyButton}>
              //             Fitting Pending
              //           </button>
              //         </div>
              //       );
              //   }
              //   break;
              // case 'b2b':
              //   switch (item.order_type) {
              //     case 'deliver-to-store':
              //       return (
              //         <Button size="large" variant="secondary">
              //           <InfoIcon />
              //           Requires Changes
              //         </Button>
              //       );
              //     case 'pickup-from-hsp':
              //       return (
              //         <Button size="large" variant="secondary">
              //           <InfoIcon />
              //           Requires Changes
              //         </Button>
              //       );
              //     case 'drop-ship-to-customer':
              //       return (
              //         <Button size="large" variant="secondary">
              //           <InfoIcon />
              //           Requires Changes
              //         </Button>
              //       );
              //   }
              //   break;
              // }
            })()}
            {/* <div>
                <button className={styles.statusButton}>
                    Awaiting Collection
                </button>
              </div> */}

            {/* <div>
                <button className={styles.statusButton}>
                    Mark Fitting as Competed
                    <CheckLargeIcon />
                </button>
              </div> */}

            {/* <div>
                <div className={styles.greenCheck}>
                    <CheckLargeIcon />
                </div>
              </div> */}

            {/* <div>
                <div className={styles.redCross}>
                    <ErrorIcon />
                </div>
              </div> */}

            {/* <div>
                <button className={styles.confirmButton}>
                    Awaiting Collection 
                    <CheckIcon />
                </button>
              </div> */}

            {/* <div>
                <div className={styles.wonORloss}>
                  <button className={styles.wonBtn}>
                    Won <CheckLargeIcon />
                  </button>
                  <button className={styles.lostBtn}>
                    Lost <ErrorIcon />
                  </button>
                </div>
              </div>   */}
          </div>
        </div>
        <div className={styles.orderBody}>
          <div className={styles.productInfo}>
            <div className={styles.orderRow}>
              <div className={styles.title}>Order Total:</div>
              <div className={styles.desc}>
                {/* <del>RRP {formatPrice(item.order_total)}</del> */}
                {role === 'retail' ? (
                  formatPrice(item.order_total)
                ) : (
                  <strong>RRP {formatPrice(item.order_total)}</strong>
                )}
              </div>
            </div>
            <div className={styles.orderRow}>
              <div className={styles.title}>Fulfillment Method:</div>
              <div className={styles.desc}>
                {received
                  ? item.order_type === 'local-installation'
                    ? 'On-Site Fitting'
                    : `Pickup From ${item?.store_name}`
                  : orderTypes[item.order_type]}
              </div>
            </div>
            {item.selected_store && (
              <div className={styles.orderRow}>
                <div className={styles.title}>Collection Address:</div>
                <div className={styles.desc}>{item.selected_store}</div>
              </div>
            )}
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
              {item.items.map((item, index) => (
                <div className={styles.productBox} key={index}>
                  <figure>
                    <Image
                      alt="product"
                      height={93}
                      src={item.image}
                      width={100}
                    />
                  </figure>
                  <div className={styles.info}>
                    <div className={styles.desc}>
                      <div className={styles.left}>
                        <h6>{item.name.split(' - ')[0]}</h6>
                        <p>SKU: {item.name.split(' - ')[1]}</p>
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

const CheckNoOrders = ({
  children,
  onlyReturns = false,
  orders,
  received = false,
  returnRequest = false,
}) => {
  return orders.length == 0 ? (
    <div className={styles.noOrders}>{children}</div>
  ) : (
    orders.map(item => (
      <Order
        item={item}
        key={item.order_id}
        onlyReturns={onlyReturns}
        received={received}
        returnRequest={returnRequest}
      />
    ))
  );
};

function Orders({ onlyReturns = false, returnRequest = false }) {
  const { user } = useUserContext();
  const role = user?.role;

  const [loading, setLoading] = useState(true);
  const [allorders, setAllOrders] = useState([]);

  const [outOrders, setOutOrders] = useState([]);

  useEffect(() => {
    async function getAllOrders() {
      const userId = parseInt(localStorage.getItem('userId'));
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetchAPI(GET_ORDERS, { variables: { userId } });

        const data = res?.userOrders;

        if (data?.success) {
          setAllOrders(data.orders);
        }
      } catch (e) {
        console.error('Error getting orders:', e);
      } finally {
        setLoading(false);
      }
    }

    getAllOrders();
  }, []);

  useEffect(() => {
    async function getOutAllOrders() {
      const userId = parseInt(localStorage.getItem('userId'));
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetchAPI(OUT_ORDERS, { variables: { userId } });

        const data = res?.fetchOutstandingOrders;

        if (data?.success) {
          setOutOrders(data.orders);
        }
      } catch (e) {
        console.error('Error getting orders:', e);
      } finally {
        setLoading(false);
      }
    }

    getOutAllOrders();
  }, []);

  const currentOrders = allorders.filter(o => o.status !== 'completed');
  const completedOrders = allorders.filter(o => o.status === 'completed');
  const returnedOrders = allorders.filter(
    o =>
      o.status === 'refunded' ||
      o.status === 'refund-initiated' ||
      o.status === 'return-in-progress',
  );

  const retailTabs = [
    {
      content: (
        <CheckNoOrders orders={currentOrders}>
          <h3>Looks like you haven&apos;t placed an order yet</h3>
          <p>
            Get your next ute upgrade here:{' '}
            <Link href="/shop-by-ute-make">browse products</Link>
          </p>
        </CheckNoOrders>
      ),
      slug: 'current',
      title: 'Current',
    },
    {
      content: (
        <CheckNoOrders orders={completedOrders}>
          <h3>Looks like you haven&apos;t placed an order yet</h3>
          <p>
            Get your next ute upgrade here:{' '}
            <Link href="/shop-by-ute-make">browse products</Link>
          </p>
        </CheckNoOrders>
      ),
      slug: 'completed',
      title: 'Completed',
    },
    {
      content: (
        <CheckNoOrders orders={allorders}>
          <h3>Looks like you haven&apos;t placed an order yet</h3>
          <p>
            Get your next ute upgrade here:{' '}
            <Link href="/shop-by-ute-make">browse products</Link>
          </p>
        </CheckNoOrders>
      ),
      slug: 'allorders',
      title: 'All Orders',
    },
  ];

  const b2bTabs = [
    {
      content: (
        <CheckNoOrders orders={outOrders} received={true}>
          <h3>Looks like didn&apos;t receive an order yet</h3>
        </CheckNoOrders>
      ),
      slug: 'outstandingordersreceived',
      title: 'Outstanding Orders Received',
    },
    {
      content: (
        <CheckNoOrders orders={allorders}>
          <h3>Looks like you haven&apos;t placed an order yet</h3>
          <p>
            <Link href="/shop-by-ute-make">browse products</Link>
          </p>
        </CheckNoOrders>
      ),
      slug: 'outstandingordersplaced',
      title: 'Outstanding Orders Placed',
    },
  ];

  let content;

  if (loading) {
    content = <Loading color="white" size="large" />;
  } else if (onlyReturns) {
    content = (
      <CheckNoOrders onlyReturns={onlyReturns} orders={returnedOrders}>
        <h3>It looks like you don&apos;t have any returns at this time</h3>
        <p>
          To initiate a return, please{' '}
          <Link href="/contact-us">contact us</Link>
        </p>
      </CheckNoOrders>
    );
  } else if (returnRequest) {
    content = (
      <CheckNoOrders
        orders={completedOrders.filter(o => o.approve_for_return)}
        returnRequest={returnRequest}
      >
        <h3>Looks like you haven&apos;t placed an order yet</h3>
        <p>
          <Link href="/shop-by-ute-make">browse products</Link>
        </p>
      </CheckNoOrders>
    );
  } else {
    content = (
      <Tabs tabs={role === 'retail' ? retailTabs : b2bTabs} type="horizontal" />
    );
  }

  return <div className={styles.orders}>{content}</div>;
}
export default Orders;
