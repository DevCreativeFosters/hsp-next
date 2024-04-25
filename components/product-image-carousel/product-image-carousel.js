'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMobile } from '@hooks/useIsMobile';

import Button from '@components/button/button';
import TileCarousel from '@components/tile-carousel/tile-carousel';

import styles from './product-image-carousel.module.scss';

export default function ProductImageCarousel({ images }) {
  const isMobile = useIsMobile();

  const buttonPrevRef = useRef();
  const buttonNextRef = useRef();

  const [selectedImage, setSelectedImage] = useState(
    images?.length ? images[0] : null,
  );

  const [backgroundPosition, setBackgroundPosition] = useState('50% 50%');
  const [zoomed, setZoomed] = useState(false);
  const mainImageContainerRef = useRef(null);

  const containerStyle = useMemo(() => {
    return {
      backgroundImage: selectedImage
        ? `url(${selectedImage.sourceUrl})`
        : 'none',
      backgroundPosition: backgroundPosition,
      backgroundRepeat: 'no-repeat',
      backgroundSize: zoomed ? '250%' : 'cover',
    };
  }, [backgroundPosition, selectedImage, zoomed]);

  const handleZoomEnter = useCallback(() => {
    setZoomed(true);
  }, []);

  const handleZoomLeave = useCallback(() => {
    setZoomed(false);
    setBackgroundPosition('50% 50%');
  }, []);

  const handleMouseMove = useCallback(
    ev => {
      if (!zoomed) return;

      let clientX, clientY;
      if (ev.type === 'touchmove') {
        clientX = ev.touches[0].clientX;
        clientY = ev.touches[0].clientY;
      } else {
        clientX = ev.clientX;
        clientY = ev.clientY;
      }

      const container = mainImageContainerRef.current;
      const rectangle = container.getBoundingClientRect();
      const x = ((clientX - rectangle.left) / container.offsetWidth) * 100;
      const y = ((clientY - rectangle.top) / container.offsetHeight) * 100;
      setBackgroundPosition(`${x}% ${y}%`);
    },
    [zoomed],
  );

  const handleTouchStart = useCallback(() => {
    setZoomed(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setZoomed(false);
    setBackgroundPosition('50% 50%');
  }, []);

  const handleThumbnailClick = useCallback(selectedImageUrl => {
    setSelectedImage(selectedImageUrl);
  }, []);

  const handleTouchMoveDocument = useCallback(
    ev => {
      if (zoomed) {
        ev.preventDefault();
      }
    },
    [zoomed],
  );

  useEffect(() => {
    setSelectedImage(images?.[0]);
  }, [images]);

  useEffect(() => {
    const handleBodyOverflow = () => {
      if (isMobile) {
        document.body.style.overflowY = zoomed ? 'hidden' : 'auto';
      }
    };

    handleBodyOverflow();
    document.addEventListener('touchmove', handleTouchMoveDocument, {
      passive: false,
    });

    return () => {
      document.body.style.overflowY = 'auto';
      document.removeEventListener('touchmove', handleTouchMoveDocument);
    };
  }, [handleTouchMoveDocument, isMobile, zoomed]);

  const isNavigationVisible = images?.length > 4;

  const itemTpl = useMemo(() => {
    const itemTemplate = item => (
      <div className={styles.thumbnailWrapper}>
        <Image
          alt={item.alt}
          className={styles.thumbnail}
          height={141}
          onClick={() => handleThumbnailClick(item)}
          src={item.sourceUrl}
          width={141}
        />
      </div>
    );

    return itemTemplate;
  }, [handleThumbnailClick]);

  return (
    <div className={styles.container}>
      <div
        className={clsx(styles.mainImageContainer, {
          [styles.zoomed]: zoomed,
        })}
        onMouseEnter={handleZoomEnter}
        onMouseLeave={handleZoomLeave}
        onMouseMove={handleMouseMove}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        ref={mainImageContainerRef}
        style={containerStyle}
      />
      <TileCarousel
        buttonNextRef={buttonNextRef}
        buttonPrevRef={buttonPrevRef}
        containerClassName={styles.thumbnailCarouselContainer}
        id="product-gallery"
        itemTemplate={itemTpl}
        items={images}
        name="Product image carousel"
        resetStyle
        smallGaps
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
