import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';
import BreadcrumbsProduct from '@components/breadcrumbs-product';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import { renderBlock } from '@lib/block';
import {
  getCategoriesAndMakesAndModels,
  getMainProductCategoryBlocks,
  getMainProductCategory,
} from '@lib/api';
import styles from './page.module.scss';
import PageContainer from '@components/page-container/page-container';
import ErrorPage from '@components/error-page';

export default async function MainCategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const categoryData = await getMainProductCategory(mainCategorySlug);
  const mainCategoryDetails = categoryData?.mainCategoryDetails;
  const featuredImage = mainCategoryDetails?.featuredImage;

  if (!categoryData) {
    return (
      <Layout title="Product" withMap>
        <Container>
          <PageContainer>
            <ErrorPage
              title="Product not found"
              text="Sorry, we couldn't find the product you are looking for."
              buttonText="Back to Products"
              product
            />
          </PageContainer>
        </Container>
      </Layout>
    );
  }

  const blocks = await getMainProductCategoryBlocks(mainCategorySlug);
  const contentBlocks = blocks?.flexibleContent?.blocks?.map(block =>
    renderBlock(block, 'product_category'),
  );
  const currentProduct = {
    mainCategory: {
      label: categoryData.name,
      value: mainCategorySlug,
    },
    make: {
      label: '',
      value: '',
    },
    model: {
      label: '',
      value: '',
    },
  };

  const categoryMakesAndModels = await getCategoriesAndMakesAndModels();
  const categories = formatCategories(categoryMakesAndModels);

  return (
    <Layout title="Product">
      <Container>
        <div className={styles.breadcrumbs}>
          <BreadcrumbsProduct
            mainCategory={true}
            currentProduct={currentProduct}
            categories={categories}
          />
        </div>
        <ProductHero
          title={categoryData?.name}
          description={categoryData?.description}
          image={featuredImage}
          features={{
            content: mainCategoryDetails?.features,
          }}
          warranty={{
            content: mainCategoryDetails?.warranty.warrantyDescription,
            years: mainCategoryDetails?.warranty.warrantyTimePeriod,
          }}
        />
      </Container>
      {contentBlocks?.map(contentBlock => contentBlock)}
    </Layout>
  );
}
