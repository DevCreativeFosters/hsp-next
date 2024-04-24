'use client';

import { useRef } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import styles from './instagram-tile.module.scss';

export default function InstagramTile({ slug, thumbnailUrl, type, url }) {
  const videoRef = useRef(null);
  const handleMouseEnter = () => {
    videoRef.current.play().catch(() => null);
  };

  const handleMouseLeave = () => {
    videoRef.current.pause();
  };

  return (
    <Link className={styles.tile} href={slug || '#'} target="_blank">
      {type === 'VIDEO' ? (
        <>
          <video
            className={styles.video}
            muted
            poster={thumbnailUrl}
            ref={videoRef}
          >
            <source src={url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div
            className={clsx(styles.eventsCaptureArea, styles.cursorOnly)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </>
      ) : (
        <Image
          alt="Instagram post"
          className={styles.thumbnail}
          height={546}
          src={url}
          width={294}
        />
      )}
    </Link>
  );
}
