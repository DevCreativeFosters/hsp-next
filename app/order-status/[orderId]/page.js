import { fetchAPI } from '@lib/fetch-api';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import SuccessIcon from '@assets/icons/check-icon-animate.svg';
import ErrorIcon from '@assets/icons/error-animate-icon.svg';

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
        <div className={styles.messageContent}>
          {data?.checkOrderStatusData?.success ? (
            <div className={styles.successIcon}>
              <SuccessIcon />
            </div>
          ) : (
            <div className={styles.errorIcon}>
              <ErrorIcon />
            </div>
          )}
          <h3>{data?.checkOrderStatusData?.message}</h3>
        </div>
      </Container>
    </Layout>
  );
}

export default page;
