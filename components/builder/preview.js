'use client';

import { useEffect, useState, Fragment } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import DownloadButton from '@components/download-button/download-button';
import BgPicture from '@assets/images/bg-concrete.webp';
import BgPictureMobile from '@assets/images/bg-concrete-mobile.webp';
import styles from './preview.module.scss';

export default function Preview({
  makeName,
  model,
  selectedProducts,
  className,
  children,
}) {
  const modelName = model.name;
  const modelImageDesktop = model.uteBuilderImages.imageDesktop?.sourceUrl;
  const modelImageMobile = model.uteBuilderImages.imageMobile?.sourceUrl;
  const [mergeImages, setMergeImages] = useState([]);

  useEffect(() => {
    let newMergeImages = [];

    if (selectedProducts?.length > 0) {
      newMergeImages.push(modelImageDesktop);

      selectedProducts.forEach(selectedProduct => {
        const productImageDesktop =
          selectedProduct.uteBuilderImages.imageDesktop?.sourceUrl;

        newMergeImages.push(productImageDesktop);
      });
    }

    setMergeImages(newMergeImages);

    return () => {};
  }, [modelImageDesktop, selectedProducts]);

  return (
    <div className={clsx(styles.preview, className)}>
      <Image
        className={clsx(styles.base, styles.isDesktop)}
        src={modelImageDesktop}
        alt={modelName}
        width={864}
        height={538}
      />
      <Image
        className={clsx(styles.base, styles.isMobile)}
        src={modelImageMobile}
        alt={modelName}
        width={390}
        height={535}
      />
      {!!mergeImages.length && (
        <DownloadButton
          className={styles.downloadButton}
          images={mergeImages}
          fileName={`${makeName}_${modelName}_${new Date().toLocaleDateString()}`}
        />
      )}
      {selectedProducts?.map(selectedProduct => {
        const productTitle = selectedProduct.variantName;
        const productSlug = selectedProduct.variantSlug;
        const productImageDesktop =
          selectedProduct.uteBuilderImages.imageDesktop?.sourceUrl;
        const productImageMobile =
          selectedProduct.uteBuilderImages.imageMobile?.sourceUrl;

        return (
          <Fragment key={productSlug}>
            <Image
              className={clsx(styles.layer, styles.isDesktop)}
              src={productImageDesktop}
              alt={productTitle}
              width={864}
              height={538}
            />
            <Image
              className={clsx(styles.layer, styles.isMobile)}
              src={productImageMobile}
              alt={productTitle}
              width={390}
              height={535}
            />
          </Fragment>
        );
      })}
      {children}
      <Image
        className={styles.backgroundDesktop}
        src={BgPicture}
        alt="Concrete grey floor"
        fill={true}
      />
      <Image
        className={styles.backgroundMobile}
        src={BgPictureMobile}
        alt="Concrete grey floor"
        fill={true}
      />
    </div>
  );
}
