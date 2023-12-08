import { getModelBySlug, getProductsWithVariants } from '@lib/api';
import Layout from '@components/layout/layout';
import Builder from '@components/builder/builder';

export const metadata = {
  title: 'HSP 4x4 - UTP Builder',
  // description: ''
};

export default async function TempBuilderPage() {
  const model = await getModelBySlug('next-gen-ranger-raptor');
  const products = await getProductsWithVariants(
    'ford',
    'next-gen-ranger-raptor',
  );
  const productsVariants = [];

  products?.forEach(product => {
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
    <Layout withFooter={false}>
      <Builder model={model} products={productsVariants} />
    </Layout>
  );
}
