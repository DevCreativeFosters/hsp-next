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
      const newSelectedProducts = [...selectedProducts];

      if (selectedFactoryOption) {
        const variant = selectedFactoryOption.productFields.variants[0];
        variant.imageLayerPosition =
          selectedFactoryOption?.productCategories?.nodes[0]?.categoryRelations
            ?.imageLayerPosition || 1;

        newSelectedProducts.unshift(variant);
      }

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

  const imageSizes = {
    desktop: {
      height: 538,
      width: 864,
    },
    mobile: {
      height: 535,
      width: 390,
    },
  };

  return (
    <div className={clsx(styles.preview, className)}>
      <div className={styles.isDesktop}>
        {!desktopImageLoaded && <Loading color="white" size="large" />}
        <Image
          alt={modelName}
          className={clsx(styles.base, styles.isDesktop)}
          height={imageSizes.desktop.height}
          onLoad={image => {
            image?.currentTarget?.classList?.add(styles.isLoaded);
            setDesktopImageLoaded(true);
          }}
          src={modelImageDesktop}
          width={imageSizes.desktop.width}
        />
      </div>
      <div className={styles.isMobile}>
        {!mobileImageLoaded && <Loading color="white" size="large" />}
        <Image
          alt={modelName}
          className={clsx(styles.base, styles.isMobile)}
          height={imageSizes.mobile.height}
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
              height={imageSizes.desktop.height}
              onLoad={image => {
                image?.currentTarget?.classList?.add(styles.isLoaded);
              }}
              src={productImageDesktop}
              style={{
                zIndex: selectedProduct.imageLayerPosition,
              }}
              width={imageSizes.desktop.width}
            />
            <Image
              alt={productTitle}
              className={clsx(styles.layer, styles.isMobile)}
              height={imageSizes.mobile.height}
              onLoad={image => {
                image?.currentTarget?.classList?.add(styles.isLoaded);
              }}
              src={productImageMobile}
              style={{
                zIndex: selectedProduct.imageLayerPosition,
              }}
              width={imageSizes.mobile.width}
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
