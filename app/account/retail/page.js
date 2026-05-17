import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';

import Address from '@components/account/address/address';
import AccountHeader from '@components/account/header/header';
import Orders from '@components/account/orders/orders';
import RegisteredProducts from '@components/account/registered-products/registered-products';
import UserDetails from '@components/account/user-details/user-details';
import WishlistItems from '@components/account/wishlist-items/wishlist-items';
import Container from '@components/container/container';
import FAQ from '@components/faq/faq';
import Layout from '@components/layout/layout';
import Tabs from '@components/tabs/tabs';

export default async function RetailPage() {
  const content = await getPageData('/account/retail');

  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks?.map(renderBlock) || [],
  );

  const faqBlock =
    contentBlocks[1]?.props?.children?.props?.children?.props || {};

  return (
    <Layout title="Retail Account">
      <Container>
        <AccountHeader />
        <Tabs
          tabs={[
            {
              content: <UserDetails />,
              slug: 'userdetails',
              title: 'Account Details',
            },
            {
              content: <Orders />,
              slug: 'orderdashboard',
              title: 'Orders',
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
                <Tabs
                  tabs={[
                    {
                      content: <>{contentBlocks[0]}</>,
                      slug: 'contactus',
                      title: 'Contact Us',
                    },
                    {
                      content: (
                        <FAQ
                          block={true}
                          questions={faqBlock.questions || []}
                          title={faqBlock.title}
                          titleTag={faqBlock.titleTag}
                          titleTagStyle={faqBlock.titleTagStyle}
                        />
                      ),
                      slug: 'faqs',
                      title: `FAQ's`,
                    },
                    {
                      content: <></>,
                      slug: 'resources',
                      title: 'Resources',
                    },
                  ]}
                  type="horizontal"
                />
              ),
              slug: 'support',
              title: 'Support',
            },
            {
              content: <RegisteredProducts />,
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
