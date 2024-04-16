'use client';

import { Fragment } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { getIcon } from '@lib/icons';

import Button from '@components/button/button';
import Carousel from '@components/carousel/carousel';

import styles from './products-carousel.module.scss';

const PlusIcon = getIcon('plus');
const CheckMarkIcon = getIcon('check-mark');
const CancelIcon = getIcon('cancel');
const ArrowBackwardIcon = getIcon('arrow-backward');
const GroupIcon = getIcon('group');

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
  const slides = [];

  products?.forEach(group => {
    group?.variants.forEach((product, index) => {
      const productTitle = product.variantName;
      const productImage =
        product.uteBuilderImages.imageDesktop?.node?.sourceUrl;
      const { isGroup } = product;

      const slide = (
        <Fragment key={index}>
          <button
            className={clsx(styles.product, {
              [styles.isSelected]: selectedProducts.includes(product),
              [styles.isDisabled]: disabledProducts.includes(product),
            })}
            onClick={() => {
              isGroup ? toggleGroup(group) : toggleProduct(product);
            }}
            type="button"
          >
            <div className={styles.productImageContainer}>
              <Image
                alt={productTitle}
                className={styles.productImage}
                height={Math.round(168 / 1.4)}
                src={productImage}
                style={{ objectFit: 'contain' }}
                width={168}
              />
            </div>
            <div className={styles.productIcon}>
              {isGroup ? (
                <>
                  <GroupIcon />
                </>
              ) : (
                <>
                  <PlusIcon className={styles.plusIcon} />
                  <CheckMarkIcon className={styles.checkIcon} />
                </>
              )}
            </div>
            {productTitle && (
              <div className={styles.productMeta}>
                <p className={styles.productName}>{productTitle}</p>
                {index === 0 && group.minPrice && (
                  <span className={styles.productPrice}>
                    {isGroup && <>Starting from </>}
                    {new Intl.NumberFormat('en-AU', {
                      currency: 'AUD',
                      style: 'currency',
                    }).format(group.minPrice)}
                  </span>
                )}

                {index > 0 && product.price && (
                  <span className={styles.productPrice}>
                    {new Intl.NumberFormat('en-AU', {
                      currency: 'AUD',
                      style: 'currency',
                    }).format(product.price)}
                  </span>
                )}
              </div>
            )}
          </button>
        </Fragment>
      );

      if (!product.hidden) {
        slides.push(slide);
      }
    });
  });

  const currentStepTitle =
    stepNumber === 2 && isMobile ? 'Add products to' : stepTitle;
  const productTitle = selectedCover?.variantName;
  const productImage =
    selectedCover?.uteBuilderImages.imageDesktop?.node?.sourceUrl;

  return (
    <div className={clsx(styles.productsCarousel, className)}>
      <h2 className={styles.title}>
        <span className={styles.number}>Step {stepNumber}:</span>{' '}
        {currentStepTitle}
        {isMobile && stepNumber === 2 && selectedCover && (
          <Button className={styles.badge} size="small" variant="secondary">
            {selectedCover.variantName}
            <CancelIcon className={styles.badgeIcon} />
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
                {selectedCover.price && (
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
