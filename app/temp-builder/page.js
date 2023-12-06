import { getProductsWithVariants } from '@lib/api';
import Layout from '@components/layout/layout';
import Container from '@components/container/container';
import ProductsCarousel from '@components/builder/products-carousel';

import { default as productsMock } from '@components/builder/mock-data';

export const metadata = {
  title: 'HSP 4x4 - UTP Builder',
  // description: ''
};

const prodTemp = [];

export default async function TempBuilderPage() {
  const products = await getProductsWithVariants(
    'ford',
    'next-gen-ranger-raptor',
  );
  const productsVariants = [];

  productsMock?.forEach(product => {
    if (product.productFields.variants) {
      product.productFields.variants.forEach(productVariant => {
        productsVariants.push({
          ...productVariant,
          price: productVariant.variantDetails.price,
          installationCost:
            productVariant.installationCost ||
            product.productFields.installationCost,
        });
      });
    }
  });

  return (
    <Layout>
      <Container>
        <ProductsCarousel products={productsVariants} />
      </Container>
    </Layout>
  );
}
