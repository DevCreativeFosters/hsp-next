'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';
import Container from '@components/container/container';
import Button from '@components/button/button';

import ArrowLeft from '@assets/images/arrow-left.svg';
import ArrowRight from '@assets/images/arrow-right.svg';

import styles from './hero.module.scss';

const MIN_SWIPE_THRESHOLD = 50;
const HERO_MAX_HEIGHT = 820; // should match CSS styles.hero max-height

export default function Hero({ slides, transition = 'fade' }) {
  const initialAssets = [0, 1, slides.length - 1];
  const heroRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [preloadedAssets, setPreloadedAssets] = useState(initialAssets);

  const currentSlide = slides[currentSlideIndex];

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex(prevIndex =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1,
    );
  }, [slides.length]);

  const handleNext = useCallback(() => {
    setCurrentSlideIndex(prevIndex => (prevIndex + 1) % slides.length);
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
          handlePrev();
          setTouchStartX(null);
        } else if (deltaX < -MIN_SWIPE_THRESHOLD) {
          handleNext();
          setTouchStartX(null);
        }
      }
    },
    [handleNext, handlePrev, touchStartX],
  );

  const handleSwipeEnd = useCallback(() => {
    setTouchStartX(null);
  }, []);

  const handleSlideChange = useCallback(index => {
    setCurrentSlideIndex(index);
  }, []);

  useEffect(
    function preloadAssetsForPrevAndNextSlides() {
      const prevSlideIndex =
        currentSlideIndex === 0 ? slides.length - 1 : currentSlideIndex - 1;
      const nextSlideIndex = (currentSlideIndex + 1) % slides.length;
      const uniquePreloadedAssets = new Set(preloadedAssets);
      uniquePreloadedAssets.add(prevSlideIndex).add(nextSlideIndex);
      const arr = Array.from(uniquePreloadedAssets);
      if (arr.length > preloadedAssets.length) {
        setPreloadedAssets(arr);
      }
    },
    [preloadedAssets, currentSlideIndex, slides],
  );

  return (
    <div
      ref={heroRef}
      className={clsx(styles.hero, {
        [styles.swipeTransition]: transition === 'swipe',
        [styles.fadeTransition]: transition === 'fade',
      })}
      onTouchStart={handleSwipeStart}
      onTouchMove={handleSwipeMove}
      onTouchEnd={handleSwipeEnd}
    >
      <div className={styles.track} data-index={currentSlideIndex}>
        {slides.map(({ backgroundImage, backgroundImagePosition }, index) => {
          return (
            <div
              className={clsx(styles.slide, {
                [styles.active]: index === currentSlideIndex,
              })}
              key={index}
            >
              {Boolean(
                preloadedAssets.includes(index) &&
                  backgroundImage?.node?.sourceUrl,
              ) ? (
                <Image
                  className={styles.backgroundImage}
                  src={backgroundImage?.node?.sourceUrl}
                  alt={backgroundImage?.node?.altText || ''}
                  fill={true}
                  style={{ objectPosition: backgroundImagePosition }}
                />
              ) : (
                <div />
              )}
            </div>
          );
        })}
      </div>

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

            <div className={styles.navArrows}>
              <button className={styles.prevButton} onClick={handlePrev}>
                <ArrowLeft />
              </button>
              <button className={styles.nextButton} onClick={handleNext}>
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
