import Image from 'next/image';

import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';

import Address from '@components/account/address/address';
import AccountHeader from '@components/account/header/header';
import Orders from '@components/account/orders/orders';
import UserDetails from '@components/account/user-details/user-details';
import WishlistItems from '@components/account/wishlist-items/wishlist-items';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Tabs from '@components/tabs/tabs';

import AccessImg from '@assets/images/productimg.png';

import styles from './retail.module.scss';

export default async function RetailPage() {
  const content = await getPageData('/account/retail');

  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks?.map(renderBlock) || [],
  );

  return (
    <Layout title="Retail Account">
      <Container>
        <AccountHeader />
        <Tabs
          tabs={[
            {
              content: <Orders />,
              slug: 'orderdashboard',
              title: 'Order',
            },
            {
              content: <UserDetails />,
              slug: 'userdetails',
              title: 'Account Details',
            },
            {
              content: <WishlistItems />,
              slug: 'wishlist',
              title: 'Wishlist',
            },
            {
              content: <Address />,
              slug: 'address',
              title: 'Address',
            },

            {
              content: (
                <div className={styles.registerProducts}>
                  <div className={styles.heading}>
                    <h3>Product Registration</h3>
                    <button>Register Your New Products Here</button>
                  </div>
                  <div className={styles.lists}>
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
                        <h6>HSP Load Rack Pro</h6>
                        <div className={styles.desc}>
                          <div className={styles.left}>
                            <p>
                              <strong>Purchase Date:</strong> 10/10/2019
                            </p>
                            <p>
                              <strong>Store Purchased From:</strong> ARB
                              Shepparton
                            </p>
                          </div>
                          <div className={styles.right}>
                            <div className={styles.sNo}>
                              <p>Serial Number of Unit:</p>
                              <h4>1029384756</h4>
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
                        <h6>HSP Load Rack Pro</h6>
                        <div className={styles.desc}>
                          <div className={styles.left}>
                            <p>
                              <strong>Purchase Date:</strong> 10/10/2019
                            </p>
                            <p>
                              <strong>Store Purchased From:</strong> ARB
                              Shepparton
                            </p>
                          </div>
                          <div className={styles.right}>
                            <div className={styles.sNo}>
                              <p>Serial Number of Unit:</p>
                              <h4>1029384756</h4>
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
                        <h6>HSP Load Rack Pro</h6>
                        <div className={styles.desc}>
                          <div className={styles.left}>
                            <p>
                              <strong>Purchase Date:</strong> 10/10/2019
                            </p>
                            <p>
                              <strong>Store Purchased From:</strong> ARB
                              Shepparton
                            </p>
                          </div>
                          <div className={styles.right}>
                            <div className={styles.sNo}>
                              <p>Serial Number of Unit:</p>
                              <h4>1029384756</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ),
              slug: 'product-registration',
              title: 'Product Registration',
            },
          ]}
          type="vertical"
        />
      </Container>
    </Layout>
  );
}
