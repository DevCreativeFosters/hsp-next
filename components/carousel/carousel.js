import { useRef, useCallback } from 'react';
import { Swiper } from 'swiper/react';
import clsx from 'clsx';

import Button from '@components/button/button';
import 'swiper/css';
import styles from './carousel.module.scss';

export default function Carousel({
  settings,
  slides,
  showNavigation,
  className,
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
            className={clsx(styles.navigationButton, styles.prevButton)}
            onClick={handlePrevClick}
            variant="secondary"
            background="dark"
            rightIcon="arrow-previous"
          />
          <Button
            className={clsx(styles.navigationButton, styles.nextButton)}
            onClick={handleNextClick}
            variant="secondary"
            background="dark"
            rightIcon="arrow-next"
          />
        </>
      )}
    </div>
  );
}
