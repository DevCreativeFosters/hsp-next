'use client';

import { Fragment, useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import DownloadButton from '@components/download-button/download-button';

import BgPictureMobile from '@assets/images/bg-concrete-mobile.webp';
import BgPicture from '@assets/images/bg-concrete.webp';

import styles from './preview.module.scss';

export default function Preview({
  children,
  className,
  make,
  model,
  selectedProducts,
}) {
  const modelName = model?.name;
  const modelImageDesktop =
    model?.uteBuilderImages?.imageDesktop?.node?.sourceUrl;
  const modelImageMobile =
    model?.uteBuilderImages?.imageMobile?.node?.sourceUrl;
  const [mergeImages, setMergeImages] = useState([]);

  useEffect(() => {
    let newMergeImages = [];

    if (selectedProducts?.length > 0) {
      newMergeImages.push(BgPicture);
      newMergeImages.push(modelImageDesktop);

      selectedProducts.forEach(selectedProduct => {
        const productImageDesktop =
          selectedProduct.uteBuilderImages.imageDesktop?.node?.sourceUrl;

        newMergeImages.push(productImageDesktop);
      });
    }

    setMergeImages(newMergeImages);

    return () => {};
  }, [modelImageDesktop, selectedProducts]);

  return (
    <div className={clsx(styles.preview, className)}>
      <Image
        alt={modelName}
        className={clsx(styles.base, styles.isDesktop)}
        height={538}
        src={modelImageDesktop}
        width={864}
      />
      <Image
        alt={modelName}
        className={clsx(styles.base, styles.isMobile)}
        height={535}
        src={modelImageMobile}
        width={390}
      />
      {!!mergeImages.length && (
        <DownloadButton
          className={styles.downloadButton}
          fileName={`${
            make.name
          }_${modelName}_${new Date().toLocaleDateString()}`}
          images={mergeImages}
        />
      )}
      {selectedProducts?.map(selectedProduct => {
        const productTitle = selectedProduct.variantName;
        const productSlug = selectedProduct.variantSlug;
        const productImageDesktop =
          selectedProduct.uteBuilderImages.imageDesktop?.node?.sourceUrl;
        const productImageMobile =
          selectedProduct.uteBuilderImages.imageMobile?.node?.sourceUrl;

        return (
          <Fragment key={productSlug}>
            <Image
              alt={productTitle}
              className={clsx(styles.layer, styles.isDesktop)}
              height={538}
              src={productImageDesktop}
              width={864}
            />
            <Image
              alt={productTitle}
              className={clsx(styles.layer, styles.isMobile)}
              height={535}
              src={productImageMobile}
              width={390}
            />
          </Fragment>
        );
      })}
      {children}
      <Image
        alt="Concrete grey floor"
        className={styles.backgroundDesktop}
        fill={true}
        src={BgPicture}
      />
      <Image
        alt="Concrete grey floor"
        className={styles.backgroundMobile}
        fill={true}
        src={BgPictureMobile}
      />
    </div>
  );
}
