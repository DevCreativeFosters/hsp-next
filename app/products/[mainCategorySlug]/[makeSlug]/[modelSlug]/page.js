import { StoreLocatorProvider } from '@contexts/store-locator';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import ProductTabs from '@components/product-tabs/product-tabs';
import EnquiryForm from 'components/enquiry-form/enquiry-form';
import BreadcrumbsProduct from '@components/breadcrumbs-product';
import formatCategories from '@lib/normalize-product-breadcrumbs';
import {
  getCategoriesAndMakesAndModels,
  getMainProductCategory,
  getMake,
  getProductsByCategoriesSlugs,
} from '@lib/api';
import styles from './page.module.scss';

export default async function CategoryPage({ params }) {
  const mainCategorySlug = params.mainCategorySlug;
  const makeSlug = params.makeSlug;
  const modelSlug = params.modelSlug;
  const mainCategory = await getMainProductCategory(mainCategorySlug);
  const make = await getMake(makeSlug);
  const products = await getProductsByCategoriesSlugs(
    mainCategorySlug,
    makeSlug,
    modelSlug,
  );
  const firstMatchedProduct = products.length ? products[0] : null;

  const currentProduct = {
    mainCategory: {
      label: mainCategory.name,
      value: mainCategorySlug,
    },
    make: {
      label: make.name,
      value: makeSlug,
    },
    model: {
      label: firstMatchedProduct?.title,
      value: modelSlug,
    },
  };

  const categoryMakesAndModels = await getCategoriesAndMakesAndModels();
  const categories = formatCategories(categoryMakesAndModels);

  if (!firstMatchedProduct) {
    return (
      <Layout title="Product">
        <Container>No product found.</Container>
      </Layout>
    );
  }

  const images = firstMatchedProduct?.productFields?.images?.map(
    (item, index) => {
      return {
        sourceUrl: item.image.mediaItemUrl,
        alt: index === 0 ? 'mainImage' : '',
        mainImage: index === 0,
      };
    },
  );

  return (
    <Layout title="Product">
      <Container>
        <div className={styles.breadcrumbs}>
          <BreadcrumbsProduct
            currentProduct={currentProduct}
            categories={categories}
          />
        </div>
        <div className={styles.header}>
          <ProductImageCarousel images={images} />
          <div className={styles.details}>
            <h1 className={styles.name}>
              {mainCategory.name} <br />
              <span className={styles.variant}>
                {make.name} {firstMatchedProduct?.title}
              </span>
            </h1>
            {firstMatchedProduct?.productFields.description && (
              <p className={styles.description}>
                {firstMatchedProduct?.productFields.description}
              </p>
            )}
          </div>
        </div>

        <StoreLocatorProvider>
          <EnquiryForm />
        </StoreLocatorProvider>

        <ProductTabs
          featuresDescription={
            firstMatchedProduct?.productFields.featuresDescription
          }
          featuresBoxes={firstMatchedProduct?.productFields.featuresBoxes}
          specificationDescription={
            firstMatchedProduct?.productFields.specificationDescription
          }
          specificationContent={
            firstMatchedProduct?.productFields.specification
          }
        />
      </Container>
    </Layout>
  );
}
