import Image from 'next/image';

import Container from '@components/container/container';
import DownloadQuoteButton from '@components/download-invoice/download-quote';
import Layout from '@components/layout/layout';

import OrderImg from '@assets/images/WideSHotExt1.png';

import styles from './quote.module.scss';

function page({ params }) {
  const { quoteId } = params;

  return (
    <Layout title="Quote Confirmation | HSP">
      <Container>
        <section className={styles.quoteStatus}>
          <figure>
            <Image alt={'HSP'} height={282} src={OrderImg} width={1133} />
          </figure>
          <div className={styles.quoteContent}>
            <div className={styles.desc}>
              <h1>Quote Confirmed</h1>
              <p>
                Please check your email to view your quote, or download a copy
                here.
              </p>
              <div className={styles.btns}>
                <DownloadQuoteButton quoteId={quoteId} />
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Layout>
  );
}

export default page;
