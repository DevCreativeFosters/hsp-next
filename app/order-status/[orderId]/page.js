import { fetchAPI } from '@lib/fetch-api';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

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
        <p>{data?.checkOrderStatusData?.message}</p>
      </Container>
    </Layout>
  );
}

export default page;
