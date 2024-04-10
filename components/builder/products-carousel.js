'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { SwiperSlide } from 'swiper/react';

import { getIcon } from '@lib/icons';

import Button from '@components/button/button';
import Carousel from '@components/carousel/carousel';

import styles from './products-carousel.module.scss';

const PlusIcon = getIcon('plus');
const CheckMarkIcon = getIcon('check-mark');
const CancelIcon = getIcon('cancel');

export default function ProductsCarousel({
  className,
  products,
  selectedProducts,
  disabledProducts,
  toggleProduct,
  stepNumber,
  stepTitle,
  selectedCover,
  isMobile,
}) {
  const slides = products?.map(product => {
    const productTitle = product.variantName;
    const productImage = product.uteBuilderImages.imageDesktop?.node?.sourceUrl;

    return (
      <SwiperSlide className={styles.swiperSlide} key={product.variantSlug}>
        <button
          className={clsx(styles.product, {
            [styles.isSelected]: selectedProducts.includes(product),
            [styles.isDisabled]: disabledProducts.includes(product),
          })}
          type="button"
          onClick={() => toggleProduct(product)}
        >
          <div className={styles.productImageContainer}>
            <Image
              className={styles.productImage}
              src={productImage}
              alt={productTitle}
              width={168}
              height={Math.round(168 / 1.4)}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <div className={styles.productIcon}>
            <PlusIcon className={styles.plusIcon} />
            <CheckMarkIcon className={styles.checkIcon} />
          </div>
          {productTitle && <p className={styles.productName}>{productTitle}</p>}
        </button>
      </SwiperSlide>
    );
  });

  const currentStepTitle =
    stepNumber === 2 && isMobile ? 'Add products to' : stepTitle;

  return (
    <div className={clsx(styles.productsCarousel, className)}>
      <h2 className={styles.title}>
        <span className={styles.number}>Step {stepNumber}:</span>{' '}
        {currentStepTitle}
        {isMobile && stepNumber === 2 && selectedCover && (
          <Button size="small" variant="secondary" className={styles.badge}>
            {selectedCover.variantName}
            <CancelIcon className={styles.badgeIcon} />
          </Button>
        )}
      </h2>
      <div className={styles.carouselWrapper}>
        <Carousel
          className={styles.carousel}
          settings={{
            slidesPerView: 'auto',
            spaceBetween: 24,
            navigation: true,
            loop: false,
            watchSlidesProgress: true,
          }}
          slides={slides}
          showNavigation={products?.length > 7}
        />
      </div>
    </div>
  );
}
