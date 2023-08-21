'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import styles from './carousel.module.scss';

const MIN_SWIPE_THRESHOLD = 20;

export default function Carousel({ items, itemTemplate: ItemTemplate }) {
  const carouselRef = useRef(null);
  const containerRef = useRef(null);

  const isEnabled = useMediaQuery('(max-width: 767px)');
  const [touchStartX, setTouchStartX] = useState(null);
  const [currentN, setCurrentN] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);

  const currentOffsetNormalized = Math.min(maxOffset, currentOffset);

  const goTo = useCallback(n => {
    setCurrentN(n);
  }, []);

  const goToPrev = useCallback(() => {
    const prevNo = Math.max(currentN - 1, 0);
    goTo(prevNo);
  }, [currentN, goTo]);

  const goToNext = useCallback(() => {
    const nextNo = Math.min(currentN + 1, items.length - 1);
    goTo(nextNo);
  }, [currentN, items, goTo]);

  const onTouchStart = useCallback(ev => {
    const clientX = ev.touches[0]?.clientX;
    if (clientX) {
      setTouchStartX(clientX);
    }
  }, []);
  const onTouchMove = useCallback(
    ev => {
      if (!touchStartX) return;
      const currentX = ev.touches[0].clientX;
      const deltaX = currentX - touchStartX;
      if (deltaX > MIN_SWIPE_THRESHOLD) {
        goToPrev();
        setTouchStartX(null);
      } else if (deltaX < -MIN_SWIPE_THRESHOLD) {
        goToNext();
        setTouchStartX(null);
      }
    },
    [touchStartX, goToPrev, goToNext],
  );

  const syncMaxOffset = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const lastItem = container.querySelector(
        `#carousel-container > :last-child`,
      );
      const contentWidth = lastItem.offsetLeft + lastItem.offsetWidth;
      const maxOffset = Math.max(contentWidth - containerWidth, 0);
      setMaxOffset(maxOffset);
    }
  }, []);
  const onTouchEnd = useCallback(() => {
    setTouchStartX(null);
  }, []);

  useEffect(
    function addTouchListeners() {
      const el = carouselRef.current;
      if (isEnabled && carouselRef.current) {
        el.addEventListener('touchstart', onTouchStart);
        el.addEventListener('touchmove', onTouchMove, { passive: true });
        el.addEventListener('touchend', onTouchEnd);
      }

      return () => {
        el?.removeEventListener('touchstart', onTouchStart);
        el?.removeEventListener('touchmove', onTouchMove);
        el?.removeEventListener('touchend', onTouchEnd);
      };
    },
    [isEnabled, onTouchStart, onTouchMove, onTouchEnd],
  );

  useEffect(
    function syncCurrentOffset() {
      const itemEl = containerRef.current.querySelector(
        `#carousel-container > :nth-child(${currentN + 1})`,
      );
      const newOffset = itemEl.offsetLeft;
      setCurrentOffset(newOffset);
    },
    [currentN],
  );

  useEffect(
    function syncMaxOffsetInitially() {
      syncMaxOffset();
    },
    [syncMaxOffset],
  );

  useEffect(
    function syncMaxOffsetOnResize() {
      window.addEventListener('resize', syncMaxOffset);

      return () => {
        window.removeEventListener('resize', syncMaxOffset);
      };
    },
    [syncMaxOffset],
  );

  return (
    <>
      {items.length > 0 && (
        <div className={styles.carousel} ref={carouselRef}>
          <div>
            <div
              className={styles.container}
              ref={containerRef}
              id="carousel-container"
              style={{ '--offset': `-${currentOffsetNormalized}px` }}
            >
              {items.map((props, index) => (
                <ItemTemplate key={index} {...props} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
