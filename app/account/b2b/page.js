import { Fragment } from 'react';

import Image from 'next/image';

import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';

import AccountDetails from '@components/account/account-details/account-details';
import Address from '@components/account/address/address';
import AccountHeader from '@components/account/header/header';
import Orders from '@components/account/orders/orders';
import Referrals from '@components/account/referrals/referrals';
import WishlistItems from '@components/account/wishlist-items/wishlist-items';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Tabs from '@components/tabs/tabs';

import CartIcon from '@assets/icons/cart-icon-basket.svg';
import LinkIcon from '@assets/icons/link-icon.svg';
import PdfIcon from '@assets/icons/pdf-icon.svg';
import AccessImg from '@assets/images/access-img.png';

import styles from './b2b.module.scss';

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
              content: (
                <div className={styles.resourceMain}>
                  <h3 className={styles.sectionTitle}>Marketing Resources</h3>
                  <ul>
                    <li>
                      <LinkIcon />
                      <a href="#">HSP Logos & Branding Guides</a>
                    </li>
                    <li>
                      <LinkIcon />
                      <a href="#">Social Media Posts</a>
                    </li>
                    <li>
                      <LinkIcon />
                      <a href="#">Product Photos</a>
                    </li>
                    <li>
                      <LinkIcon />
                      <a href="#">Editable Flyers</a>
                    </li>
                    <li>
                      <LinkIcon />
                      <a href="#">Lifestyle Images</a>
                    </li>
                    <li>
                      <LinkIcon />
                      <a href="#">Display Signage Options</a>
                    </li>
                  </ul>

                  <div className={styles.cartButton}>
                    <button>
                      <CartIcon /> Access My Dealership Assets
                    </button>
                  </div>

                  <div className={styles.lmsBlock}>
                    <div className={styles.left}>
                      <h4>Learning Management System</h4>
                      <p>
                        The Learning Module System (LMS) is an online training
                        platform designed to equip your new and existing staff
                        with in-depth knowledge of HSP products, so they can
                        deliver exceptional service and drive sales.
                      </p>
                      <button className={styles.button} href="#">
                        Access LMS Here
                      </button>
                    </div>
                    <div className={styles.right}>
                      <figure>
                        <Image
                          alt={'HSP Logo'}
                          height={188}
                          src={AccessImg}
                          width={417}
                        />
                      </figure>
                    </div>
                  </div>
                </div>
              ),
              slug: 'resources',
              title: 'Resources',
            },
            {
              content: (
                <Fragment>
                  {contentBlocks[0]}
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
