'use client';

import { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
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
      backgroundSize: zoomed ? '250%' : 'cover',
      backgroundPosition: backgroundPosition,
      backgroundRepeat: 'no-repeat',
    };
  }, [selectedImage, zoomed, backgroundPosition]);

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
  }, [isMobile, zoomed, handleTouchMoveDocument]);

  const isNavigationVisible = images?.length > 4;

  const itemTpl = useMemo(() => {
    const itemTemplate = item => (
      <div className={styles.thumbnailWrapper}>
        <Image
          className={styles.thumbnail}
          src={item.sourceUrl}
          alt={item.alt}
          width={141}
          height={141}
          onClick={() => handleThumbnailClick(item)}
        />
      </div>
    );
    return itemTemplate;
  }, []);

  return (
    <div className={styles.container}>
      <div
        className={clsx(styles.mainImageContainer, {
          [styles.zoomed]: zoomed,
        })}
        ref={mainImageContainerRef}
        onMouseEnter={handleZoomEnter}
        onMouseLeave={handleZoomLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleTouchEnd}
        style={containerStyle}
      />
      <TileCarousel
        containerClassName={styles.thumbnailCarouselContainer}
        id="product-gallery"
        items={images}
        resetStyle
        smallGaps
        name="Product image carousel"
        buttonPrevRef={buttonPrevRef}
        buttonNextRef={buttonNextRef}
        itemTemplate={itemTpl}
      >
        {isNavigationVisible && images.length && (
          <>
            <Button
              ref={buttonPrevRef}
              className={clsx(styles.navigationButton, styles.prevButton)}
              variant="secondary"
              background="dark"
              rightIcon="arrow-previous"
            />
            <Button
              ref={buttonNextRef}
              className={clsx(styles.navigationButton, styles.nextButton)}
              variant="secondary"
              background="dark"
              rightIcon="arrow-next"
            />
          </>
        )}
      </TileCarousel>
    </div>
  );
}
