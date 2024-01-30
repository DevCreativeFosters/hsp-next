'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './tile-carousel.module.scss';

const ID_PREFIX = 'carousel';

const MIN_SHIFT = 40;

export default function TileCarousel({
  items = [],
  itemTemplate: ItemTemplate,
  id = '',
  buttonPrevRef,
  buttonNextRef,
  resetStyle,
  smallGaps,
  name,
  context,
  children,
}) {
  const carouselRef = useRef(null);
  const containerRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [pointerXSnapshot, setPointerXSnapshot] = useState(null);
  const [carouselPositionSnapshot, setCarouselPositionSnapshot] = useState(0);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(items.length - 1);
  const [maxPositionShift, setMaxPositionShift] = useState(0);
  const [lastMovementDirection, setLastMovementDirection] = useState(0);
  const carouselId = `${ID_PREFIX}${id ? '-' + id : ''}`;
  const positionMin = -maxPositionShift;
  const positionMax = 0;

  const normalize = useCallback(
    value => {
      return Math.min(positionMax, Math.max(positionMin, value));
    },
    [positionMin, positionMax],
  );

  const getTileOffsets = useCallback(() => {
    const items = containerRef.current?.querySelectorAll(`#${carouselId} > *`);
    if (!items) return [];
    return Array.from(items).map(el => el?.offsetLeft);
  }, [carouselId]);

  const findClosest = useCallback(
    (offset, direction) => {
      const tileOffsets = getTileOffsets();
      let index = tileOffsets.findIndex(
        value => value + MIN_SHIFT >= Math.abs(offset),
      );
      if (direction > 0) {
        index = tileOffsets.findLastIndex(
          value => value - MIN_SHIFT <= Math.abs(offset),
        );
      }
      return {
        index,
        offset: tileOffsets[index],
      };
    },
    [getTileOffsets],
  );

  const snap = useCallback(
    direction => {
      const { index } = findClosest(carouselPosition, direction);
      setCurrentIndex(index);
    },
    [carouselPosition, findClosest],
  );

  const goToPrev = useCallback(() => {
    if (!isDragging) {
      const prevNo = Math.max(currentIndex - 1, 0);
      setCurrentIndex(prevNo);
    }
  }, [isDragging, currentIndex]);

  const goToNext = useCallback(() => {
    if (!isDragging) {
      const nextNo = Math.min(currentIndex + 1, maxIndex);
      setCurrentIndex(nextNo);
    }
  }, [isDragging, currentIndex, maxIndex]);

  const onPointerDown = useCallback(
    ev => {
      setPointerXSnapshot(ev.clientX);
      setCarouselPositionSnapshot(carouselPosition);
    },
    [carouselPosition],
  );

  const onPointerMove = useCallback(
    ev => {
      if (pointerXSnapshot === null) {
        return;
      }
      setIsDragging(true);
      const deltaX = ev.clientX - pointerXSnapshot;
      const newCarouselShift = carouselPositionSnapshot + deltaX;
      if (currentIndex !== undefined) {
        setCurrentIndex(undefined);
      }
      setCarouselPosition(normalize(newCarouselShift));
      setLastMovementDirection(Math.sign(ev.movementX));
    },
    [pointerXSnapshot, carouselPositionSnapshot, normalize, currentIndex],
  );

  const onPointerUp = useCallback(
    ev => {
      if (pointerXSnapshot === null) {
        return;
      }
      const deltaX = ev.clientX - pointerXSnapshot;
      setPointerXSnapshot(null);
      setIsDragging(false);
      const direction = Math.sign(lastMovementDirection || deltaX);
      snap(direction);
    },
    [pointerXSnapshot, lastMovementDirection, snap],
  );

  const onPointerCancel = useCallback(
    ev => {
      if (pointerXSnapshot === null) {
        return;
      }
      const deltaX = ev.clientX - pointerXSnapshot;
      setPointerXSnapshot(null);
      setIsDragging(false);
      snap(Math.sign(deltaX));
    },
    [pointerXSnapshot, snap],
  );

  const setupConstraints = useCallback(() => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const lastItem = container.querySelector(`#${carouselId} > :last-child`);
      const contentWidth = lastItem.offsetLeft + lastItem.offsetWidth;
      const calculatedMaxShift = Math.max(contentWidth - containerWidth, 0);
      setMaxPositionShift(calculatedMaxShift);
      setMaxIndex(
        getTileOffsets().findIndex(value => value >= calculatedMaxShift),
      );
    }
  }, [carouselId, getTileOffsets]);

  useEffect(function logCarouselName() {
    // console.log('carousel name', name); // debug
  }, []);

  useEffect(
    function initialSyncOfConstraints() {
      setupConstraints();
    },
    [setupConstraints],
  );

  useEffect(
    function syncMaxShiftOnResize() {
      window.addEventListener('resize', setupConstraints);

      return () => {
        window.removeEventListener('resize', setupConstraints);
      };
    },
    [setupConstraints],
  );

  useEffect(
    function addPointerListeners() {
      const el = carouselRef.current;

      el?.addEventListener('pointerdown', onPointerDown);
      el?.addEventListener('pointermove', onPointerMove, { passive: true });
      el?.addEventListener('pointerup', onPointerUp);
      el?.addEventListener('pointerleave', onPointerUp);
      el?.addEventListener('pointercancel', onPointerCancel);

      return () => {
        el?.removeEventListener('pointerdown', onPointerDown);
        el?.removeEventListener('pointermove', onPointerMove);
        el?.removeEventListener('pointerup', onPointerUp);
        el?.removeEventListener('pointerleave', onPointerUp);
        el?.removeEventListener('pointercancel', onPointerCancel);
      };
    },
    [onPointerDown, onPointerMove, onPointerUp, onPointerCancel],
  );

  useEffect(
    function syncOffset() {
      if (currentIndex === undefined || isDragging) {
        return;
      }
      const newOffset = getTileOffsets()[currentIndex];
      setCarouselPosition(normalize(-newOffset));
    },
    [currentIndex, isDragging, getTileOffsets, normalize, carouselPosition],
  );

  useEffect(
    function bindExternalPrevNextButtons() {
      const buttonPrev = buttonPrevRef?.current;
      const buttonNext = buttonNextRef?.current;

      if (buttonPrev) {
        buttonPrev.addEventListener('click', goToPrev);
      }

      if (buttonNext) {
        buttonNext.addEventListener('click', goToNext);
      }

      return () => {
        if (buttonPrev) {
          buttonPrev.removeEventListener('click', goToPrev);
        }

        if (buttonNext) {
          buttonNext.removeEventListener('click', goToNext);
        }
      };
    },
    [buttonNextRef, buttonPrevRef, goToPrev, goToNext],
  );

  return (
    <>
      {items?.length > 0 && (
        <div className={styles.carouselWrapper}>
          <div
            className={clsx(styles.carousel, {
              [styles.isDragging]: isDragging,
              [styles.resetStyle]: resetStyle,
              [styles.smallGaps]: smallGaps,
            })}
            ref={carouselRef}
          >
            <div
              className={styles.container}
              ref={containerRef}
              id={carouselId}
              style={{ '--offset': `${carouselPosition}px` }}
            >
              {items.map((props, index) => (
                <ItemTemplate key={index} context={context} {...props} />
              ))}
            </div>
          </div>
          {children}
        </div>
      )}
    </>
  );
}
