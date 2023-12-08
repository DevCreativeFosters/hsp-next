'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useEffect, useRef, useCallback, useState } from 'react';
import { SwiperSlide } from 'swiper/react';
import { useIsMobile } from '@hooks/useIsMobile';

// import images from './mock-data';
import Carousel from '@components/carousel/carousel';
import styles from './product-image-carousel.module.scss';

export default function ProductImageCarousel({ images }) {
  const isMobile = useIsMobile();

  const [selectedImage, setSelectedImage] = useState(
    images?.length ? images[0] : null,
  );
  const [swiperSlides, setSwiperSlides] = useState(null);

  const [backgroundPosition, setBackgroundPosition] = useState('50% 50%');
  const [zoomed, setZoomed] = useState(false);
  const mainImageContainerRef = useRef(null);

  const containerStyle = {
    backgroundImage: selectedImage ? `url(${selectedImage.sourceUrl})` : 'none',
    backgroundSize: zoomed ? '250%' : 'cover',
    backgroundPosition: backgroundPosition,
    backgroundRepeat: 'no-repeat',
  };

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
  }, [zoomed, handleTouchMoveDocument]);

  useEffect(
    function loadAllSlides() {
      const slides = images?.map((item, index) => (
        <SwiperSlide className={styles.swiperSlide} key={index}>
          <Image
            className={styles.thumbnail}
            src={item.sourceUrl}
            alt={item.alt}
            width={141}
            height={141}
            onClick={() => handleThumbnailClick(item)}
          />
        </SwiperSlide>
      ));

      setSwiperSlides(slides);
    },
    [handleThumbnailClick, images],
  );

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
      <Carousel
        settings={{
          slidesPerView: isMobile ? 'auto' : 4,
          spaceBetween: isMobile ? 16 : 24,
          navigation: true,
          loop: false,
          slidesPerGroup: 1,
          watchSlidesProgress: true,
        }}
        slides={swiperSlides}
        showNavigation={images?.length > 4}
      />
    </div>
  );
}
