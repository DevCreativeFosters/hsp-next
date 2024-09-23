import { Fragment, Suspense } from 'react';

import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import { getMake } from '@lib/api/get-make';
import { getMakeModelSeo } from '@lib/api/get-make-model-seo';
import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';
import { getExcludeTree, shouldBeExcluded } from '@lib/helpers';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import { metadata } from '@lib/seo';

import BreadcrumbsProduct from '@components/breadcrumbs-product';
import Container from '@components/container/container';
import ContentBlocksPage from '@components/content-blocks-page/content-blocks-page';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';
import ProductNotFound from '@components/product-not-found/product-not-found';

import styles from '../page.module.scss';

export async function generateMetadata({ params }) {
  if (!params?.makeSlug) {
    return;
  }

  const makeSlug = params.makeSlug;
  const data = await getMakeModelSeo(makeSlug);
  const makeData = await getMake(makeSlug);
  const details = makeData?.detailsFields?.details;
  const filteredData = details?.filter(
    data => data.relatedProductCategory?.nodes[0]?.slug === params.slug,
  );

  const seo = {
    description:
      (filteredData?.length >= 1 && filteredData[0]?.seo?.description) || null,
    title: (filteredData?.length >= 1 && filteredData[0]?.seo?.title) || null,
  };

  return {
    ...metadata,
    ...data,
    description: seo.description || metadata?.description || data?.description,
    openGraph: {
      ...data.openGraph,
      description:
        seo.description ||
        metadata?.openGraph?.description ||
        data?.openGraph?.description,
      title: seo.title || metadata?.openGraph?.title || data?.openGraph?.title,
    },
    title: seo.title || metadata?.title || data?.title,
  };
}

export default async function CategoryPage({ params }) {
  const slug = params.slug;
  const categoryData = await getMainProductCategory(slug);
  const mainCategoryDetails = categoryData?.mainCategoryDetails;
  const featuredImage = mainCategoryDetails?.featuredImage?.node;
  const blocks = await getMainProductCategoryBlocks(slug);
  const makes = await getAllMakes();
  const contentBlocks = await Promise.all(
    blocks?.flexibleContent?.blocks?.map(block =>
      renderBlock(block, makes, [], params),
    ) || [],
  );
  const makeSlug = params.makeSlug;
  const makeData = await getMake(makeSlug);
  const mainCategory = await getMainProductCategory(slug);
  const details = makeData?.detailsFields?.details;
  const globalOptions = await getGlobalOptions();
  const excludeTree = getExcludeTree(globalOptions);
  const isExcluded = shouldBeExcluded(excludeTree, categoryData);

  const { isEnabled: isDraftEnabled } = draftMode();
  const content = await getPageData(`${slug}/${makeSlug}`, isDraftEnabled);
  const parent = content?.parent;
  const flexibleContentBlocks = content?.flexibleContent?.blocks;
  const title = content?.title;
  const pageContent = content?.content;
  const isMainCategoryEmpty = Object.keys(mainCategory).length === 0;
  const isMakeDataEmpty = !makeData || Object.keys(makeData).length === 0;
  const isFlexibleContentEmpty =
    !flexibleContentBlocks || flexibleContentBlocks.length === 0;

  if (isMainCategoryEmpty && !isMakeDataEmpty) {
    return notFound();
  }

  if (isMainCategoryEmpty && isMakeDataEmpty && !parent) {
    return notFound();
  }

  if (
    isMainCategoryEmpty &&
    isMakeDataEmpty &&
    flexibleContentBlocks === undefined
  ) {
    return notFound();
  }

  if (!isMainCategoryEmpty && isMakeDataEmpty && isFlexibleContentEmpty) {
    return notFound();
  }

  if (pageContent || flexibleContentBlocks) {
    const contentBlocks = await Promise.all(
      flexibleContentBlocks?.map(renderBlock) || [],
    );
    return (
      <ContentBlocksPage
        blocks={contentBlocks}
        pageContent={pageContent}
        title={title}
      />
    );
  }

  if (!categoryData || isExcluded) {
    return notFound();
  }

  if (categoryData && !makeData && !isExcluded) {
    return <ProductNotFound />;
  }

  if (!categoryData || !makeData) {
    return notFound();
  }

  const filteredData = details?.filter(
    data => data.relatedProductCategory?.nodes[0]?.slug === slug,
  );

  const customTitle = {
    slogan:
      (filteredData?.length >= 1 && filteredData[0]?.productTitle) || null,
    title: (filteredData?.length >= 1 && filteredData[0]?.makeTitle) || null,
  };

  const makeContentBlocks = await Promise.all(
    (filteredData?.length >= 1 &&
      filteredData[0]?.flexibleContentBlocks?.blocks?.map(block =>
        renderBlock(block, makes, [], params),
      )) ||
      [],
  );

  const productHeroData = {
    features:
      filteredData?.length >= 1
        ? filteredData[0]?.features
        : mainCategoryDetails?.features,
    featuresTitle:
      filteredData?.length >= 1 ? filteredData[0].featuresTitle : 'Features',
    image:
      filteredData?.length >= 1
        ? filteredData[0].featuredImage?.node
        : featuredImage,
    warrantyDescription:
      filteredData?.length >= 1
        ? filteredData[0]?.warranty.warrantyDescription
        : mainCategoryDetails?.warranty.warrantyDescription,
    warrantyTimePeriod:
      filteredData?.length >= 1
        ? filteredData[0]?.warranty.warrantyTimePeriod
        : mainCategoryDetails?.warranty.warrantyTimePeriod,
    warrantyTitle:
      filteredData?.length >= 1
        ? filteredData[0].warranty.warrantyTitle
        : 'Warranty',
  };

  const currentProduct = {
    mainCategory: {
      label: mainCategory.name,
      value: slug,
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

  const categoryMakesAndModels = await getCategoriesMakesAndModels();
  const categories = formatCategories(categoryMakesAndModels);

  return (
    <Layout title="Product">
      <Container>
        <Suspense fallback={null}>
          <div className={styles.breadcrumbs}>
            <BreadcrumbsProduct
              categories={categories}
              currentProduct={currentProduct}
            />
          </div>
          <ProductHero
            customTitle={
              filteredData?.length >= 1 &&
              (filteredData[0]?.productTitle || filteredData[0]?.makeTitle)
                ? customTitle
                : null
            }
            description={makeData?.description || categoryData?.description}
            features={{
              content: productHeroData.features,
              title: productHeroData.featuresTitle,
            }}
            image={productHeroData.image}
            make={makeData.name}
            title={categoryData?.name}
            warranty={{
              content: productHeroData.warrantyDescription,
              title: productHeroData.warrantyTitle,
              years: productHeroData.warrantyTimePeriod,
            }}
          />
        </Suspense>
      </Container>
      {makeContentBlocks.length >= 1
        ? makeContentBlocks?.map((contentBlock, index) => (
            <Fragment key={index}>{contentBlock}</Fragment>
          ))
        : contentBlocks?.map((contentBlock, index) => (
            <Fragment key={index}>{contentBlock}</Fragment>
          ))}
    </Layout>
  );
}

export async function generateStaticParams() {
  return [];
}
