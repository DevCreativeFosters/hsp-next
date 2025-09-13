'use client';

import { useCallback, useMemo } from 'react';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { StoreLocatorProvider } from '@contexts/store-locator';

import routes from '@lib/routes';
import { trimSlash } from '@lib/trim-slash';

import Accordion from '@components/accordion/accordion';
import AccordionItem from '@components/accordion/accordion-item';
import EnquiryForm from '@components/enquiry-form/enquiry-form';
import ProductComboDeals from '@components/product-combo-deals/product-combo-deals';
import ProductImageCarousel from '@components/product-image-carousel/product-image-carousel';
import ProductTabs from '@components/product-tabs/product-tabs';

import styles from './page.module.scss';

// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)

const getVariantDataOrFallbackToParent = (variant, parent, property) => {
  if (variant && variant.variantDetails[property]) {
    return variant.variantDetails[property];
  } else if (variant && variant.parentInherit) {
    return parent.productFields[property];
  } else {
    return parent.productFields[property] || null;
  }
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
        modelSlug,
        newVariantSlug,
      );

      router.push(newRoute);
    },
    [pageParams, router],
  );

  const mainCategoryName = useMemo(() => {
    return mainCategory.name?.trim();
  }, [mainCategory]);

  const variantName = useMemo(() => {
    return `${make?.name || ''} ${modelName || ''}`.trim();
  }, [make, modelName]);

  return (
    <>
      <div className={styles.header}>
        <ProductImageCarousel images={carouselImages} />
        <div className={styles.details}>
          <div className={styles.meta}>
            <h1 className={clsx(styles.name, 'h2')}>
              {mainCategoryName} <br />
              {mainCategoryName !== variantName && (
                <span className={styles.variant}>{variantName}</span>
              )}
            </h1>
            {variant?.sku && (
              <div className={clsx(styles.sku, 'h5')}>
                Part No. <span className={styles.redColor}>{variant.sku}</span>
              </div>
            )}
          </div>
          <div className={styles.enquiryForm}>
            <StoreLocatorProvider>
              <EnquiryForm
                allLocations={allLocations}
                enquiryFormId={enquiryFormId}
                mainCategory={mainCategory}
                onVariantChange={onVariantChange}
                productData={firstMatchedProduct}
                variantSlug={variantSlug}
              />
            </StoreLocatorProvider>
          </div>
          <Accordion
            allowMultipleOpen
            className={clsx(styles.productAccordion, styles.hideOnTablet)}
            stickyOnMobile
          >
            {description && (
              <AccordionItem
                className={styles.productAccordionItem}
                triggerContent="Description"
              >
                <div
                  className={clsx(styles.productDescription, 'p-large')}
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </AccordionItem>
            )}
            {warrantyTimePeriod && (
              <AccordionItem
                className={styles.productAccordionItem}
                triggerContent={
                  <span>
                    Warranty{' '}
                    <span className={styles.years}>
                      +{warrantyTimePeriod} years
                    </span>
                  </span>
                }
              >
                {warrantyDescription && (
                  <div className={clsx(styles.warrantyDescription, 'p-large')}>
                    {warrantyDescription}
                  </div>
                )}
              </AccordionItem>
            )}
          </Accordion>
          {description && (
            <div
              className={clsx(
                styles.productDescription,
                styles.hideOnMobile,
                'p-large',
              )}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </div>
      <ProductComboDeals
        comboDeals={firstMatchedProduct.productComboDeals}
        productData={firstMatchedProduct}
        variantSlug={variantSlug}
      />
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
