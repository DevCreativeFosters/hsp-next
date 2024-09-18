import { Fragment } from 'react';

import { notFound } from 'next/navigation';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import getProductCategoriesToExclude from '@lib/api/get-pdp-categories-to-exclude';
import { renderBlock } from '@lib/block';
import { getExcludeTree } from '@lib/helpers';
import { shouldBeExcluded } from '@lib/helpers';
import formatCategories from '@lib/normalize-product-breadcrumbs';

import BreadcrumbsProduct from '@components/breadcrumbs-product';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';

export default async function ProductHeroPage({ children, params, slug }) {
  const categoryData = await getMainProductCategory(slug);
  const mainCategoryDetails = categoryData?.mainCategoryDetails;
  const featuredImage = mainCategoryDetails?.featuredImage?.node;
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
      label: categoryData.name,
      value: slug,
    },
  };

  const categoryMakesAndModels = await getCategoriesMakesAndModels();
  const categories = formatCategories(categoryMakesAndModels);

  return (
    <Layout title="Product">
      <Container>
        <BreadcrumbsProduct
          categories={categories}
          currentProduct={currentProduct}
          mainCategory={true}
        />
        <ProductHero
          customTitle={{
            slogan: mainCategoryDetails?.slogan,
            title: mainCategoryDetails?.title,
          }}
          description={categoryData?.description}
          features={{
            content: mainCategoryDetails?.features,
            title: mainCategoryDetails?.featuresTitle,
          }}
          image={featuredImage}
          title={categoryData?.name}
          warranty={{
            content: mainCategoryDetails?.warranty.warrantyDescription,
            title: mainCategoryDetails?.warranty.warrantyTitle,
            years: mainCategoryDetails?.warranty.warrantyTimePeriod,
          }}
        />
        {children}
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
