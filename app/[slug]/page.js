import { Fragment } from 'react';

import { notFound } from 'next/navigation';

import { getAllMakes } from '@lib/api/get-all-makes';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import { getPageData } from '@lib/api/get-page-data';
import { renderBlock } from '@lib/block';
import { getExcludeTree } from '@lib/helpers';
import formatCategories from '@lib/normalize-product-breadcrumbs';

import BreadcrumbsProduct from '@components/breadcrumbs-product';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';
import Wysiwyg from '@components/wysiwyg/wysiwyg';

import styles from './page.module.scss';

export default async function DynamicPage({ params }) {
  const slug = params.slug;
  const content = await getPageData(params?.slug);
  let contentBlocks = content?.flexibleContent?.blocks?.map(renderBlock);
  const title = content?.title;
  const pageContent = content?.content;

  if (pageContent || contentBlocks) {
    return (
      <Layout withMap>
        {pageContent && (
          <Container className={styles.container}>
            {title && <h1>{title}</h1>}
            {pageContent && <Wysiwyg content={pageContent} />}
          </Container>
        )}
        {contentBlocks && contentBlocks?.map(contentBlock => contentBlock)}
      </Layout>
    );
  }

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
  contentBlocks = blocks?.flexibleContent?.blocks?.map(block =>
    renderBlock(block, makes, [], params),
  );
  const currentProduct = {
    mainCategory: {
      label: categoryData.name,
      value: slug,
    },
    make: {
      label: '',
      value: '',
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
        <div className={styles.breadcrumbs}>
          <BreadcrumbsProduct
            mainCategory={true}
            currentProduct={currentProduct}
            categories={categories}
          />
        </div>
        <ProductHero
          title={categoryData?.name}
          description={categoryData?.description}
          image={featuredImage}
          features={{
            content: mainCategoryDetails?.features,
          }}
          warranty={{
            content: mainCategoryDetails?.warranty.warrantyDescription,
            years: mainCategoryDetails?.warranty.warrantyTimePeriod,
          }}
        />
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
