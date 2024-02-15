// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)
'use client';

import routes from '@lib/routes';
import { trimSlash } from '@lib/trim-slash';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { StoreLocatorProvider } from '@contexts/store-locator';
import EnquiryForm from '@components/enquiry-form/enquiry-form';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import ContentBox from '@components/content-box/content-box';
import ProductTabs from '@components/product-tabs/product-tabs';
import styles from './page.module.scss';

const getVariantDataOrFallbackToParent = (variant, parent, property) => {
  if (variant && variant.variantDetails[property]) {
    return variant.variantDetails[property];
  } else if (variant && variant.parentInherit) {
    return parent.productFields[property];
  }
  return null;
};

const getVariantDataForProperties = (variant, parent, properties) =>
  properties.reduce((acc, property) => {
    acc[property] = getVariantDataOrFallbackToParent(variant, parent, property);
    return acc;
  }, {});

export default function PageClientSidePartial({
  mainCategory,
  make,
  enquiryFormId,
  firstMatchedProduct,
  allLocations,
  productHeroData,
  downloadFileFormId,
  pageParams,
  variantSlug,
}) {
  const productVariants = firstMatchedProduct?.productFields.variants;
  const variant =
    productVariants.find(
      ({ variantSlug: slug }) => trimSlash(slug) === variantSlug,
    ) || productVariants[0];

  const properties = [
    'description',
    'warrantyTimePeriod',
    'warrantyDescription',
    'featuresDescription',
    'featuresBoxes',
    'specificationDescription',
    'specification',
    'manualsDescription',
  ];

  const variantData = getVariantDataForProperties(
    variant,
    firstMatchedProduct,
    properties,
  );

  const {
    description,
    warrantyTimePeriod,
    warrantyDescription,
    featuresDescription,
    featuresBoxes,
    specificationDescription,
    specification,
    manualsDescription,
  } = variantData;

  const manualPdfItems =
    variant?.variantDetails?.manualPdfItems?.length > 0
      ? variant.variantDetails.manualPdfItems.map(item => ({
          label: item?.manualPdf.title,
          url: item?.manualPdf.mediaItemUrl,
        }))
      : firstMatchedProduct?.productFields?.manualPdfItems?.map(item => ({
          label: item?.manualPdf.title,
          url: item?.manualPdf.mediaItemUrl,
        }));

  const carouselImages =
    variant?.variantDetails?.images?.length > 0
      ? variant.variantDetails.images.map((image, index) => ({
          sourceUrl: image?.mediaItemUrl,
          alt: image?.altText ? image?.altText : 'Product variant image',
          mainImage: index === 0,
        }))
      : firstMatchedProduct?.productFields?.images?.map((image, index) => ({
          sourceUrl: image?.mediaItemUrl,
          alt: image?.altText ? image?.altText : 'Main product image',
          mainImage: index === 0,
        }));

  const router = useRouter();

  const onVariantChange = useCallback(
    newVariantSlug => {
      const { mainCategorySlug, makeSlug, modelSlug } = pageParams;
      const newRoute = routes.product(
        mainCategorySlug,
        makeSlug,
        modelSlug,
        newVariantSlug,
      );
      router.push(newRoute);
    },
    [pageParams],
  );

  return (
    <>
      <div className={styles.header}>
        <ProductImageCarousel images={carouselImages} />
        <div className={styles.details}>
          <div className={styles.mainText}>
            <h1 className={styles.name}>
              {mainCategory.name} <br />
              <span className={styles.variant}>
                {make.name} {firstMatchedProduct?.title}
              </span>
            </h1>
            {variant?.sku && (
              <h5 className={styles.sku}>
                Part No. <span className={styles.redColor}>{variant.sku}</span>
              </h5>
            )}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <StoreLocatorProvider>
            <EnquiryForm
              enquiryFormId={enquiryFormId}
              productData={firstMatchedProduct}
              variantSlug={variantSlug}
              onVariantChange={onVariantChange}
              allLocations={allLocations}
            />
          </StoreLocatorProvider>
          {warrantyTimePeriod && (
            <ContentBox className={styles.warrantyDescription}>
              <h3 className={styles.contentBoxTitle}>
                Warranty{' '}
                {warrantyTimePeriod && (
                  <span className={styles.years}>
                    +{warrantyTimePeriod} years
                  </span>
                )}
              </h3>
              {warrantyDescription && <p>{warrantyDescription}</p>}
            </ContentBox>
          )}
        </div>
      </div>
      <ProductTabs
        featuresDescription={featuresDescription}
        featuresBoxes={featuresBoxes}
        specificationDescription={specificationDescription}
        specificationContent={specification}
        manualsDescription={manualsDescription}
        manualsLinks={manualPdfItems}
        downloadFileFormId={downloadFileFormId}
      />
    </>
  );
}
