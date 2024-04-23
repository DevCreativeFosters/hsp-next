import { Fragment } from 'react';

import { notFound } from 'next/navigation';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import { renderBlock } from '@lib/block';
import { getExcludeTree } from '@lib/helpers';
import formatCategories from '@lib/normalize-product-breadcrumbs';

import BreadcrumbsProduct from '@components/breadcrumbs-product';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';

import styles from './product-hero-page.module.scss';

export default async function ProductHeroPage({ children, params, slug }) {
  const categoryData = await getMainProductCategory(slug);
  const mainCategoryDetails = categoryData?.mainCategoryDetails;
  const featuredImage = mainCategoryDetails?.featuredImage?.node;
  const makes = await getAllMakes();

  const globalOptions = await getGlobalOptions();
  const excludeTree = getExcludeTree(globalOptions);
  const shouldBeExcluded = excludeTree.includes(categoryData?.databaseId);

  if (!categoryData || shouldBeExcluded) {
    return notFound();
  }

  const blocks = await getMainProductCategoryBlocks(slug);
  const contentBlocks = blocks?.flexibleContent?.blocks?.map(block =>
    renderBlock(block, makes, [], params),
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
        <div className={styles.breadcrumbs}>
          <BreadcrumbsProduct
            categories={categories}
            currentProduct={currentProduct}
            mainCategory={true}
          />
        </div>
        <ProductHero
          description={categoryData?.description}
          features={{
            content: mainCategoryDetails?.features,
          }}
          image={featuredImage}
          title={categoryData?.name}
          warranty={{
            content: mainCategoryDetails?.warranty.warrantyDescription,
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
