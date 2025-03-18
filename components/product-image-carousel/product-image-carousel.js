'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import Button from '@components/button/button';
import TileCarousel from '@components/tile-carousel/tile-carousel';

import styles from './product-image-carousel.module.scss';

export default function ProductImageCarousel({ images }) {
  const buttonPrevRef = useRef();
  const buttonNextRef = useRef();

  const [selectedImage, setSelectedImage] = useState(
    images?.length ? images[0] : null,
  );

  const mainImageContainerRef = useRef(null);

  const handleThumbnailClick = useCallback(selectedImageUrl => {
    setSelectedImage(selectedImageUrl);
  }, []);

  useEffect(() => {
    setSelectedImage(images?.[0]);
  }, [images]);

  const isNavigationVisible = images?.length > 4;

  const itemTpl = useMemo(() => {
    const itemTemplate = item => (
      <div className={styles.thumbnailWrapper}>
        <Image
          alt={item.alt}
          className={clsx(styles.thumbnail, {
            [styles.active]:
              selectedImage && selectedImage.sourceUrl === item.sourceUrl,
          })}
          height={141}
          onClick={() => handleThumbnailClick(item)}
          src={item.sourceUrl}
          width={141}
        />
      </div>
    );

    return itemTemplate;
  }, [handleThumbnailClick, selectedImage]);

  return (
    <div className={styles.container}>
      <div className={styles.mainImageContainer} ref={mainImageContainerRef}>
        {selectedImage && (
          <Image
            alt={selectedImage.alt}
            className={styles.mainImage}
            fill
            src={selectedImage.sourceUrl}
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <TileCarousel
        buttonNextRef={buttonNextRef}
        buttonPrevRef={buttonPrevRef}
        containerClassName={styles.thumbnailCarouselContainer}
        id="product-gallery"
        itemTemplate={itemTpl}
        items={images}
        name="Product image carousel"
        nonOverflowWrapper
        resetStyle
        xSmallGaps
      >
        {isNavigationVisible && images.length && (
          <>
            <Button
              background="dark"
              className={clsx(styles.navigationButton, styles.prevButton)}
              ref={buttonPrevRef}
              rightIcon="arrow-previous"
              variant="secondary"
            />
            <Button
              background="dark"
              className={clsx(styles.navigationButton, styles.nextButton)}
              ref={buttonNextRef}
              rightIcon="arrow-next"
              variant="secondary"
            />
          </>
        )}
      </TileCarousel>
    </div>
  );
}
