'use client';

import { useIsMobile } from '@hooks/useIsMobile';

import { VideoYoutube } from '@components/video-youtube/video-youtube';

import styles from './video-container.module.scss';

export default function VideoContainer({
  desktopHeight,
  desktopWidth,
  mobileHeight,
  mobileWidth,
  src,
  youtubeId,
}) {
  const isMobile = useIsMobile();

  return (
    <div className={styles.videoContainer}>
      {youtubeId && <VideoYoutube youtubeId={youtubeId} />}

      {src && (
        <iframe
          className={styles.iframe}
          height={!isMobile ? desktopHeight : mobileHeight}
          src={src}
          width={!isMobile ? desktopWidth : mobileWidth}
        ></iframe>
      )}
    </div>
  );
}
