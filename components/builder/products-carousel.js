'use client';

import Image from 'next/image';
import { SwiperSlide } from 'swiper/react';
import clsx from 'clsx';

import Carousel from '@components/carousel/carousel';
import { getIcon } from '@lib/icons';

import styles from './products-carousel.module.scss';

const PlusIcon = getIcon('plus');
const CheckMarkIcon = getIcon('check-mark');

export default function ProductsCarousel({
  className,
  products,
  selectedProducts,
  disabledProducts,
  toggleProduct,
}) {
  const slides = products?.map(product => {
    const productTitle = product.variantName;
    const productImage = product.uteBuilderImages.imageDesktop?.sourceUrl;

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
      <h2 className={styles.title}>Add products to your vehicle</h2>
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
