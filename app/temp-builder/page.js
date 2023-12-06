// import { getPageData } from '@lib/api';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import ProductsCarousel from '@components/builder/products-carousel';

export const metadata = {
  title: 'HSP 4x4 - UTP Builder',
  // description: ''
};

import products from '@components/builder/mock-data';

export default async function TempBuilderPage() {
  // const content = await getPageData('');

  return (
    <Layout>
      <Container>
        <ProductsCarousel products={products} />
      </Container>
    </Layout>
  );
}
