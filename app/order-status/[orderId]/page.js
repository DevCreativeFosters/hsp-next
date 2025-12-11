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
        }
    }
`;

async function page({ params }) {
  const { orderId } = params;
  const data = await fetchAPI(ORDER_STATUS_MUTATION, {
    variables: { orderId: parseInt(orderId) },
  });
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
                The HSP team will contact you when your order is ready for
                collection from HSP HQ.
              </p>
              <div className={styles.btns}>
                <DownloadInvoiceButton orderId={orderId} />
              </div>
              <p>
                Haven’t received the email? <Button href="#">Click Here</Button>
              </p>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export default page;
