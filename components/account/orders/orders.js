'use client';

import React, { useEffect, useState } from 'react';

import { fetchAPI } from '@lib/fetch-api';
import { formatPrice } from '@lib/helpers';

import Loading from '@components/loading/loading';
import Tabs from '@components/tabs/tabs';

import styles from './orders.module.scss';

const GET_ORDERS = `
    query GetOrdersByUser($userId: Int!) {
        userOrders(userId: $userId) {
            success
            message
            orders {
                order_id
                status
                order_total
                order_date
                payment
                total_items
                total_quantity
                order_type
                selected_store
                purchase_order_number
                items {
                    name
                    quantity
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

function Order({ item }) {
  console.log('order', item);

  const orderTypes = {
    'click-collect': 'Click & Collect',
    'deliver-door': 'Deliver to Door',
    'drop-shipping': 'Drop Shipping',
    'local-installation': 'Local Installation',
    'pickup-from-hsp': 'Pickup from HSP',
    'standard-delivery': 'Standard Delivery',
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

  return (
    <div className={styles.orderBox}>
      <div className={styles.orderWrap}>
        <div className={styles.heading}>
          <div className={styles.left}>
            <h5>Order #{item.order_id}</h5>
            <h6>
              {item.total_items} Products | {item.order_date}
            </h6>
          </div>
          {/* <div className={styles.right}>
                        <button className={styles.statusButton}>
                            Awaiting Collection
                        </button>
                    </div> */}
        </div>
        <div className={styles.orderBody}>
          <div className={styles.productInfo}>
            <div className={styles.orderRow}>
              <div className={styles.title}>Order Total:</div>
              <div className={styles.desc}>
                {/* <del>RRP {formatPrice(item.order_total)}</del> */}
                <strong>RRP {formatPrice(item.order_total)}</strong>
              </div>
            </div>
            <div className={styles.orderRow}>
              <div className={styles.title}>Fulfillment Method:</div>
              <div className={styles.desc}>{orderTypes[item.order_type]}</div>
            </div>
            {item.selected_store && (
              <div className={styles.orderRow}>
                <div className={styles.title}>Collection Address:</div>
                <div className={styles.desc}>{item.selected_store}</div>
              </div>
            )}
            <div className={styles.orderRow}>
              <div className={styles.title}>Purchase Order Number:</div>
              <div className={styles.desc}>{item.purchase_order_number}</div>
            </div>
          </div>
          <div className={styles.orderBottom}>
            <button className={styles.button} onClick={handleDownloadInvoice}>
              Download Invoice
            </button>
            <a className={styles.outlineButton} href="#">
              See Products
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const [loading, setLoading] = useState(true);
  const [allorders, setAllOrders] = useState([]);
  const [outstandingOrders, setOutstandingOrders] = useState([]);

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
          setOutstandingOrders(
            data.orders.filter(item => item.status === 'Awaiting Collection'),
          );
        }
      } catch (e) {
        console.error('Error getting orders:', e);
      } finally {
        setLoading(false);
      }
    }

    getAllOrders();
  }, []);

  return (
    <div className={styles.orders}>
      {loading ? (
        <Loading color="white" size="large" />
      ) : (
        <Tabs
          tabs={[
            {
              content: outstandingOrders.map(item => (
                <Order item={item} key={item.order_id} />
              )),
              slug: 'outstandingorders',
              title: 'Outstanding Orders',
            },
            {
              content: allorders.map(item => (
                <Order item={item} key={item.order_id} />
              )),
              slug: 'allorders',
              title: 'All Orders',
            },
            {
              content: allorders.map(item => (
                <Order item={item} key={item.order_id} />
              )),
              slug: 'referrals',
              title: 'Referrals',
            },
          ]}
          type="horizontal"
        />
      )}
    </div>
  );
}
export default Orders;
