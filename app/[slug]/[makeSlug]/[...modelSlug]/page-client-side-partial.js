// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)
'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import { StoreLocatorProvider } from '@contexts/store-locator';

import routes from '@lib/routes';
import { trimSlash } from '@lib/trim-slash';

import ContentBox from '@components/content-box/content-box';
import EnquiryForm from '@components/enquiry-form/enquiry-form';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import ProductTabs from '@components/product-tabs/product-tabs';

import styles from './page.module.scss';

// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)

// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)

// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)

// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)

// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)

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
  allLocations,
  downloadFileFormId,
  enquiryFormId,
  firstMatchedProduct,
  mainCategory,
  make,
  modelName,
  pageParams,
  variantSlug,
}) {
  const productVariants = firstMatchedProduct?.productFields.variants || [];
  const variant =
    productVariants.find(
      ({ variantSlug: slug }) => trimSlash(slug) === variantSlug,
    ) || productVariants?.[0];

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
    featuresBoxes,
    featuresDescription,
    manualsDescription,
    specification,
    specificationDescription,
    warrantyDescription,
    warrantyTimePeriod,
  } = variantData;

  const manualPdfItems =
    variant?.variantDetails.manualPdfItems?.length > 0
      ? variant.variantDetails.manualPdfItems.map(item => ({
          label: item?.manualPdf?.node?.title,
          url: item?.manualPdf?.node?.mediaItemUrl,
        }))
      : firstMatchedProduct?.productFields?.manualPdfItems?.map(item => ({
          label: item?.manualPdf?.node?.title,
          url: item?.manualPdf?.node?.mediaItemUrl,
        }));

  const carouselImages =
    variant?.variantDetails.images?.nodes?.length > 0
      ? variant.variantDetails?.images?.nodes?.map((image, index) => ({
          alt: image?.altText ? image?.altText : 'Product variant image',
          mainImage: index === 0,
          sourceUrl: image?.mediaItemUrl,
        }))
      : firstMatchedProduct?.productFields?.images?.nodes?.map(
          (image, index) => ({
            alt: image?.altText ? image?.altText : 'Main product image',
            mainImage: index === 0,
            sourceUrl: image?.mediaItemUrl,
          }),
        );

  const router = useRouter();

  const onVariantChange = useCallback(
    newVariantSlug => {
      const { makeSlug, modelSlug, slug } = pageParams;
      const newRoute = routes.product(
        slug,
        makeSlug,
        modelSlug[0],
        newVariantSlug,
      );

      router.push(newRoute);
    },
    [pageParams, router],
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
                {make.name} {modelName}
              </span>
            </h1>
            {variant?.sku && (
              <div className={styles.sku}>
                Part No. <span className={styles.redColor}>{variant.sku}</span>
              </div>
            )}
            {description && <p className={styles.description}>{description}</p>}
          </div>
          <StoreLocatorProvider>
            <EnquiryForm
              allLocations={allLocations}
              enquiryFormId={enquiryFormId}
              onVariantChange={onVariantChange}
              productData={firstMatchedProduct}
              variantSlug={variantSlug}
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
        downloadFileFormId={downloadFileFormId}
        featuresBoxes={featuresBoxes}
        featuresDescription={featuresDescription}
        manualsDescription={manualsDescription}
        manualsLinks={manualPdfItems}
        specificationContent={specification}
        specificationDescription={specificationDescription}
      />
    </>
  );
}
