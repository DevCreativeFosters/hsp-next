import Image from 'next/image';

import { fetchAPI } from '@lib/fetch-api';

import Container from '@components/container/container';
import CreateAccountCta from '@components/download-invoice/create-account-cta';
import DownloadInvoiceButton from '@components/download-invoice/download-invoice';
import Layout from '@components/layout/layout';

import OrderImg from '@assets/images/WideSHotExt1.png';

import styles from './order.module.scss';

const ORDER_STATUS_MUTATION = `
  mutation checkOrderStatus($orderId: Int!) {
    checkOrderStatusData(input: { orderId: $orderId }) {
      success
      message
      orderData {
        order_id
        order_date
        status
        installation
        freight
        gst
        order_total
        order_type
        payment
        payment_term_name
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

async function page({ params }) {
  const { orderId } = params;

  // checkOrderStatusData on WP can throw immediately after order creation
  // (race with WP indexing or a debug-display HTML preamble polluting the
  // GraphQL JSON). If we let fetchAPI throw, the entire page becomes a
  // client-side exception and the dealer thinks the order failed even
  // though it succeeded. Render a fallback confirmation instead.
  let data = null;
  try {
    data = await fetchAPI(ORDER_STATUS_MUTATION, {
      variables: { orderId: parseInt(orderId) },
    });
  } catch (err) {
    console.error(
      'Order-status fetch failed for orderId',
      orderId,
      err?.message,
    );
  }

  const orderTypes = {
    'click-collect': `Thanks, We'll let you know when your order is ready to collect.`,
    'deliver-door': `Thanks, You'll get an order confirmation email and a tracking number once your order is ready.`,
    'deliver-to-store': `Thanks for your order. We'll be in touch shortly to book a fitting time.`,
    'drop-shipping-to-customer': `We'll send the items directly to your customer and update you once the shipment has been sent.`,
    'local-installation': `Thanks, We'll get in touch with you to book a fitting time.`,
    'pickup-from-hsp': `The HSP team will contact you when your order is ready for collection from HSP HQ.`,
  };

  return (
    <Layout title="Order Status | HSP">
      <Container>
        <section className={styles.orderStatus}>
          <figure>
            <Image alt={'HSP Logo'} height={282} src={OrderImg} width={1133} />
          </figure>
          <div className={styles.orderContent}>
            <div className={styles.desc}>
              <h2>Order Confirmed</h2>
              <p>
                {orderTypes[
                  data?.checkOrderStatusData?.orderData?.order_type
                ] ||
                  `Thanks! Your order #${orderId} has been received. We'll be in touch shortly with the next steps.`}
              </p>
              {data?.checkOrderStatusData?.orderData?.payment_term_name && (
                <p className={styles.paymentTerm}>
                  Payment Terms:{' '}
                  <strong>
                    {data.checkOrderStatusData.orderData.payment_term_name}
                  </strong>
                </p>
              )}
              <div className={styles.btns}>
                <DownloadInvoiceButton orderId={orderId} />
                {/* Guest-only — client component reads localStorage
                    on hydrate and only renders the black CTA when
                    the buyer isn't logged in. Prompts them to
                    register so future orders are easier to track. */}
                <CreateAccountCta />
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export default page;
