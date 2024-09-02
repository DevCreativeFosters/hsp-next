import { Fragment } from 'react';

import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import { getMake } from '@lib/api/get-make';
import { getMakeModelSeo } from '@lib/api/get-make-model-seo';
import { resolvePreview } from '@lib/api/get-post-type-preview';
import { getProductPreview } from '@lib/api/get-product-preview';
import { getProductsByCategoriesSlugs } from '@lib/api/get-products-by-categories-slugs';
import { getStores } from '@lib/api/get-stores';
import { renderBlock } from '@lib/block';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import { metadata } from '@lib/seo';

import BreadcrumbsProduct from '@components/breadcrumbs-product';
import Container from '@components/container/container';
import ErrorPage from '@components/error-page';
import Layout from '@components/layout/layout';
import NotCompatible from '@components/not-compatible/not-compatible';
import PageContainer from '@components/page-container/page-container';
import ProductHeroPage from '@components/product-hero-page/product-hero-page';

import PageClientSidePartial from './page-client-side-partial';
import styles from './page.module.scss';

export async function generateMetadata({ params }) {
  if (!params?.modelSlug) {
    return;
  }

  const modelSlug = params.modelSlug[0];

  const data = await getMakeModelSeo(modelSlug);

  return {
    ...metadata,
    ...data,
  };
}

export default async function Product({ params, searchParams }) {
  const { isEnabled: isDraftEnabled } = draftMode();
  let firstMatchedProduct = null;
  let modelSlug = params.modelSlug;

  if (isDraftEnabled) {
    const [model, id] = decodeURIComponent(modelSlug[0]).split(':');
    const [asPreview, databaseId] = await resolvePreview(id, true, 'product');

    modelSlug = [model];

    if (asPreview && databaseId) {
      firstMatchedProduct = await getProductPreview(databaseId);
    }
  }

  const globalOptions = await getGlobalOptions();
  const enquiryFormId = globalOptions?.enquiryFormId;
  const downloadFileFormId = globalOptions?.downloadFileFormId;
  const slug = params.slug;
  const makeSlug = params.makeSlug;
  const mainCategory = await getMainProductCategory(slug);
  const mainCategoryDetails = mainCategory?.mainCategoryDetails;
  const make = await getMake(makeSlug);
  const makes = await getAllMakes();
  const details = make?.detailsFields?.details;
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

  let products;

  if (isDraftEnabled && firstMatchedProduct) {
    products = [firstMatchedProduct];
  } else {
    products = await getProductsByCategoriesSlugs(slug, makeSlug, modelSlug);
    firstMatchedProduct = products.length ? products[0] : null;
  }

  const mainCategoryBlocks = await getMainProductCategoryBlocks(slug);
  const mainCategoryContentBlocks = mainCategoryBlocks?.flexibleContent?.blocks;

  const contentBlocks = await Promise.all(
    firstMatchedProduct?.flexibleContent?.blocks?.map(block =>
      renderBlock(
        block,
        makes,
        firstMatchedProduct.productFields.variants,
        params,
        mainCategoryContentBlocks,
      ),
    ) || [],
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
      value: modelSlug,
    },
  };

  const categoryMakesAndModels = await getCategoriesMakesAndModels();
  const categories = formatCategories(categoryMakesAndModels);
  modelName = modelName || firstMatchedProduct?.title;
  const showNotCompatible = false;

  if (!firstMatchedProduct || !mainCategory || !make) {
    return (
      <ProductHeroPage params={params} slug={slug}>
        <NotCompatible slug={slug} />
      </ProductHeroPage>
    );
  }

  if (modelSlug.length > 2) {
    return notFound();
  }

  if (modelSlug.length === 2) {
    const variantExists =
      firstMatchedProduct?.productFields?.variants?.find(
        ({ variantSlug }) =>
          variantSlug.toLocaleLowerCase() === modelSlug[1].toLowerCase(),
      ) || false;

    if (!variantExists) {
      return (
        <Layout title="Product" withMap>
          <Container>
            <PageContainer>
              <ErrorPage
                buttonText="Back to Products"
                product
                text="Sorry, we couldn't find the variant you are looking for."
                title="Variant not found"
              />
            </PageContainer>
          </Container>
        </Layout>
      );
    }
  }

  return (
    <Layout title="Product">
      <Container>
        <div className={styles.breadcrumbs}>
          <BreadcrumbsProduct
            categories={categories}
            currentProduct={currentProduct}
            showNotCompatible={showNotCompatible}
          />
        </div>
        <PageClientSidePartial
          allLocations={allLocations}
          downloadFileFormId={downloadFileFormId}
          enquiryFormId={enquiryFormId}
          firstMatchedProduct={firstMatchedProduct}
          mainCategory={mainCategory}
          make={make}
          modelName={modelName}
          pageParams={params}
          productHeroData={productHeroData}
          variantSlug={modelSlug[1]}
        />
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}

export async function generateStaticParams() {
  return [];
}
