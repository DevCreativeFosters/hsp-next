import { Fragment } from 'react';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import { renderBlock } from '@lib/block';
import {
  getGlobalOptions,
  getCategoriesAndMakesAndModels,
  getMainProductCategory,
  getMake,
  getProductsByCategoriesSlugs,
  getStores,
} from '@lib/api';
import PageClientSidePartial from './page-client-side-partial';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import BreadcrumbsProduct from '@components/breadcrumbs-product';
import ErrorPage from '@components/error-page';
import PageContainer from '@components/page-container/page-container';
import styles from './page.module.scss';

export default async function CategoryPage({ params, searchParams }) {
  const globalOptions = await getGlobalOptions();
  const enquiryFormId = globalOptions?.enquiryFormId;
  const downloadFileFormId = globalOptions?.downloadFileFormId;
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

  const allLocations = await getStores();

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

  return (
    <Layout title="Product">
      <Container>
        <div className={styles.breadcrumbs}>
          <BreadcrumbsProduct
            currentProduct={currentProduct}
            categories={categories}
          />
        </div>
        <PageClientSidePartial
          mainCategory={mainCategory}
          make={make}
          enquiryFormId={enquiryFormId}
          firstMatchedProduct={firstMatchedProduct}
          variantSlug={searchParams.variant}
          allLocations={allLocations}
          productHeroData={productHeroData}
          downloadFileFormId={downloadFileFormId}
          pageParams={params}
        />
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
