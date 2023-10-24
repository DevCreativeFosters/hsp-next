'use client';

import { useIsMobile } from '@hooks/useIsMobile';
import styles from './video-iframe.module.scss';

export default function VideoIframe({
  src,
  mobileWidth,
  mobileHeight,
  desktopWidth,
  desktopHeight,
}) {
  const isMobile = useIsMobile();

  return (
    <div className={styles.videoContainer}>
      <iframe
        width={!isMobile ? desktopWidth : mobileWidth}
        height={!isMobile ? desktopHeight : mobileHeight}
        src={src}
      ></iframe>
    </div>
  );
}
