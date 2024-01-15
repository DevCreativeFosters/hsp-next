'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import VideoEl from '@components/video-reel/video-el';
import styles from './video-reel.module.scss';

export default function VideoReel({ items, currentIndex, setCurrentIndex }) {
  const trackRef = useRef(null);
  const [startPosition, setStartPosition] = useState(null);

  const updateStartPosition = () => {
    if (trackRef.current) {
      const activeTile = trackRef.current.children[3]; // 4th child is the 'real' Active tile
      const activeTileOffset = activeTile.getBoundingClientRect().left;
      const halfOfViewport = window.innerWidth / 2;
      const halfOfActiveTile = activeTile.offsetWidth / 2;
      const centerOffset = window.innerWidth > 1280 ? 90 : 0;
      const start =
        activeTileOffset - halfOfViewport + halfOfActiveTile + centerOffset;

      setStartPosition(start);
    }
  };

  const updateTrackMinHeight = () => {
    const track = trackRef.current;
    if (track) {
      const activeTile = track.querySelector(
        `.${styles.tile}.${styles.isActive}`,
      );

      if (activeTile) {
        const activeTileHeight = activeTile.offsetHeight;
        track.style.minHeight = `${activeTileHeight}px`;
      }
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    let nonActiveTileWidth = 0;
    let offsetWidth = 0;

    if (track.children[1]) {
      nonActiveTileWidth = track.children[1].offsetWidth;
      document.documentElement.style.setProperty(
        '--placeholder-width',
        `${nonActiveTileWidth}px`,
      );
    }

    if (track && startPosition) {
      const gap = window.innerWidth > 1280 ? 48 : 24;

      for (let i = 0; i < currentIndex; i++) {
        offsetWidth += nonActiveTileWidth + gap;
      }

      track.style.transform = `translateX(${-startPosition - offsetWidth}px)`;
    }
  }, [currentIndex, startPosition]);

  useEffect(() => {
    updateStartPosition();
    updateTrackMinHeight();

    window.addEventListener('resize', updateStartPosition);
    window.addEventListener('resize', updateTrackMinHeight);

    return () => {
      window.removeEventListener('resize', updateStartPosition);
      window.removeEventListener('resize', updateTrackMinHeight);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className={styles.track}
      data-current={currentIndex}
      id="video-reel"
    >
      <span className={styles.placeholderFrontTile} />
      <span className={styles.placeholderFrontTile} />
      <span className={styles.placeholderFrontTile} />

      {items.map(({ title, celebrityPostsCustomFields }, index) => (
        <div
          className={styles.tileContainer}
          key={index}
          onClick={() => setCurrentIndex(index)}
        >
          <div
            className={clsx(styles.tile, {
              [styles.isActive]: index === currentIndex,
            })}
          >
            <VideoEl
              index={index}
              title={title}
              isActive={index === currentIndex}
              thumbnail={celebrityPostsCustomFields?.thumbnail}
              video={celebrityPostsCustomFields?.video}
            />
            <h5 className={styles.title}>{title}</h5>
          </div>
        </div>
      ))}

      <span className={styles.placeholderEndTile} />
      <span className={styles.placeholderEndTile} />
      <span className={styles.placeholderEndTile} />
    </div>
  );
}
