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


const questions = [
  {
    answer:
      '<p>There is a 3" gap between the side rails of our Roll R Cover.</p>',
    question:
      'How much space is there between the side rails of our Roll R Cover?',
  },
  {
    answer:
      '<p>The Electric Roller Cover Canister is made of durable PVC. It is made with a 3" gap between the side rails of our Roll R Cover.</p>',
    question: 'How is the Electric Roller Cover Canister Made?',
  },
  {
    answer:
      '<p>The Ute Roller Cover is waterproof and dustproof. It is made with a 3" gap between the side rails of our Roll R Cover.</p>',
    question: 'Is the Ute Roller Cover waterproof or dustproof?',
  },
  {
    answer:
      '<p>There is a 3" gap between the side rails of our Roll R Cover.</p>',
    question:
      'How much space will i have underneath the roll top when its closed?',
  },
  {
    answer:
      '<p>There is a 3" gap between the side rails of our Roll R Cover.</p>',
    question: 'How much does the Roll R Cover weigh?',
  },
  {
    answer:
      '<p>There is a 3" gap between the side rails of our Roll R Cover.</p>',
    question: 'How much weight can you put on the Roll R Cover itself?',
  },
  {
    answer:
      '<p>There is a 3" gap between the side rails of our Roll R Cover.</p>',
    question:
      'How much space is there between the side rails of our Roll R Cover?',
  },
  {
    answer:
      '<p>The Electric Roller Cover Canister is made of durable PVC. It is made with a 3" gap between the side rails of our Roll R Cover.</p>',
    question: 'How is the Electric Roller Cover Canister Made?',
  },
];

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
              title: 'Orders',
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
                          questions={questions}
                          title="Frequently Asked Questions"
                        />
                      ),
                      slug: 'faqs',
                      title: `FAQ's`,
                    },
                    {
                      content: <Orders onlyReturns={true} />,
                      slug: 'returns',
                      title: 'Returns',
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
