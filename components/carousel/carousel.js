import { useCallback, useRef } from 'react';

import clsx from 'clsx';
import 'swiper/css';
import { Swiper } from 'swiper/react';

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
      <Swiper
        className={styles.swiper}
        onSwiper={swiper => (swiperRef.current = swiper)}
        {...settings}
      >
        {slides}
      </Swiper>

      {showNavigation && slides && (
        <>
          <Button
            background="dark"
            className={clsx(styles.navigationButton, styles.prevButton)}
            onClick={handlePrevClick}
            rightIcon="arrow-previous"
            variant="secondary"
          />
          <Button
            background="dark"
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
