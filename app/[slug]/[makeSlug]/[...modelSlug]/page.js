import { Fragment } from 'react';
import { notFound, redirect } from 'next/navigation';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import { renderBlock } from '@lib/block';
import { getStores } from '@lib/api/get-stores';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getProductsByCategoriesSlugs } from '@lib/api/get-products-by-categories-slugs';
import { getMake } from '@lib/api/get-make';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getAllMakes } from '@lib/api/get-all-makes';
import { getExcludeTree } from '@lib/helpers';
import PageClientSidePartial from './page-client-side-partial';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import BreadcrumbsProduct from '@components/breadcrumbs-product';
import PageContainer from '@components/page-container/page-container';
import ErrorPage from '@components/error-page';
import styles from './page.module.scss';

export default async function CategoryPage({ params, searchParams }) {
  const globalOptions = await getGlobalOptions();
  const enquiryFormId = globalOptions?.enquiryFormId;
  const downloadFileFormId = globalOptions?.downloadFileFormId;
  const slug = params.slug;
  const makeSlug = params.makeSlug;
  const modelSlug = params.modelSlug; // array of model and optional variant
  const mainCategory = await getMainProductCategory(slug);
  const mainCategoryDetails = mainCategory?.mainCategoryDetails;
  const make = await getMake(makeSlug);
  const makes = await getAllMakes();
  const excludeTree = getExcludeTree(globalOptions);
  const shouldBeExcluded = excludeTree.includes(mainCategory?.databaseId);
  const details = make?.detailsFields.details;
  const filteredData = details?.filter(
    data => data.relatedProductCategory?.[0]?.slug === slug,
  );

  let modelName;
  makes?.some(make => {
    const model = make.models?.find(model => model.slug === modelSlug)?.name;

    if (model) {
      modelName = model;
      return true;
    }
  });

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
    slug,
    makeSlug,
    modelSlug,
  );

  const mainCategoryBlocks = await getMainProductCategoryBlocks(slug);
  const mainCategoryContentBlocks = mainCategoryBlocks?.flexibleContent?.blocks;

  const firstMatchedProduct = products.length ? products[0] : null;
  const contentBlocks = firstMatchedProduct?.flexibleContent?.blocks?.map(
    block =>
      renderBlock(
        block,
        makes,
        firstMatchedProduct.productFields.variants,
        params,
        mainCategoryContentBlocks,
      ),
  );
  const currentProduct = {
    mainCategory: {
      label: mainCategory?.name,
      value: slug,
    },
    make: {
      label: make?.name,
      value: makeSlug,
    },
    model: {
      label: firstMatchedProduct?.title,
      value: modelSlug[0],
    },
  };

  const categoryMakesAndModels = await getCategoriesMakesAndModels();
  const categories = formatCategories(categoryMakesAndModels);
  modelName = modelName || firstMatchedProduct?.title;

  if (!firstMatchedProduct || !mainCategory || !make) {
    redirect(`/${slug}?compatible=false`);
  }

  if (shouldBeExcluded) {
    return notFound();
  }

  if (!firstMatchedProduct || !mainCategory || !make || modelSlug.length > 2) {
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
          modelName={modelName}
          enquiryFormId={enquiryFormId}
          firstMatchedProduct={firstMatchedProduct}
          variantSlug={modelSlug[1]}
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
