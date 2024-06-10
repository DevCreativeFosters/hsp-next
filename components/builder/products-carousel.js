'use client';

import { useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { useVehicleContext } from '@contexts/vehicle';

import { getIcon } from '@lib/icons';

import ActionModal from '@components/builder/action-modal';
import Button from '@components/button/button';
import Carousel from '@components/carousel/carousel';
import Loading from '@components/loading/loading';

import { getSlides } from './helpers';
import styles from './products-carousel.module.scss';

const ArrowBackwardIcon = getIcon('arrow-backward');
const MIN_SLIDES_TO_SHOW_NAVIGATION = 6;

export const slideImageSizes = {
  height: Math.round(168 / 1.4),
  width: 168,
};

export default function ProductsCarousel({
  className,
  disabledProducts,
  isMobile,
  products,
  stepTitle,
  toggleGroup,
  toggleProduct,
}) {
  const [showResetModal, setShowResetModal] = useState(false);

  const {
    removeProduct,
    selectedCover,
    selectedProducts,
    setSelectedCover,
    setSelectedProducts,
    setStepNumber,
    stepNumber,
  } = useVehicleContext();

  const slides = getSlides(
    products,
    selectedCover,
    selectedProducts,
    disabledProducts,
    toggleGroup,
    toggleProduct,
  );

  const productTitle = selectedCover?.productTitle;
  const productImage = selectedCover?.image;

  const handleOnResetAccept = () => {
    setSelectedCover(null);
    setSelectedProducts([]);
    setStepNumber(0);
    setShowResetModal(false);
  };

  return (
    <>
      {showResetModal && (
        <ActionModal
          onAccept={handleOnResetAccept}
          onClose={() => setShowResetModal(false)}
        />
      )}

      <div className={clsx(styles.productsCarousel, className)}>
        {stepNumber > 0 && products.length === 0 && (
          <Loading color="white" size="large" />
        )}

        {stepNumber > 0 && products.length > 0 && (
          <>
            <h2 className={styles.title}>
              <span className={styles.number}>Step {stepNumber}:</span>{' '}
              <span className={styles.stepTitle}>{stepTitle}</span>
              {isMobile && stepNumber === 2 && selectedCover && (
                <Button
                  className={styles.badge}
                  onClick={() => removeProduct(selectedCover)}
                  rightIcon="cancel"
                  size="small"
                  variant="secondary"
                >
                  <span className={styles.coverName}>{productTitle}</span>
                </Button>
              )}
              {!isMobile && stepNumber > 0 && (
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
                  <span className={styles.coverName}>Reset build</span>
                </Button>
              )}
            </h2>
            <div className={styles.carouselWrapper}>
              {!isMobile && stepNumber === 2 && selectedCover && (
                <button
                  className={clsx(styles.product, styles.isCover)}
                  onClick={() => removeProduct(selectedCover)}
                  type="button"
                >
                  <div className={styles.productImageContainer}>
                    {productImage && (
                      <Image
                        alt={productTitle}
                        className={styles.productImage}
                        height={slideImageSizes.height}
                        src={productImage}
                        style={{ objectFit: 'contain' }}
                        width={slideImageSizes.width}
                      />
                    )}
                  </div>
                  <div className={styles.productIcon}>
                    <ArrowBackwardIcon className={styles.arrowIcon} />
                  </div>
                  {productTitle && (
                    <div className={styles.productMeta}>
                      <p className={styles.productName}>{productTitle}</p>
                      {selectedCover.price && selectedCover.price > 0 && (
                        <span className={styles.productPrice}>
                          {new Intl.NumberFormat('en-AU', {
                            currency: 'AUD',
                            style: 'currency',
                          }).format(selectedCover.price)}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              )}
              <Carousel
                className={styles.carousel}
                settings={{
                  loop: false,
                  slidesOffsetBefore: 10,
                  slidesPerView: 'auto',
                  spaceBetween: 19,
                  watchSlidesProgress: true,
                }}
                showNavigation={slides.length > MIN_SLIDES_TO_SHOW_NAVIGATION}
                slides={slides}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
