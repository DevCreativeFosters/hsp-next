import { Fragment } from 'react';
import { getPageData } from '@lib/api';
import { renderBlock } from '@lib/block';
import Layout from '@components/layout/layout';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import Container from '@components/container/container';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';

export const metadata = {
  title: 'HSP 4x4 - Product Page',
  // description: ''
};

export default async function ProductPage() {
  const content = await getPageData('/product-page');
  const contentBlocks = content?.flexibleContent?.blocks?.map(renderBlock);

  return (
    <Layout withMap>
      <Container>
        <Breadcrumbs
          withContainer={true}
          items={[
            {
              label: 'Product',
              url: '/',
            },
            {},
          ]}
        />
        <ProductImageCarousel />
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
