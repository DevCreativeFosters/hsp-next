import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategories } from '@lib/api/get-main-product-categories';
import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductCategory from '@components/product-category/product-category';

export const metadata = {
  title: 'HSP 4x4 - Products',
  // description: ''
};

export default async function ProductsPage() {
  const content = await getPageData('products');
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);
  const globalOptions = await getGlobalOptions();
  const excludeTree = [];

  if (globalOptions?.coversCategory?.databaseId) {
    excludeTree.push(globalOptions.coversCategory.databaseId);
  }

  if (globalOptions?.compatibleFactoryOptions?.databaseId) {
    excludeTree.push(globalOptions.compatibleFactoryOptions.databaseId);
  }

  const mainProductCategories =
    (await getMainProductCategories(excludeTree)) || [];

  return (
    <Layout>
      <Container>
        {mainProductCategories?.map(productCategory => (
          <ProductCategory
            key={productCategory.databaseId}
            category={productCategory}
          />
        ))}
      </Container>
      {contentBlocks}
    </Layout>
  );
}
