import { Fragment } from 'react';

import AccountDetails from '@components/account/account-details/account-details';
import AccountHeader from '@components/account/header/header';
import Orders from '@components/account/orders/orders';
import Quotes from '@components/account/quotes/quotes';
import WishlistItems from '@components/account/wishlist-items/wishlist-items';
import Container from '@components/container/container';
import GravityFormWrapper from '@components/gravity-forms/gravity-form-wrapper';
import Layout from '@components/layout/layout';
import Tabs from '@components/tabs/tabs';

import LinkIcon from '@assets/icons/link-icon.svg';
import PdfIcon from '@assets/icons/pdf-icon.svg';

import styles from './b2b.module.scss';

// Gravity Form id for the "Contact Us" support form.
const SUPPORT_FORM_ID = 7;

export default async function RetailPage() {
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
                  <div className={styles.supportContact}>
                    <h3 className={styles.sectionTitle}>
                      Need Support? Contact Us
                    </h3>
                    <p>
                      Fill out the form below and one of our team members will
                      get back to you ASAP!
                    </p>
                    <GravityFormWrapper attributes={{ id: SUPPORT_FORM_ID }} />
                  </div>
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
