import { Fragment } from 'react';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import { renderBlock } from '@lib/block';
import { getCategoriesMakesAndModels } from '@lib/api/get-categories-makes-and-models';
import { getMainProductCategory } from '@lib/api/get-main-product-category';
import { getMainProductCategoryBlocks } from '@lib/api/get-main-product-category-blocks';
import { getGlobalOptions } from '@lib/api/get-global-options';
import { getAllMakes } from '@lib/api/get-all-makes';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductHero from '@components/product-hero';
import BreadcrumbsProduct from '@components/breadcrumbs-product';
import PageContainer from '@components/page-container/page-container';
import ErrorPage from '@components/error-page';
import styles from './page.module.scss';

export default async function MainCategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const categoryData = await getMainProductCategory(mainCategorySlug);
  const mainCategoryDetails = categoryData?.mainCategoryDetails;
  const featuredImage = mainCategoryDetails?.featuredImage?.node;
  const makes = await getAllMakes();

  const globalOptions = await getGlobalOptions();
  const excludeTree = [];

  if (globalOptions?.coversCategory?.databaseId) {
    excludeTree.push(globalOptions.coversCategory.databaseId);
  }

  if (globalOptions?.compatibleFactoryOptions?.databaseId) {
    excludeTree.push(globalOptions.compatibleFactoryOptions.databaseId);
  }

  const shouldBeExcluded = excludeTree.includes(
    categoryData?.parent?.node?.databaseId,
  );

  if (!categoryData || shouldBeExcluded) {
    return (
      <Layout title="Product" withMap>
        <Container>
          <PageContainer>
            <ErrorPage
              title="Product not found"
              text="Sorry, we couldn't find the product you are looking for."
              buttonText="Back to Products"
              product
            />
          </PageContainer>
        </Container>
      </Layout>
    );
  }

  const blocks = await getMainProductCategoryBlocks(mainCategorySlug);
  const contentBlocks = blocks?.flexibleContent?.blocks?.map(block =>
    renderBlock(block, makes, [], params),
  );
  const currentProduct = {
    mainCategory: {
      label: categoryData.name,
      value: mainCategorySlug,
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
