'use client';

import { forwardRef, useContext, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import StoreLocatorContext from '@contexts/store-locator';
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
  height: Math.round(135 / 1.4),
  width: 135,
};

const ProductsCarousel = forwardRef(function ProductsCarousel(
  {
    className,
    disabledProducts,
    handleResetAccept,
    isMobile,
    products,
    removeProduct,
    toggleGroup,
    toggleProduct,
  },
  ref,
) {
  const [showResetModal, setShowResetModal] = useState(false);

  const {
    selectedCover,
    selectedProducts,
    setStepNumber,
    stepNumber,
    stepTitle,
  } = useVehicleContext();

  const {
    setLocation,
    setLocationInput,
    setProductsSectionOpen,
    setSearchGeolocation,
    setSelectedStore,
    setShowLocationError,
  } = useContext(StoreLocatorContext);

  if (stepNumber === 0) {
    return null;
  }

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

  return (
    <>
      {showResetModal && (
        <ActionModal
          onAccept={() => {
            handleResetAccept();
            setShowResetModal(false);
          }}
          onClose={() => setShowResetModal(false)}
        />
      )}

      <div className={clsx(styles.productsCarousel, className)}>
        {stepNumber > 0 && products.length === 0 && (
          <Loading color="white" size="large" />
        )}

        {stepNumber > 0 && products.length > 0 && (
          <>
            <h2 className={clsx(styles.title, 'h4')}>
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
              {!isMobile && (
                <Button
                  className={styles.resetButton}
                  onClick={() => {
                    if (stepNumber === 1 && selectedProducts.length === 0) {
                      setStepNumber(0);
                    } else {
                      setShowResetModal(true);
                    }
                    setShowLocationError(false);
                    setLocation(undefined);
                    setLocationInput('');
                    setSelectedStore(null);
                    setSearchGeolocation(null);
                    setProductsSectionOpen(true);
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
                    {productImage && productImage !== '' && (
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
                ref={ref}
                settings={{
                  breakpoints: {
                    1280: {
                      spaceBetween: 16
                    }
                  },
                  loop: false,
                  slidesOffsetBefore: 10,
                  slidesPerView: 'auto',
                  spaceBetween: 8,
                  watchSlidesProgress: true
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
});

export default ProductsCarousel;
