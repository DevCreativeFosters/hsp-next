import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { renderBlock } from '@lib/block';
import { getAllMakes } from '@lib/api/get-all-makes';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getMake } from '@lib/api/get-make';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import { getExcludeTree } from '@lib/helpers';
import { getGlobalOptions } from '@lib/api/get-global-options';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';
import BreadcrumbsProduct from '@components/breadcrumbs-product';
import ProductNotFound from '@components/product-not-found/product-not-found';
import styles from '../page.module.scss';

export default async function CategoryPage({ params }) {
  const slug = params.slug;
  const categoryData = await getMainProductCategory(slug);
  const mainCategoryDetails = categoryData?.mainCategoryDetails;
  const featuredImage = mainCategoryDetails?.featuredImage?.node;
  const blocks = await getMainProductCategoryBlocks(slug);
  const makes = await getAllMakes();
  const contentBlocks = blocks?.flexibleContent?.blocks?.map(block =>
    renderBlock(block, makes, [], params),
  );
  const makeSlug = params.makeSlug;
  const makeData = await getMake(makeSlug);
  const mainCategory = await getMainProductCategory(slug);
  const details = makeData?.detailsFields.details;
  const globalOptions = await getGlobalOptions();
  const excludeTree = getExcludeTree(globalOptions);
  const shouldBeExcluded = excludeTree.includes(categoryData?.databaseId);

  if (!makeData && categoryData && !shouldBeExcluded) {
    return <ProductNotFound />;
  }

  if (!makeData || !categoryData || shouldBeExcluded) {
    return notFound();
  }

  const filteredData = details?.filter(
    data => data.relatedProductCategory?.[0]?.slug === slug,
  );
  const productHeroData = {
    image:
      filteredData?.length > 1
        ? filteredData[0].featuredImage?.node
        : featuredImage,
    features:
      filteredData?.length > 1
        ? filteredData[0]?.features
        : mainCategoryDetails?.features,
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
        <div className={styles.breadcrumbs}>
          <BreadcrumbsProduct
            currentProduct={currentProduct}
            categories={categories}
          />
        </div>
        <ProductHero
          make={makeData.name}
          title={categoryData?.name}
          description={makeData?.description || categoryData?.description}
          image={productHeroData.image}
          features={{
            content: productHeroData.features,
          }}
          warranty={{
            content: productHeroData.warrantyDescription,
            years: productHeroData.warrantyTimePeriod,
          }}
        />
      </Container>
      {contentBlocks?.map((contentBlock, index) => (
        <Fragment key={index}>{contentBlock}</Fragment>
      ))}
    </Layout>
  );
}
