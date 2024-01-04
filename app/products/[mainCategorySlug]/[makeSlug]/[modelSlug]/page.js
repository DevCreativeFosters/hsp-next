import { StoreLocatorProvider } from '@contexts/store-locator';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import ProductTabs from '@components/product-tabs/product-tabs';
import EnquiryForm from 'components/enquiry-form/enquiry-form';
import BreadcrumbsProduct from '@components/breadcrumbs-product';
import ErrorPage from '@components/error-page';
import PageContainer from '@components/page-container/page-container';
import ContentBox from '@components/content-box/content-box';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import { renderBlock } from '@lib/block';
import {
  getCategoriesAndMakesAndModels,
  getMainProductCategory,
  getMake,
  getProductsByCategoriesSlugs,
} from '@lib/api';
import styles from './page.module.scss';

export default async function CategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const makeSlug = params.makeSlug;
  const modelSlug = params.modelSlug;
  const mainCategory = await getMainProductCategory(mainCategorySlug);
  const mainCategoryDetails = mainCategory.mainCategoryDetails;
  const make = await getMake(makeSlug);
  const details = make?.detailsFields.details;
  const filteredData = details?.filter(
    data => data.relatedProductCategory?.slug === mainCategorySlug,
  );
  const productHeroData = {
    warrantyDescription:
      filteredData?.length > 1
        ? filteredData[0]?.warranty.warrantyDescription
        : mainCategoryDetails?.warranty.warrantyDescription,
    warrantyTimePeriod:
      filteredData?.length > 1
        ? filteredData[0]?.warranty.warrantyTimePeriod
        : mainCategoryDetails?.warranty.warrantyTimePeriod,
  };

  const products = await getProductsByCategoriesSlugs(
    mainCategorySlug,
    makeSlug,
    modelSlug,
  );
  const firstMatchedProduct = products.length ? products[0] : null;
  const contentBlocks = firstMatchedProduct?.flexibleContent?.blocks?.map(
    block => renderBlock(block, 'product'),
  );

  const currentProduct = {
    mainCategory: {
      label: mainCategory?.name,
      value: mainCategorySlug,
    },
    make: {
      label: make?.name,
      value: makeSlug,
    },
    model: {
      label: firstMatchedProduct?.title,
      value: modelSlug,
    },
  };

  const categoryMakesAndModels = await getCategoriesAndMakesAndModels();
  const categories = formatCategories(categoryMakesAndModels);

  if (!firstMatchedProduct || !mainCategory || !make) {
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

  const images = firstMatchedProduct?.productFields?.images?.map(
    (item, index) => {
      return {
        sourceUrl: item.image.mediaItemUrl,
        alt: index === 0 ? 'mainImage' : '',
        mainImage: index === 0,
      };
    },
  );

  return (
    <Layout title="Product">
      <Container>
        <div className={styles.breadcrumbs}>
          <BreadcrumbsProduct
            currentProduct={currentProduct}
            categories={categories}
          />
        </div>
        <div className={styles.header}>
          <ProductImageCarousel images={images} />
          <div className={styles.details}>
            <h1 className={styles.name}>
              {mainCategory.name} <br />
              <span className={styles.variant}>
                {make.name} {firstMatchedProduct?.title}
              </span>
            </h1>
            {firstMatchedProduct?.productFields.description && (
              <p className={styles.description}>
                {firstMatchedProduct?.productFields.description}
              </p>
            )}
            <StoreLocatorProvider>
              <EnquiryForm productData={firstMatchedProduct} />
            </StoreLocatorProvider>
            <div className={styles.warranty}>
              <ContentBox className={styles.warrantyDescription}>
                <h3 className={styles.contentBoxTitle}>
                  Warranty{' '}
                  {productHeroData.warrantyTimePeriod && (
                    <span className={styles.years}>
                      +{productHeroData.warrantyTimePeriod} years
                    </span>
                  )}
                </h3>
                {productHeroData.warrantyDescription && (
                  <p>{productHeroData.warrantyDescription}</p>
                )}
              </ContentBox>
            </div>
          </div>
        </div>

        <ProductTabs
          featuresDescription={
            firstMatchedProduct?.productFields.featuresDescription
          }
          featuresBoxes={firstMatchedProduct?.productFields.featuresBoxes}
          specificationDescription={
            firstMatchedProduct?.productFields.specificationDescription
          }
          specificationContent={
            firstMatchedProduct?.productFields.specification
          }
          // TODO: add data from backend
          manualsDescription="For more technical information on our hard lid please read below, or simply scroll to the bottom of this page to get in touch with one of our knowledgeable staff memebers."
          // TODO: add data from backend
          manualsLinks={[
            {
              label: 'Product flyer',
              url: '/',
            },
            {
              label: 'How to use the product',
              url: '/',
            },
            {
              label: 'Instruction sheet',
              url: '/',
            },
          ]}
        />
      </Container>
      {contentBlocks?.map(contentBlock => contentBlock)}
    </Layout>
  );
}
