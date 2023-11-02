'use client';

import Image from 'next/image';
import { useState, useCallback, useRef } from 'react';
import { clsx } from 'clsx';
import { useIsMobile } from '@hooks/useIsMobile';
import Container from '@components/container/container';
import Button from '@components/button/button';

import ArrowLeft from '@assets/images/arrow-left.svg';
import ArrowRight from '@assets/images/arrow-right.svg';

import styles from './hero.module.scss';

const MIN_SWIPE_THRESHOLD = 50;

export default function Hero({ slides }) {
  const heroRef = useRef(null);
  const isMobile = useIsMobile();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const handleNextSlide = useCallback(() => {
    setCurrentSlideIndex(prevIndex => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const handlePreviousSlide = useCallback(() => {
    setCurrentSlideIndex(prevIndex =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
    );
  }, [slides.length]);

  const handleSwipeStart = useCallback(e => {
    setTouchStartX(e.touches[0].clientX);
  }, []);

  const handleSwipeMove = useCallback(
    e => {
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
    },
    [handleNextSlide, handlePreviousSlide, touchStartX],
  );

  const handleSwipeEnd = useCallback(() => {
    setTouchStartX(null);
  }, []);

  const handleSlideChange = useCallback(index => {
    setCurrentSlideIndex(index);
  }, []);

  const currentSlide = slides[currentSlideIndex];
  const backgroundImage = currentSlide.backgroundImage;
  const backgroundImagePosition = currentSlide.backgroundImagePosition;

  const renderSlideDots = () => (
    <div className={styles.slideDots}>
      {slides.map((_, index) => (
        <div
          key={index}
          className={styles.dotContainer}
          onClick={() => handleSlideChange(index)}
        >
          <span
            className={clsx(
              styles.slideDot,
              currentSlideIndex === index && styles.active,
            )}
          />
        </div>
      ))}
    </div>
  );

  const aspectRatio =
    backgroundImage?.mediaDetails?.width &&
    backgroundImage?.mediaDetails?.height
      ? backgroundImage.mediaDetails.width / backgroundImage.mediaDetails.height
      : 1;

  const HERO_MAX_HEIGHT = 820; // should match CSS styles.hero max-height

  return (
    <div
      ref={heroRef}
      className={styles.hero}
      onTouchStart={handleSwipeStart}
      onTouchMove={handleSwipeMove}
      onTouchEnd={handleSwipeEnd}
    >
      {backgroundImage?.sourceUrl && (
        <div className={styles.backgroundImageWrapper}>
          <Image
            className={styles.backgroundImage}
            src={backgroundImage.sourceUrl}
            alt={backgroundImage.altText || ''}
            fill={true}
            sizes={`(min-width: ${HERO_MAX_HEIGHT * aspectRatio}px) 100vw, ${
              HERO_MAX_HEIGHT * aspectRatio
            }px`}
            objectPosition={backgroundImagePosition}
          />
        </div>
      )}

      <Container>
        <div className={styles.content}>
          <h3 className={styles.title}>{currentSlide.title}</h3>
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: currentSlide.description }}
          />
          <div className={styles.buttonContainer}>
            {currentSlide.buttonLink?.url && currentSlide.buttonLink?.title ? (
              <Button
                className={styles.actionButton}
                size="large"
                href={currentSlide.buttonLink.url}
                target={currentSlide.buttonLink?.target || null}
              >
                {currentSlide.buttonLink.title}
              </Button>
            ) : (
              <div />
            )}

            <div className={styles.navButtons}>
              {isMobile === true && renderSlideDots()}
              {isMobile === false && (
                <>
                  <button
                    className={styles.prevButton}
                    onClick={handlePreviousSlide}
                  >
                    <ArrowLeft />
                  </button>
                  <button
                    className={styles.nextButton}
                    onClick={handleNextSlide}
                  >
                    <ArrowRight />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
