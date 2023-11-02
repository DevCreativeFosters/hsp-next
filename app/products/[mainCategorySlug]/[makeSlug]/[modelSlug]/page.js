import { StoreLocatorProvider } from '@contexts/store-locator';
import Breadcrumbs from '@components/breadcrumbs/breadcrumbs';
import Container from '@components/container/container';
import Layout from '@components/layout/layout';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import ProductTabs from '@components/product-tabs/product-tabs';
import EnquiryForm from 'components/enquiry-form/enquiry-form';
import {
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

  if (!firstMatchedProduct) {
    return (
      <Layout title="Product">
        <Container>No product found.</Container>
      </Layout>
    );
  }

  const images = firstMatchedProduct?.productFields.images.map(
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
        <Breadcrumbs
          withContainer={true}
          items={[
            {
              label: 'Product',
              url: '/',
            },
            {},
          ]}
        />
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
