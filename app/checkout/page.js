import { CheckoutProvider } from '@contexts/checkout';

import CheckoutForm from '@components/forms/checkout/checkout';
import Layout from '@components/layout/layout';

function Checkout() {
  return (
    <Layout title="Checkout | HSP">
      <CheckoutProvider>
        <CheckoutForm />
      </CheckoutProvider>
    </Layout>
  );
}

export default Checkout;
