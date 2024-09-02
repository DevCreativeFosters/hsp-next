import { Fragment, Suspense } from 'react';

import { notFound } from 'next/navigation';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import { getMake } from '@lib/api/get-make';
import { getMakeModelSeo } from '@lib/api/get-make-model-seo';
import { renderBlock } from '@lib/block';
import { getExcludeTree, shouldBeExcluded } from '@lib/helpers';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import { metadata } from '@lib/seo';

import BreadcrumbsProduct from '@components/breadcrumbs-product';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';
import ProductNotFound from '@components/product-not-found/product-not-found';

import styles from '../page.module.scss';

export async function generateMetadata({ params }) {
  if (!params?.makeSlug) {
    return;
  }

  const data = await getMakeModelSeo(params.makeSlug);

  return {
    ...metadata,
    ...data,
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
    data => data.relatedProductCategory?.[0]?.slug === slug,
  );
  const productHeroData = {
    features:
      filteredData?.length > 1
        ? filteredData[0]?.features
        : mainCategoryDetails?.features,
    image:
      filteredData?.length > 1
        ? filteredData[0].featuredImage?.node
        : featuredImage,
    warrantyDescription:
      filteredData?.length > 1
        ? filteredData[0]?.warranty.warrantyDescription
        : mainCategoryDetails?.warranty.warrantyDescription,
    warrantyTimePeriod:
      filteredData?.length > 1
        ? filteredData[0]?.warranty.warrantyTimePeriod
        : mainCategoryDetails?.warranty.warrantyTimePeriod,
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
            description={makeData?.description || categoryData?.description}
            features={{
              content: productHeroData.features,
            }}
            image={productHeroData.image}
            make={makeData.name}
            title={categoryData?.name}
            warranty={{
              content: productHeroData.warrantyDescription,
              years: productHeroData.warrantyTimePeriod,
            }}
          />
        </Suspense>
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
