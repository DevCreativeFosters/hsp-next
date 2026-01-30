import Image from 'next/image';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';

import processImage from '@assets/images/process-img.png';

import styles from './cart.module.scss';
import ClientSideCartItems from './client-side-cart-items';

function page() {
  return (
    <Layout title="Cart | HSP">
      <Container>
        <ClientSideCartItems />
        <section className={styles.checkoutProcess}>
          <div className={styles.heading}>
            <h2>Checkout Process </h2>
            <p>
              When choosing to get your product fitted at a HSP Specialist,
              there is an easy 4 step process!
            </p>
          </div>
          <div className={styles.processWrapper}>
            <Image alt="Checkout Process" src={processImage} />
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export default page;
