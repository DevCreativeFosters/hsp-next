'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './instagram-tile.module.scss';
import { getIcon } from '@lib/icons';

export default function InstagramTile({ slug, url, type, thumbnailUrl }) {
  const isFullscreenRef = useRef(false);
  const thumbnail = thumbnailUrl;
  const mediaUrl = url;

  const videoRef = useRef(null);
  let href = slug;

  const PlayIcon = getIcon('play-button');

  const handleMouseEnter = () => {
    if (!isFullscreenRef.current) {
      videoRef.current.play().catch(() => null);
    }
  };

  const handleMouseLeave = () => {
    if (!isFullscreenRef.current) {
      videoRef.current.pause();
    }
  };

  const TheImage = useMemo(
    () => (<Image src={thumbnail} fill={true} />)[thumbnail],
  );

  return (
    <Link className={styles.tile} href={href}>
      {type === 'VIDEO' ? (
        <>
          <video
            ref={videoRef}
            className={styles.video}
            muted
            poster={thumbnail}
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* <button type="button" className={styles.button}>
            <PlayIcon />
          </button> */}

          <div
            className={clsx(styles.eventsCaptureArea, styles.cursorOnly)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </>
      ) : (
        <Image
          className={styles.thumbnail}
          src={url}
          height={546}
          width={294}
          alt="Instagram post"
        />
      )}
    </Link>
  );
}
