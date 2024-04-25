'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import routes from '@lib/routes';

import styles from './video-tile.module.scss';

export default function VideoTile({
  celebrityPostsCustomFields,
  context,
  slug,
  title,
}) {
  const isFullscreenRef = useRef(false);
  const thumbnail = celebrityPostsCustomFields?.thumbnail?.node;
  const video = celebrityPostsCustomFields?.video?.node;
  const videoUrl = video?.mediaItemUrl;
  const videoExtension = videoUrl?.split('.').slice(-1)?.[0];

  const videoRef = useRef(null);
  const [isThumbnailVisible, setIsThumbnailVisible] = useState(true);
  let href = slug;

  if (context === 'hsp-celebrities') {
    href = routes.celebrities(slug);
  }

  const goFullscreenAndPlay = useCallback(ev => {
    ev.preventDefault();
    const video = videoRef.current;
    if (!video) return;

    isFullscreenRef.current = true;
    video.muted = false;
    const reqFullscreenPromise =
      video.requestFullscreen?.() ||
      video.webkitRequestFullscreen?.() ||
      video.msRequestFullscreen?.();

    if (reqFullscreenPromise) {
      reqFullscreenPromise.then(() => {
        video.play().catch(() => null);
      });
    } else if (video.webkitEnterFullScreen) {
      video.webkitEnterFullScreen();
      video.play().catch(() => null);
    } else {
      isFullscreenRef.current = false;
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.exitFullscreen?.() ||
      video.webkitExitFullscreen?.() ||
      video.msExitFullscreen?.();
  }, []);

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

  const handleVideoPlay = useCallback(() => {
    setIsThumbnailVisible(false);
  }, []);

  const handleVideoPause = useCallback(() => {
    setIsThumbnailVisible(true);
  }, []);

  const handleOnEnded = useCallback(() => {
    videoRef.current.currentTime = 0;
    exitFullscreen();
  }, [exitFullscreen]);

  const onFullscreenExit = useCallback(() => {
    isFullscreenRef.current = false;
    videoRef.current.muted = true;
    videoRef.current.pause();
  }, []);

  const handleFullscreenChange = useCallback(() => {
    if (document.fullscreenElement === videoRef.current) {
      // enter fullscreen
    } else if (document.fullscreenElement === null) {
      onFullscreenExit();
    }
  }, [onFullscreenExit]);

  useEffect(
    function attachFullscreenEvent() {
      const video = videoRef.current;
      video?.addEventListener('fullscreenchange', handleFullscreenChange);

      return () => {
        video?.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    },
    [handleFullscreenChange],
  );

  return (
    <Link className={styles.tile} href={href}>
      {thumbnail?.sourceUrl ? (
        <Image
          alt={thumbnail.altText || title}
          className={clsx(styles.thumbnail, {
            [styles.isVisible]: isThumbnailVisible,
          })}
          height={546}
          src={thumbnail.sourceUrl}
          width={294}
        />
      ) : null}
      <video
        className={styles.video}
        muted
        onEnded={handleOnEnded}
        onPause={handleVideoPause}
        onPlay={handleVideoPlay}
        poster={thumbnail?.sourceUrl}
        ref={videoRef}
      >
        <source
          src={videoUrl}
          type={videoExtension ? `video/${videoExtension}` : null}
        />
        Your browser does not support the video tag.
      </video>

      <div
        className={clsx(styles.eventsCaptureArea, styles.cursorOnly)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />

      <div
        className={clsx(styles.eventsCaptureArea, styles.touchOnly)}
        onClick={goFullscreenAndPlay}
      />

      <h5 className={styles.title}>{title}</h5>
    </Link>
  );
}
