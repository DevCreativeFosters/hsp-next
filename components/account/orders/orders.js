'use client';

import React, { useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { fetchAPI } from '@lib/fetch-api';
import { formatPrice } from '@lib/helpers';

import Accordion from '@components/accordion/accordion';
import AccordionItem from '@components/accordion/accordion-item';
import Loading from '@components/loading/loading';
import Tabs from '@components/tabs/tabs';

import AccessImg from '@assets/images/productimg.png';

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
          <div className={styles.right}>
            {/* <div>
                <button className={styles.statusButton}>
                    Awaiting Collection
                </button>
              </div> */}

            {/* <div>
                <div className={styles.lblIcon}>
                  <label>Store Placed Order</label>
                  <TruckIcon />
                </div>
              </div> */}

            {/* <div>
                <button className={styles.greyButton}>
                    In Transit
                </button>
              </div> */}

            {/* <div>
                <div className={styles.lblIcon}>
                  <label>Click & Collect Order</label>
                  <MapPinIcon />
                </div>
              </div> */}

            {/* <div>
                <button className={styles.greyButton}>
                    Awaiting Collection
                </button>
              </div> */}

            {/* <div>
                <div className={styles.lblIcon}>
                  <label>Local Install Order</label>
                  <SettingIcon />
                </div>
              </div> */}

            {/* <div>
                <button className={styles.greyButton}>
                    Fitting Pending
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

            <div>
              <button className={styles.confirmButton}>Completed</button>
            </div>

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

            {/* <div>
                <button className={styles.outlineButton} href="#">
                <InfoIcon />Requires Changes
                </button>
              </div> */}
          </div>
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
          <div className={styles.recentLists}>
            <div className={styles.productBox}>
              <figure>
                <Image
                  alt={'HSP Logo'}
                  height={93}
                  src={AccessImg}
                  width={100}
                />
              </figure>
              <div className={styles.info}>
                <div className={styles.desc}>
                  <div className={styles.left}>
                    <h6>
                      Electric Roller Cover for Next Gen Ranger Raptor for No
                      Sports bar
                    </h6>
                    <p>SKU: NGR4RS3.5</p>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.sNo}>
                      <p>
                        <strong>$3300</strong>
                      </p>
                      <h5>+ 450 Fitting</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.productBox}>
              <figure>
                <Image
                  alt={'HSP Logo'}
                  height={93}
                  src={AccessImg}
                  width={100}
                />
              </figure>
              <div className={styles.info}>
                <div className={styles.desc}>
                  <div className={styles.left}>
                    <h6>
                      Electric Roller Cover for Next Gen Ranger Raptor for No
                      Sports bar
                    </h6>
                    <p>SKU: NGR4RS3.5</p>
                  </div>
                  <div className={styles.right}>
                    <div className={styles.sNo}>
                      <p>
                        <strong>$3300</strong>
                      </p>
                      <h5>+ 450 Fitting</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            {
              content: (
                <Accordion
                  allowMultipleOpen
                  className={clsx(
                    styles.productAccordion,
                    styles.hideOnDesktop,
                  )}
                  stickyOnMobile
                >
                  {/* Static Description Tab */}
                  <AccordionItem
                    className={styles.accordionItem}
                    triggerContent="How much space is there between the side rails of our Roll R Cover?"
                  >
                    <p>
                      This is the static content for the product description
                      tab.
                    </p>
                    <p>
                      It no longer relies on the {'<Description />'} component.
                    </p>
                  </AccordionItem>

                  {/* Static Features Tab */}
                  <AccordionItem
                    className={styles.accordionItem}
                    triggerContent="How is the Electric Roller Cover Canister Made?"
                  >
                    <ul>
                      <li>Static Feature 1</li>
                      <li>Static Feature 2</li>
                      <li>Static Feature 3</li>
                    </ul>
                  </AccordionItem>

                  {/* Static Specs Tab */}
                  <AccordionItem
                    className={styles.accordionItem}
                    triggerContent="Is the Ute Roller Cover waterproof or dustproof?"
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>Attribute</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Weight</td>
                          <td>5 kg</td>
                        </tr>
                        <tr>
                          <td>Color</td>
                          <td>Black</td>
                        </tr>
                      </tbody>
                    </table>
                  </AccordionItem>

                  {/* Static Manuals Tab */}
                  <AccordionItem
                    className={styles.accordionItem}
                    triggerContent="How much space will i have underneath the roll top when its closed?"
                  >
                    <p>
                      Download the user manual <a href="#">here</a>.
                    </p>
                  </AccordionItem>

                  {/* Static Manuals Tab */}
                  <AccordionItem
                    className={styles.accordionItem}
                    triggerContent="How much does the Roll R Cover weigh?"
                  >
                    <p>
                      Download the user manual <a href="#">here</a>.
                    </p>
                  </AccordionItem>

                  {/* Static Manuals Tab */}
                  <AccordionItem
                    className={styles.accordionItem}
                    triggerContent="How much weight can you put on the Roll R Cover itself?"
                  >
                    <p>
                      Download the user manual <a href="#">here</a>.
                    </p>
                  </AccordionItem>
                </Accordion>
              ),
              slug: 'faqs',
              title: 'FAQs',
            },
          ]}
          type="horizontal"
        />
      )}
    </div>
  );
}
export default Orders;
