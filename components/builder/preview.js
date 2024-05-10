'use client';

import { Fragment, useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import DownloadButton from '@components/download-button/download-button';
import Loading from '@components/loading/loading';

import BgPictureMobile from '@assets/images/bg-concrete-mobile.webp';
import BgPicture from '@assets/images/bg-concrete.webp';

import styles from './preview.module.scss';

export default function Preview({
  children,
  className,
  make,
  model,
  selectedFactoryOption,
  selectedProducts,
}) {
  const modelName = model?.name;
  const modelImageDesktop =
    model?.uteBuilderImages?.imageDesktop?.node?.sourceUrl;
  const modelImageMobile =
    model?.uteBuilderImages?.imageMobile?.node?.sourceUrl;
  const [mergeImages, setMergeImages] = useState([]);
  const [desktopImageLoaded, setDesktopImageLoaded] = useState(false);
  const [mobileImageLoaded, setMobileImageLoaded] = useState(false);
  const [localSelectedProducts, setLocalSelectedProducts] =
    useState(selectedProducts);

  useEffect(
    function setupSelectedFactoryOptionImage() {
      if (!selectedFactoryOption) {
        return;
      }

      const images =
        selectedFactoryOption?.productFields?.variants[0]?.uteBuilderImages ||
        {};

      if (!Object.keys(images).length) {
        return;
      }

      const newSelectedProducts = [
        selectedFactoryOption?.productFields?.variants[0],
        ...selectedProducts,
      ];

      setLocalSelectedProducts(newSelectedProducts);
    },
    [selectedFactoryOption, selectedProducts],
  );

  useEffect(() => {
    let newMergeImages = [];

    if (localSelectedProducts?.length > 0) {
      newMergeImages.push(BgPicture);
      newMergeImages.push(modelImageDesktop);

      localSelectedProducts.forEach(selectedProduct => {
        const productImageDesktop =
          selectedProduct.uteBuilderImages.imageDesktop?.node?.sourceUrl;

        newMergeImages.push(productImageDesktop);
      });
    }

    setMergeImages(newMergeImages);

    return () => {};
  }, [localSelectedProducts, modelImageDesktop]);

  return (
    <div className={clsx(styles.preview, className)}>
      <div className={styles.isDesktop}>
        {!desktopImageLoaded && <Loading color="white" size="large" />}
        <Image
          alt={modelName}
          className={clsx(styles.base, styles.isDesktop)}
          height={538}
          onLoad={image => {
            image?.currentTarget?.classList?.add(styles.isLoaded);
            setDesktopImageLoaded(true);
          }}
          src={modelImageDesktop}
          width={864}
        />
      </div>
      <div className={styles.isMobile}>
        {!mobileImageLoaded && <Loading color="white" size="large" />}
        <Image
          alt={modelName}
          className={clsx(styles.base, styles.isMobile)}
          height={535}
          onLoad={image => {
            image?.currentTarget?.classList?.add(styles.isLoaded);
            setMobileImageLoaded(true);
          }}
          src={modelImageMobile}
          width={390}
        />
      </div>
      {!!mergeImages.length && (
        <DownloadButton
          className={styles.downloadButton}
          fileName={`${
            make.name
          }_${modelName}_${new Date().toLocaleDateString()}`}
          images={mergeImages}
        />
      )}
      {localSelectedProducts?.map(selectedProduct => {
        if (selectedProduct.isNoCover) {
          return null;
        }

        const productTitle = selectedProduct.productName;
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
              onLoad={image => {
                image?.currentTarget?.classList?.add(styles.isLoaded);
              }}
              src={productImageDesktop}
              width={864}
            />
            <Image
              alt={productTitle}
              className={clsx(styles.layer, styles.isMobile)}
              height={535}
              onLoad={image => {
                image?.currentTarget?.classList?.add(styles.isLoaded);
              }}
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
