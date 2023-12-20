import { getModelBySlug, getProductsWithVariants } from '@lib/api';
import Layout from '@components/layout/layout';
import Builder from '@components/builder/builder';
import { StoreLocatorProvider } from '@contexts/store-locator';

export const metadata = {
  title: 'HSP 4x4 - UTP Builder',
  // description: ''
};

export default async function TempBuilderPage() {
  const makeName = 'mazda';
  const modelName = 'bt-50-2013-2020';
  const model = await getModelBySlug(modelName);
  const products = await getProductsWithVariants(makeName, modelName);
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
        <Builder
          makeName={makeName}
          model={model}
          products={productsVariants}
        />
      </StoreLocatorProvider>
    </Layout>
  );
}
