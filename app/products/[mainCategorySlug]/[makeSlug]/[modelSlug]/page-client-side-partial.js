'use client';

import { useState } from 'react';
import { StoreLocatorProvider } from '@contexts/store-locator';
import EnquiryForm from '@components/enquiry-form/enquiry-form';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import ContentBox from '@components/content-box/content-box';
import ProductTabs from '@components/product-tabs/product-tabs';
import styles from './page.module.scss';

// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)
const properties = [
  'description',
  'featuresDescription',
  'featuresBoxes',
  'specificationDescription',
  'specification',
  'manualsDescription',
];

const getVariantDataOrFallbackToParent = (variant, parent, property) => {
  if (variant && variant.variantDetails[property]) {
    return variant.variantDetails[property];
  } else if (variant && variant.parentInherit) {
    return parent.productFields[property];
  }
  return null;
};

const getVariantDataForProperties = (variant, parent, properties) => {
  return properties.reduce((acc, property) => {
    acc[property] = getVariantDataOrFallbackToParent(variant, parent, property);
    return acc;
  }, {});
};

export default function PageClientSidePartial({
  mainCategory,
  make,
  enquiryFormId,
  firstMatchedProduct,
  allLocations,
  productHeroData,
  downloadFileFormId,
}) {
  const [variant, setVariant] = useState(
    firstMatchedProduct?.productFields.variants?.[0],
  );

  const variantData = getVariantDataForProperties(
    variant,
    firstMatchedProduct,
    properties,
  );

  const {
    description,
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
              onVariantChange={setVariant}
              allLocations={allLocations}
            />
          </StoreLocatorProvider>
          {(productHeroData.warrantyTimePeriod ||
            productHeroData.warrantyDescription) && (
            <div className={styles.warranty}>
              <ContentBox className={styles.warrantyDescription}>
                <h3 className={styles.contentBoxTitle}>
                  Warranty{' '}
                  {productHeroData.warrantyTimePeriod && (
                    <span className={styles.years}>
                      +{productHeroData.warrantyTimePeriod} years
                    </span>
                  )}
                </h3>
                {productHeroData.warrantyDescription && (
                  <p>{productHeroData.warrantyDescription}</p>
                )}
              </ContentBox>
            </div>
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
