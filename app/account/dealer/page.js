import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';

import AccountDetails from '@components/account/account-details/account-details';
import AccountHeader from '@components/account/header/header';
import Orders from '@components/account/orders/orders';
import Quotes from '@components/account/quotes/quotes';
import WishlistItems from '@components/account/wishlist-items/wishlist-items';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Tabs from '@components/tabs/tabs';

import LinkIcon from '@assets/icons/link-icon.svg';
import PdfIcon from '@assets/icons/pdf-icon.svg';

import styles from './b2b.module.scss';

export default async function RetailPage() {
  // The dealer Support tab reuses the same "Contact Us" support form the retail
  // account renders (the b2b WP page has no form block of its own yet).
  const supportContent = await getPageData('/account/retail');
  const supportBlocks = await Promise.all(
    supportContent?.flexibleContent?.blocks?.map(renderBlock) || [],
  );

  return (
    <Layout title="Retail Account">
      <Container>
        <AccountHeader />
        <Tabs
          tabs={[
            {
              content: <AccountDetails />,
              slug: 'accountdetails',
              title: 'Account Details',
            },
            {
              content: <Quotes />,
              slug: 'quotes',
              title: 'Quotes',
            },
            {
              content: <Orders />,
              slug: 'orderdashboard',
              title: 'Order Dashboard',
            },
            {
              content: <WishlistItems />,
              slug: 'wishlist',
              title: 'Wishlist',
            },
            {
              content: (
                <Fragment>
                  {supportBlocks[0]}
                  <div className={styles.warrantyBlock}>
                    <h3 className={styles.sectionTitle}>Warranty Procedures</h3>
                    <p>
                      At HSP Vehicle Accessories, we take immense pride in our
                      after-sales service, ensuring that our customers receive
                      exceptional support long after their purchase. We’ve
                      established clear and thorough warranty procedures,
                      ensuring prompt resolution of any issues that may arise.
                    </p>
                    <ul>
                      <li>
                        <PdfIcon />
                        <a href="#">Roll Cover Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Load Racks and Load Bar Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Armour Bar Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Load Slide Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Tail Lock Warranty Guide</a>
                      </li>
                      <li>
                        <PdfIcon />
                        <a href="#">Tail Assist Warranty Guide </a>
                      </li>
                      <li>
                        <LinkIcon />
                        <a href="#">Spare Parts Price List</a>
                      </li>
                    </ul>
                  </div>
                </Fragment>
              ),
              slug: 'support',
              title: 'Support',
            },
          ]}
          type="vertical"
        />
      </Container>
    </Layout>
  );
}
