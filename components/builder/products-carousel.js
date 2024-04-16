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
const UngroupIcon = getIcon('ungroup');

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
      const { isGroup, uteBuilderImages, variantName } = product;
      const productTitle = variantName;
      const productImage = uteBuilderImages.imageDesktop?.node?.sourceUrl;
      const isSelected = selectedProducts.includes(product);
      const isDisabled = disabledProducts.includes(product);
      const isGroupItemOpen = isGroup && product.isOpen;
      const isGroupItemFirst = index === 0;
      const isGroupItemLast = index === group.variants.length - 1;

      const Icon = (
        <>
          {isGroup ? (
            <>
              {index === 0 ? (
                isGroupItemOpen ? (
                  <UngroupIcon />
                ) : (
                  <GroupIcon />
                )
              ) : isSelected ? (
                <CheckMarkIcon />
              ) : (
                <PlusIcon />
              )}
            </>
          ) : isSelected ? (
            <CheckMarkIcon />
          ) : (
            <PlusIcon />
          )}
        </>
      );

      const slide = (
        <Fragment key={index}>
          <button
            className={clsx(styles.product, {
              [styles.isSelected]: isSelected,
              [styles.isDisabled]: isDisabled,
              [styles.isGroupItem]: isGroup,
              [styles.isGroupItemOpen]: isGroupItemOpen,
              [styles.isGroupItemFirst]: isGroupItemFirst,
              [styles.isGroupItemLast]: isGroupItemLast,
            })}
            onClick={() => {
              isGroup && index === 0
                ? toggleGroup(group)
                : toggleProduct(product);
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
            <div className={styles.productIcon}>{Icon}</div>
            {productTitle && (
              <div className={styles.productMeta}>
                <p className={styles.productName}>{productTitle}</p>
                {index === 0 && group.minPrice > 0 && (
                  <span className={styles.productPrice}>
                    {isGroup && <>Starting from </>}
                    {new Intl.NumberFormat('en-AU', {
                      currency: 'AUD',
                      style: 'currency',
                    }).format(group.minPrice)}
                  </span>
                )}

                {index > 0 && product.price > 0 && (
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
          <Button
            className={styles.badge}
            onClick={() => toggleProduct(selectedCover)}
            size="small"
            variant="secondary"
          >
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
