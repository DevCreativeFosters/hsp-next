'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import routes from '@lib/routes';
import styles from './video-tile.module.scss';

export default function VideoTile({ title, slug, celebrityPostsCustomFields }) {
  const thumbnail = celebrityPostsCustomFields?.thumbnail;
  const video = celebrityPostsCustomFields?.video;
  const videoUrl = video?.mediaItemUrl;
  const videoExtension = videoUrl?.split('.').slice(-1)?.[0];

  const videoRef = useRef(null);
  const [isThumbnailVisible, setIsThumbnailVisible] = useState(true);

  const handleMouseEnter = () => {
    videoRef.current.play();
  };

  const handleMouseLeave = () => {
    videoRef.current.pause();
  };

  const handleVideoPlay = () => {
    setIsThumbnailVisible(false);
  };

  const handleVideoPause = () => {
    setIsThumbnailVisible(true);
  };

  return (
    <Link className={styles.tile} href={routes.celebrities(slug)}>
      {thumbnail?.sourceUrl ? (
        <Image
          className={clsx(styles.thumbnail, {
            [styles.isVisible]: isThumbnailVisible,
          })}
          src={thumbnail.sourceUrl}
          height={546}
          width={294}
          alt={thumbnail.altText || title}
        />
      ) : null}
      <video
        ref={videoRef}
        className={styles.video}
        loop
        muted
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      >
        <source
          src={videoUrl}
          type={videoExtension ? `video/${videoExtension}` : null}
        />
        Your browser does not support the video tag.
      </video>

      <div
        className={styles.cursorOnly}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      ></div>

      <h5 className={styles.title}>{title}</h5>
    </Link>
  );
}
