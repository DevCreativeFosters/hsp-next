import Layout from '@components/layout/layout';
import ProductCategory from '@components/product-category/product-category';
import Container from '@components/container/container';
import { renderBlock } from '@lib/block';
import { getPageData, getMainProductCategories } from '@lib/api';

export const metadata = {
  title: 'HSP 4x4 - Products',
  // description: ''
};

export default async function ProductsPage() {
  const content = await getPageData('products');
  const contentBlocks = content?.flexibleContent?.blocks.map(renderBlock);
  const mainProductCategories = (await getMainProductCategories()) || [];

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
