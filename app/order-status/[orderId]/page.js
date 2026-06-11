import Image from 'next/image';

import { fetchAPI } from '@lib/fetch-api';

import Container from '@components/container/container';
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
  const data = await fetchAPI(ORDER_STATUS_MUTATION, {
    variables: { orderId: parseInt(orderId) },
  });

  const orderTypes = {
    'click-collect': `Thanks, We'll let you know when your order is ready to collect.`,
    'deliver-door': `Thanks for your order. You'll receive a confirmation email and a tracking number once your order is ready.`,
    'deliver-to-store': `Thanks for your order. We'll be in touch shortly to book a fitting time.`,
    'drop-ship-to-customer': `We'll send the items directly to your customer and update you once the shipment has been sent.`,
    'local-installation': `Thanks, We'll get in touch with you to book a fitting time.`,
    'on-site-fitting': `Thanks for your order. We'll be in touch shortly to book an on-site fitting time at your dealership.`,
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
                {orderTypes[data?.checkOrderStatusData?.orderData?.order_type]}
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
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export default page;
