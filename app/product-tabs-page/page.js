import { Fragment } from 'react';
import { getPageData } from '@lib/api';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';
import ProductTabs from '@components/product-tabs/product-tabs';
import Container from '@components/container/container';

export const metadata = {
  title: 'HSP 4x4 - Product Tabs Page',
  // description: ''
};

export default async function HomePage() {
  const content = await getPageData('');
  const contentBlocks = content?.flexibleContent.blocks.map(renderBlock);

  return (
    <Layout withMap>
      <Container>
        <ProductTabs />
      </Container>
      {contentBlocks.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
