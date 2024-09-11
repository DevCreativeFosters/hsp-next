import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategories } from '@lib/api/get-main-product-categories';
import { getMenu } from '@lib/api/get-menu';
import { getPageData } from '@lib/api/get-page-data';
import { getSeoByUri } from '@lib/api/get-seo-by-uri';
import { renderBlock } from '@lib/block';
import { getExcludeTree, sortMainProductCategories } from '@lib/helpers';
import { removeLeadingSlash } from '@lib/helpers';
import normalizeMainMenu from '@lib/normalize-main-menu';
import routes from '@lib/routes';
import { metadata } from '@lib/seo';

import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductCategory from '@components/product-category/product-category';

export async function generateMetadata() {
  const tags = [`page:${removeLeadingSlash(routes.products)}`];
  const data = await getSeoByUri(routes.products, tags);

  return {
    ...metadata,
    ...data,
  };
}

export default async function ProductsPage() {
  const content = await getPageData('products');
  const contentBlocks = await Promise.all(
    content?.flexibleContent?.blocks.map(renderBlock) || [],
  );
  const globalOptions = await getGlobalOptions();
  const excludeTree = getExcludeTree(globalOptions);
  const excludeChildren = [globalOptions?.noCoverCategory?.nodes[0].databaseId];
  const mainMenu = await getMenu('main-menu');
  const normalizedMainMenu = normalizeMainMenu(mainMenu);

  const mainProductCategories =
    (await getMainProductCategories(excludeTree, excludeChildren)) || [];

  const sortedMainProductCategories = sortMainProductCategories(
    mainProductCategories,
    normalizedMainMenu,
  );

  return (
    <Layout>
      <Container>
        {sortedMainProductCategories?.map(productCategory => (
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
