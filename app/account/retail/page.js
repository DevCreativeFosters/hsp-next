import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';

import Address from '@components/account/address/address';
import AccountHeader from '@components/account/header/header';
import UserDetails from '@components/account/user-details/user-details';
import WishlistItems from '@components/account/wishlist-items/wishlist-items';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import Tabs from '@components/tabs/tabs';


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
              content: <WishlistItems />,
              slug: 'wishlist',
              title: 'Wishlist',
            },
            {
              content: <UserDetails />,
              slug: 'userdetails',
              title: 'Account Details',
            },

            {
              content: <Address />,
              slug: 'address',
              title: 'Address',
            },
          ]}
          type="vertical"
        />
      </Container>
    </Layout>
  );
}
