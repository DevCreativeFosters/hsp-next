import { getModelBySlug, getProductsWithVariants } from '@lib/api';
import Layout from '@components/layout/layout';
import Builder from '@components/builder/builder';
import { StoreLocatorProvider } from '@contexts/store-locator';

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
        const parentInherit = productVariant.parentInherit;

        productsVariants.push({
          ...productVariant,
          price:
            productVariant.variantDetails.price ||
            (parentInherit && product.productFields.price),
          installationCost: product.productFields.installationCost,
          productSlug: product.slug,
        });
      });
    }
  });

  return (
    <Layout withFooter={false}>
      <StoreLocatorProvider>
        <Builder model={model} products={productsVariants} />
      </StoreLocatorProvider>
    </Layout>
  );
}
