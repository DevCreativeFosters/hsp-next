'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { useVehicleContext } from '@contexts/vehicle';

import { useIsMobile } from '@hooks/useIsMobile';

import ActionModal from '@components/builder/action-modal';
import FadeInImage from '@components/builder/fade-in-image';
import Button from '@components/button/button';
import DownloadButton from '@components/download-button/download-button';
import Loading from '@components/loading/loading';

import BgPictureMobile from '@assets/images/bg-concrete-mobile.webp';
import BgPicture from '@assets/images/bg-concrete.webp';

import styles from './preview.module.scss';

export default function Preview({ children, className, handleResetAccept }) {
  const [showResetModal, setShowResetModal] = useState(false);
  const {
    maker: make,
    model,
    selectedFactoryOption,
    selectedProducts,
    setStepNumber,
    stepNumber,
  } = useVehicleContext();

  const modelName = model?.name;
  const modelImageDesktop =
    model?.uteBuilderImages?.imageDesktop?.node?.sourceUrl;
  const modelImageMobile =
    model?.uteBuilderImages?.imageMobile?.node?.sourceUrl;
  const [mergeImages, setMergeImages] = useState([]);
  const [localSelectedProducts, setLocalSelectedProducts] =
    useState(selectedProducts);
  const isMobile = useIsMobile(1280);

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
    <>
      {showResetModal && (
        <ActionModal
          onAccept={handleResetAccept}
          onClose={() => setShowResetModal(false)}
        />
      )}
      <div className={clsx(styles.preview, className)}>
        <Loading color="white" size="small" />
        <FadeInImage
          alt={modelName}
          imageSizes={imageSizes}
          srcDesktop={modelImageDesktop}
          srcMobile={modelImageMobile}
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
        {isMobile && stepNumber > 0 && (
          <Button
            className={styles.resetButton}
            onClick={() => {
              if (stepNumber === 1 && selectedProducts.length === 0) {
                setStepNumber(0);
              } else {
                setShowResetModal(true);
              }
            }}
            rightIcon="close"
            variant="secondary"
          >
            Reset build
          </Button>
        )}
        {localSelectedProducts?.map((product, index) => {
          if (product.isNoCover) {
            return null;
          }

          const {
            imageLayerPosition,
            productName: productTitle,
            uteBuilderImages,
          } = product;

          const productImageDesktop =
            uteBuilderImages.imageDesktop?.node?.sourceUrl;
          const productImageMobile =
            uteBuilderImages.imageMobile?.node?.sourceUrl;

          if (uteBuilderImages.multipleImages) {
            return uteBuilderImages.multipleImages.map((image, index) => {
              if (
                !image.desktop?.node?.sourceUrl ||
                !image.mobile?.node?.sourceUrl
              ) {
                return null;
              }

              return (
                <FadeInImage
                  alt={image.altText || productTitle}
                  imageLayerPosition={image.layerPosition || imageLayerPosition}
                  imageSizes={imageSizes}
                  key={index}
                  srcDesktop={image.desktop.node.sourceUrl}
                  srcMobile={image.mobile.node.sourceUrl}
                />
              );
            });
          }

          return (
            <FadeInImage
              alt={productTitle}
              imageLayerPosition={imageLayerPosition}
              imageSizes={imageSizes}
              key={index}
              srcDesktop={productImageDesktop}
              srcMobile={productImageMobile}
            />
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
    </>
  );
}
