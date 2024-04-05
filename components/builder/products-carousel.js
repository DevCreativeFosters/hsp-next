'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { SwiperSlide } from 'swiper/react';

import { getIcon } from '@lib/icons';

import Carousel from '@components/carousel/carousel';

import styles from './products-carousel.module.scss';

const PlusIcon = getIcon('plus');
const CheckMarkIcon = getIcon('check-mark');

export default function ProductsCarousel({
  className,
  products,
  selectedProducts,
  disabledProducts,
  toggleProduct,
  stepNumber,
  stepTitle,
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

  return (
    <div className={clsx(styles.productsCarousel, className)}>
      <h2 className={styles.title}>
        <span className={styles.number}>Step {stepNumber}:</span> {stepTitle}
      </h2>
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
  );
}
