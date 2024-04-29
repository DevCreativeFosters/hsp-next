'use client';

import clsx from 'clsx';
import Image from 'next/image';

import { getIcon } from '@lib/icons';

import Button from '@components/button/button';
import Carousel from '@components/carousel/carousel';

import { getSlides } from './helpers';
import styles from './products-carousel.module.scss';

const ArrowBackwardIcon = getIcon('arrow-backward');

export default function ProductsCarousel({
  className,
  disabledProducts,
  isMobile,
  products,
  selectedCover,
  selectedProducts,
  stepNumber,
  stepTitle,
  toggleGroup,
  toggleProduct,
}) {
  const slides = getSlides(
    products,
    selectedProducts,
    disabledProducts,
    toggleGroup,
    toggleProduct,
  );
  const productTitle = selectedCover?.variantName;
  const productImage =
    selectedCover?.uteBuilderImages.imageDesktop?.node?.sourceUrl;

  return (
    <div className={clsx(styles.productsCarousel, className)}>
      <h2 className={styles.title}>
        <span className={styles.number}>Step {stepNumber}:</span> {stepTitle}
        {isMobile && stepNumber === 2 && selectedCover && (
          <Button
            className={styles.badge}
            onClick={() => toggleProduct(selectedCover)}
            rightIcon="cancel"
            size="small"
            variant="secondary"
          >
            {selectedCover.variantName}
          </Button>
        )}
      </h2>
      <div className={styles.carouselWrapper}>
        {!isMobile && stepNumber === 2 && selectedCover && (
          <button
            className={clsx(styles.product, styles.isCover)}
            onClick={() => toggleProduct(selectedCover)}
            type="button"
          >
            <div className={styles.productImageContainer}>
              {productImage && (
                <Image
                  alt={productTitle}
                  className={styles.productImage}
                  height={Math.round(168 / 1.4)}
                  src={productImage}
                  style={{ objectFit: 'contain' }}
                  width={168}
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
            slidesPerView: 'auto',
            spaceBetween: 19,
            watchSlidesProgress: true,
          }}
          showNavigation={slides.length > 6}
          slides={slides}
        />
      </div>
    </div>
  );
}
