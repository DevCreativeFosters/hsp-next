'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { clsx } from 'clsx';

import ArrowLeft from '@assets/images/arrow-left.svg';
import ArrowRight from '@assets/images/arrow-right.svg';

import styles from './hero.module.scss';

const MIN_SWIPE_THRESHOLD = 50;

export default function Hero({ slides }) {
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(handleResize);

  useEffect(
    function syncIsMobile() {
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
    [handleResize],
  );

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const handlePreviousSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  }, [slides.length]);

  const handleSwipeStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleSwipeMove = useCallback((e) => {
    if (touchStartX !== null) {
      const touchEndX = e.touches[0].clientX;
      const deltaX = touchEndX - touchStartX;

      if (deltaX > MIN_SWIPE_THRESHOLD) {
        handlePreviousSlide();
        setTouchStartX(null);
      } else if (deltaX < -MIN_SWIPE_THRESHOLD) {
        handleNextSlide();
        setTouchStartX(null);
      }
    }
  }, [handleNextSlide, handlePreviousSlide, touchStartX]);

  const handleSwipeEnd = () => {
    setTouchStartX(null);
  };

  useEffect(() => {
    const heroRefCurrent = heroRef.current;
    if (!heroRefCurrent) return;

    heroRefCurrent.addEventListener('touchstart', handleSwipeStart);
    heroRefCurrent.addEventListener('touchmove', handleSwipeMove);
    heroRefCurrent.addEventListener('touchend', handleSwipeEnd);

    return () => {
      heroRefCurrent.removeEventListener('touchstart', handleSwipeStart);
      heroRefCurrent.removeEventListener('touchmove', handleSwipeMove);
      heroRefCurrent.removeEventListener('touchend', handleSwipeEnd);
    };
  }, [handleSwipeMove]);

  const handleSlideChange = (index) => {
    setCurrentSlideIndex(index);
  };

  const currentSlide = slides[currentSlideIndex];
  const backgroundImage = currentSlide.backgroundImage?.sourceUrl;

  const renderSlideDots = () => (
    <div className={styles.slideDots}>
      {slides.map((_, index) => (
        <div
          key={index}
          className={styles.dotContainer}
          onClick={() => handleSlideChange(index)}>
          <span
            className={clsx(styles.slideDot, currentSlideIndex === index && styles.active)}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div
      ref={heroRef}
      className={styles.hero}
      style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none' }}>
      <div className={styles.content}>
        <h3 className={styles.title}>{currentSlide.title}</h3>
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: currentSlide.description }} />
        <div className={styles.buttonContainer}>
          <a className={styles.learnMoreButton} href={currentSlide.buttonLink?.link}>
            {currentSlide.buttonLink?.title}
          </a>
          <div className={styles.buttons}>
            {isMobile === true && renderSlideDots()}
            {isMobile === false &&
              <>
                <button className={styles.leftButton} onClick={handlePreviousSlide}>
                  <ArrowLeft />
                </button>
                <button className={styles.rightButton} onClick={handleNextSlide}>
                  <ArrowRight />
                </button>
              </>}
          </div>
        </div>
      </div>
    </div>
  );
}
