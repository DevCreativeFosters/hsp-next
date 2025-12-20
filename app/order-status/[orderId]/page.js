import Image from 'next/image';

import { fetchAPI } from '@lib/fetch-api';

import Button from '@components/button/button';
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

  const orderStatuses = {
    'click-collect': `Thanks, We'll let you know when your order is ready to collect.`,
    'deliver-door': `Thanks, You'll get an order confirmation email and a tracking number once your order is ready.`,
    'drop-shipping': `We'll send the items directly to your customer and update you once the shipment has been sent.`,
    'local-installation': `Thanks, We'll get in touch with you to book a fitting time.`,
    'pickup-from-hsp': `The HSP team will contact you when your order is ready for collection from HSP HQ.`,
    'standard-delivery': `Thanks for your order. We'll be in touch shortly to book a fitting time.`,
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
                {
                  orderStatuses[
                    data?.checkOrderStatusData?.orderData?.order_type
                  ]
                }
              </p>
              <div className={styles.btns}>
                <DownloadInvoiceButton orderId={orderId} />
              </div>
              <p>
                Haven&apos;t received the email?{' '}
                <Button href="#">Click Here</Button>
              </p>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export default page;
