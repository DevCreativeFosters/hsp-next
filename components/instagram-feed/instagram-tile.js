'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import styles from './instagram-tile.module.scss';

export default function InstagramTile({ slug, url, type, thumbnailUrl }) {
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
            ref={videoRef}
            className={styles.video}
            muted
            poster={thumbnailUrl}
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
