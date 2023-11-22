'use client';

import Image from 'next/image';
import clsx from 'clsx';
import { useEffect, useRef, useCallback, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useIsMobile } from '@hooks/useIsMobile';
import Button from '@components/button/button';
// import images from './mock-data';
import 'swiper/css';
import styles from './product-image-carousel.module.scss';

export default function ProductImageCarousel({ images }) {
  const isMobile = useIsMobile();
  const swiperRef = useRef(null);
  const swiperHeightRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(
    images?.length ? images[0] : null,
  );
  const [swiperSlides, setSwiperSlides] = useState(null);
  const [navigationPosition, setNavigationPosition] = useState(0);
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

  const handlePrevClick = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  }, []);

  const handleNextClick = useCallback(() => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }, []);

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

  useEffect(
    function findSwiperSlidesHeight() {
      const updateSwiperHeight = () => {
        const height = swiperHeightRef.current.clientHeight;
        setNavigationPosition(height / 2);
      };

      if (swiperSlides) {
        updateSwiperHeight();
      }

      window.addEventListener('resize', updateSwiperHeight);

      return () => {
        window.removeEventListener('resize', updateSwiperHeight);
      };
    },
    [swiperSlides],
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
      <div ref={swiperHeightRef}>
        <Swiper
          className={styles.swiper}
          slidesPerView={isMobile ? 'auto' : 4}
          spaceBetween={isMobile ? 16 : 24}
          navigation
          onSwiper={swiper => (swiperRef.current = swiper)}
          loop={false}
          slidesPerGroup={1}
          watchSlidesProgress
        >
          {swiperSlides}
        </Swiper>
      </div>
      <div className={styles.navigationContainer}>
        {images?.length > 4 && swiperSlides && (
          <div
            className={styles.swiperButtons}
            style={{ top: `-${navigationPosition}px` }}
          >
            <Button
              className={styles.prevButton}
              onClick={handlePrevClick}
              variant="secondary"
              background="dark"
              rightIcon="arrow-previous"
            />
            <Button
              className={styles.nextButton}
              onClick={handleNextClick}
              variant="secondary"
              background="dark"
              rightIcon="arrow-next"
            />
          </div>
        )}
      </div>
    </div>
  );
}
