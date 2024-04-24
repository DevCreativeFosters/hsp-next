import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategories } from '@lib/api/get-main-product-categories';
import { getPageData } from '@lib/api/get-page-data';
import { getSeoData } from '@lib/api/getSeoData';
import { renderBlock } from '@lib/block';
import { getExcludeTree } from '@lib/helpers';
import routes from '@lib/routes';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductCategory from '@components/product-category/product-category';

export async function generateMetadata() {
  const data = await getSeoData(routes.products);

  return {
    ...data,
  };
}

export default async function ProductsPage() {
  const content = await getPageData('products');
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);
  const globalOptions = await getGlobalOptions();
  const excludeTree = getExcludeTree(globalOptions);
  const excludeChildren = [globalOptions?.noCoverCategory?.nodes[0].databaseId];

  const mainProductCategories =
    (await getMainProductCategories(excludeTree, excludeChildren)) || [];

  return (
    <Layout>
      <Container>
        {mainProductCategories?.map(productCategory => (
          <ProductCategory
            category={productCategory}
            key={productCategory.databaseId}
          />
        ))}
      </Container>
      {contentBlocks}
    </Layout>
  );
}
