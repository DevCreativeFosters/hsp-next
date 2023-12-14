'use client';

import { useIsMobile } from '@hooks/useIsMobile';
import { VideoYoutube } from '@components/video-youtube/video-youtube';
import styles from './video-container.module.scss';

export default function VideoContainer({
  src,
  youtubeId,
  mobileWidth,
  mobileHeight,
  desktopWidth,
  desktopHeight,
}) {
  const isMobile = useIsMobile();

  return (
    <div className={styles.videoContainer}>
      {youtubeId && <VideoYoutube youtubeId={youtubeId} />}

      {src && (
        <iframe
          className={styles.iframe}
          width={!isMobile ? desktopWidth : mobileWidth}
          height={!isMobile ? desktopHeight : mobileHeight}
          src={src}
        ></iframe>
      )}
    </div>
  );
}
