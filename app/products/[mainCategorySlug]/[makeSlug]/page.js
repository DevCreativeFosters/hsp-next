import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';
import BreadcrumbsProduct from '@components/breadcrumbs-product';
import PageContainer from '@components/page-container/page-container';
import ErrorPage from '@components/error-page';
import { renderBlock } from '@lib/block';
import {
  getMainProductCategory,
  getCategoriesAndMakesAndModels,
  getMake,
  getMainProductCategoryBlocks,
} from '@lib/api';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import styles from '../page.module.scss';

export default async function CategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const categoryData = await getMainProductCategory(mainCategorySlug);
  const mainCategoryDetails = categoryData?.mainCategoryDetails;
  const featuredImage = mainCategoryDetails?.featuredImage;
  const blocks = await getMainProductCategoryBlocks(mainCategorySlug);
  const contentBlocks = blocks?.flexibleContent?.blocks?.map(block =>
    renderBlock(block, 'product_category'),
  );
  const makeSlug = params.makeSlug;
  const makeData = await getMake(makeSlug);
  const mainCategory = await getMainProductCategory(mainCategorySlug);
  const details = makeData?.detailsFields.details;

  if (!makeData || !categoryData) {
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

  const filteredData = details?.filter(
    data => data.relatedProductCategory.slug === mainCategorySlug,
  );
  const productHeroData = {
    image:
      filteredData.length > 1 ? filteredData[0].featuredImage : featuredImage,
    features:
      filteredData.length > 1
        ? filteredData[0]?.features
        : mainCategoryDetails?.features,
    warrantyDescription:
      filteredData.length > 1
        ? filteredData[0]?.warranty.warrantyDescription
        : mainCategoryDetails?.warranty.warrantyDescription,
    warrantyTimePeriod:
      filteredData.length > 1
        ? filteredData[0]?.warranty.warrantytimePeriod
        : mainCategoryDetails?.warranty.warrantyTimePeriod,
  };

  const currentProduct = {
    mainCategory: {
      label: mainCategory.name,
      value: mainCategorySlug,
    },
    make: {
      label: makeData.name,
      value: makeSlug,
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
            currentProduct={currentProduct}
            categories={categories}
          />
        </div>
        <ProductHero
          make={makeData.name}
          title={categoryData?.name}
          description={makeData?.description || categoryData?.description}
          image={productHeroData.image}
          features={{
            content: productHeroData.features,
          }}
          warranty={{
            content: productHeroData.warrantyDescription,
            years: productHeroData.warrantyTimePeriod,
          }}
        />
      </Container>
      {contentBlocks.map(contentBlock => contentBlock)}
    </Layout>
  );
}
