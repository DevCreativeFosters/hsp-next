import { Fragment } from 'react';

import { notFound } from 'next/navigation';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import getProductCategoriesToExclude from '@lib/api/get-pdp-categories-to-exclude';
import { renderBlock } from '@lib/block';
import { getExcludeTree } from '@lib/helpers';
import { shouldBeExcluded } from '@lib/helpers';

import BreadcrumbsProduct from '@components/breadcrumbs-product';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductCompatibilityPopup from '@components/product-compatibility-popup';
import ProductHero from '@components/product-hero';

export default async function ProductHeroPage({
  children,
  isWithoutMakeAndModel,
  params,
  slug,
}) {
  const categoryData = await getMainProductCategory(slug);
  const mainCategoryDetails = categoryData?.mainCategoryDetails;
  const featuredImage = mainCategoryDetails?.featuredImage?.node;
  const featuredImageMobile = mainCategoryDetails?.featuredImageMobile?.node;
  const makes = await getAllMakes();

  const globalOptions = await getGlobalOptions();
  const categoriesToExclude =
    await getProductCategoriesToExclude(globalOptions);

  const excludeTree = getExcludeTree(globalOptions);
  const isExcluded = shouldBeExcluded(excludeTree, categoryData);

  if (categoryData && categoriesToExclude.includes(slug)) {
    return notFound();
  }

  if (!categoryData || Object.keys(categoryData).length === 0 || isExcluded) {
    return notFound();
  }

  const blocks = await getMainProductCategoryBlocks(slug);
  const contentBlocks = await Promise.all(
    blocks?.flexibleContent?.blocks?.map(block =>
      renderBlock(block, makes, [], params),
    ) || [],
  );

  const currentProduct = {
    mainCategory: {
      isWithoutMakeAndModel,
      label: categoryData.name,
      value: slug,
    },
  };

  return (
    <Layout title="Product">
      <Container>
        <BreadcrumbsProduct currentProduct={currentProduct} />
        <ProductCompatibilityPopup />
        <ProductHero
          customTitle={{
            slogan: mainCategoryDetails?.slogan,
            title: mainCategoryDetails?.title,
          }}
          description={categoryData?.description}
          image={featuredImage}
          mobileImage={featuredImageMobile}
          title={categoryData?.name}
        />
        {children}
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
