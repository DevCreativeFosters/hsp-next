'use client';

import { useState } from 'react';
import { StoreLocatorProvider } from '@contexts/store-locator';
import EnquiryForm from '@components/enquiry-form/enquiry-form';
import styles from './page.module.scss';

// This component encapsulates client-side portion of the page (where `variant` state needs to be tracked)

export default function PageClientSidePartial({
  mainCategory,
  make,
  enquiryFormId,
  firstMatchedProduct,
  allLocations,
}) {
  const [variant, setVariant] = useState(
    firstMatchedProduct?.productFields.variants?.[0],
  );

  return (
    <>
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
        {firstMatchedProduct?.productFields.description && (
          <p className={styles.description}>
            {firstMatchedProduct?.productFields.description}
          </p>
        )}
      </div>
      <StoreLocatorProvider>
        <EnquiryForm
          enquiryFormId={enquiryFormId}
          productData={firstMatchedProduct}
          onVariantChange={setVariant}
          allLocations={allLocations}
        />
      </StoreLocatorProvider>
    </>
  );
}
