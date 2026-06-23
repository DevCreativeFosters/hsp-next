import { Fragment } from 'react';

import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';

import AccountDetails from '@components/account/account-details/account-details';
import Address from '@components/account/address/address';
import AccountHeader from '@components/account/header/header';
import Orders from '@components/account/orders/orders';
import Referrals from '@components/account/referrals/referrals';
import StoreResources from '@components/account/store-resources/store-resources';
import WishlistItems from '@components/account/wishlist-items/wishlist-items';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Tabs from '@components/tabs/tabs';

import LinkIcon from '@assets/icons/link-icon.svg';
import PdfIcon from '@assets/icons/pdf-icon.svg';

import styles from './b2b.module.scss';

export default async function DealerPage() {
  // WP can fail or return null/undefined for this page when the editor hasn't
  // populated the Flexible Content block. Don't let that crash the route.
  // Try the dealer-specific slug first, fall back to /account/b2b so the
  // page still renders if the WP editor hasn't created a dedicated dealer
  // page yet (both account pages share the same content blocks).
  let content = null;
  try {
    content =
      (await getPageData('/account/dealer')) ||
      (await getPageData('/account/b2b'));
  } catch (err) {
    console.error('Failed to load /account/dealer page data:', err?.message);
  }

  const blocks = Array.isArray(content?.flexibleContent?.blocks)
    ? content.flexibleContent.blocks
    : [];
  const contentBlocks = blocks.length
    ? await Promise.all(blocks.map(renderBlock))
    : [];

  return (
    <Layout title="Dealer Account">
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
              content: <Address />,
              slug: 'address',
              title: 'Address',
            },
            {
              content: <Orders />,
              slug: 'orderdashboard',
              title: 'Orders',
            },
            {
              content: <Referrals />,
              slug: 'referrals',
              title: 'Referrals',
            },
            {
              content: <WishlistItems />,
              slug: 'wishlist',
              title: 'Wishlist',
            },
            {
              content: <StoreResources />,
              slug: 'resources',
              title: 'Resources',
            },
            {
              content: (
                <Fragment>
                  {contentBlocks?.[0] ?? null}
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
