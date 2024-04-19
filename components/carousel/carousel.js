import { useCallback, useRef } from 'react';

import clsx from 'clsx';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import Button from '@components/button/button';

import styles from './carousel.module.scss';

export default function Carousel({
  className,
  settings,
  showNavigation,
  slides,
}) {
  const swiperRef = useRef(null);
  const swiperHeightRef = useRef(null);

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

  return (
    <div className={clsx(styles.carousel, className)} ref={swiperHeightRef}>
      <Swiper onSwiper={swiper => (swiperRef.current = swiper)} {...settings}>
        {slides.map((slide, index) => (
          <SwiperSlide className={styles.swiperSlide} key={index}>
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>

      {showNavigation && slides && (
        <>
          <Button
            className={clsx(styles.navigationButton, styles.prevButton)}
            onClick={handlePrevClick}
            rightIcon="arrow-previous"
            variant="secondary"
          />
          <Button
            className={clsx(styles.navigationButton, styles.nextButton)}
            onClick={handleNextClick}
            rightIcon="arrow-next"
            variant="secondary"
          />
        </>
      )}
    </div>
  );
}
