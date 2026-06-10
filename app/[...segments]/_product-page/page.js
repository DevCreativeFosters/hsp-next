import { Fragment } from 'react';

import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import { getMake } from '@lib/api/get-make';
import { getMakeModelSeo } from '@lib/api/get-make-model-seo';
import getProductCategoriesToExclude from '@lib/api/get-pdp-categories-to-exclude';
import { resolvePreview } from '@lib/api/get-post-type-preview';
import { getProductPreview } from '@lib/api/get-product-preview';
import { getProductPricing } from '@lib/api/get-product-pricing';
import { getProductSeo } from '@lib/api/get-product-seo';
import { getProductsByCategoriesSlugs } from '@lib/api/get-products-by-categories-slugs';
import { getStores } from '@lib/api/get-stores';
import { renderBlock } from '@lib/block';
import { prepareSchemas } from '@lib/prepare-schemas';
import { metadata } from '@lib/seo';

import BreadcrumbsProduct from '@components/breadcrumbs-product';
import Container from '@components/container/container';
import ErrorPage from '@components/error-page';
import Layout from '@components/layout/layout';
import NotCompatible from '@components/not-compatible/not-compatible';
import PageContainer from '@components/page-container/page-container';
import ProductCompatibilityPopup from '@components/product-compatibility-popup';
import ProductHeroPage from '@components/product-hero-page/product-hero-page';

import PageClientSidePartial from './page-client-side-partial';
import styles from './page.module.scss';

export async function generateMetadata({ params }) {
  if (!params?.slug) {
    return;
  }

  const categorySlug = params.slug;
  const makeSlug = params.makeSlug;
  const modelSlug = params.modelSlug;

  let data = await getProductSeo(categorySlug, makeSlug, modelSlug);

  if (Object.keys(data).length === 0 && modelSlug && makeSlug) {
    data = await getMakeModelSeo(modelSlug);
  }

  return {
    ...metadata,
    ...data,
  };
}

export default async function Product({ params, searchParams }) {
  const { isEnabled: isDraftEnabled } = draftMode();
  const hasMakeAndModel = !!params.makeSlug;
  const isWithoutMakeAndModel = !hasMakeAndModel;
  let firstMatchedProduct = null;
  let modelSlug = params.modelSlug;
  let variantSlug = params.variantSlug;

  // TODO: draft related logic is not implemented for products without make and model
  if (hasMakeAndModel && isDraftEnabled) {
    const [model, id] = decodeURIComponent(modelSlug).split(':');
    const [asPreview, databaseId] = await resolvePreview(id, true, 'product');

    modelSlug = [model];

    if (asPreview && databaseId) {
      firstMatchedProduct = await getProductPreview(databaseId);
    }
  }

  const globalOptions = await getGlobalOptions();
  const categoriesToExclude =
    await getProductCategoriesToExclude(globalOptions);
  const enquiryFormId = globalOptions?.enquiryFormId;
  const downloadFileFormId = globalOptions?.downloadFileFormId;
  const slug = params.slug;
  const makeSlug = params.makeSlug;
  const mainCategory = await getMainProductCategory(slug);
  const mainCategoryDetails = mainCategory?.mainCategoryDetails;
  const make = hasMakeAndModel ? await getMake(makeSlug) : null;
  const makes = hasMakeAndModel ? await getAllMakes() : null;
  const details = make?.detailsFields?.details;
  const filteredData = details?.filter(
    data => data.relatedProductCategory?.[0]?.slug === slug,
  );

  if (mainCategory && categoriesToExclude.includes(slug)) {
    return notFound();
  }

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

  const productPricing = firstMatchedProduct?.databaseId
    ? await getProductPricing(firstMatchedProduct.databaseId)
    : null;

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
      isWithoutMakeAndModel,
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

  modelName = modelName || firstMatchedProduct?.title;

  if (!firstMatchedProduct || !mainCategory || (hasMakeAndModel && !make)) {
    return (
      <ProductHeroPage
        isWithoutMakeAndModel={isWithoutMakeAndModel}
        params={params}
        slug={slug}
      >
        <NotCompatible slug={slug} />
      </ProductHeroPage>
    );
  }

  if (variantSlug) {
    const variantExists =
      firstMatchedProduct?.productFields?.variants?.find(
        variant =>
          variant.variantSlug.toLocaleLowerCase() === variantSlug.toLowerCase(),
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
    <Layout
      isProductPageWithoutMakeAndModel={isWithoutMakeAndModel}
      title="Product"
    >
      {prepareSchemas(firstMatchedProduct?.schemaProSchemas)}
      <Container>
        <div className={styles.breadcrumbs}>
          <BreadcrumbsProduct
            currentProduct={currentProduct}
            showFullOnMobile={true}
          />
        </div>
        <ProductCompatibilityPopup />
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
          productPricing={productPricing}
          variantSlug={variantSlug}
        />
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
