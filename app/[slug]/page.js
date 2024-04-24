import { Fragment, Suspense } from 'react';

import { notFound } from 'next/navigation';

import { getAllMakes } from '@lib/api/get-all-makes';
import getAllPagesSlugs from '@lib/api/get-all-pages-slugs';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getMainProductCategories } from '@lib/api/get-main-product-categories';
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
        <Suspense fallback={null}>
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
        </Suspense>
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}

export async function generateStaticParams() {
  const globalOptions = await getGlobalOptions();
  const excludeTree = getExcludeTree(globalOptions);
  const excludeChildren = [globalOptions?.noCoverCategory?.nodes[0].databaseId];
  const parents = ['support'];

  let excludeSlugs = [
    'australian-made',
    'contact-us',
    'lifestyle',
    'hsp-blog',
    'hsp-celebrities',
    'hsp-tv',
    'products',
    'store-locator',
    'support',
    'ute-builder',
    'home',
  ];

  const mainProductCategories = await getMainProductCategories(
    excludeTree,
    excludeChildren,
  );

  const pages = await getAllPagesSlugs();

  const excludeChildPages = pages
    .filter(page => parents.includes(page.slug))
    .flatMap(page => page.children.nodes.map(child => child.slug));

  let slugs =
    mainProductCategories.flatMap(category =>
      category.children.nodes.map(child => ({ slug: `${child.slug}` })),
    ) || [];

  slugs = slugs.concat(
    pages
      .filter(page => !excludeSlugs.includes(page.slug))
      .filter(page => !excludeChildPages.includes(page.slug))
      .map(page => ({ slug: page.slug })),
  );

  return slugs;
}
