'use client';

import { useState } from 'react';

import clsx from 'clsx';
import Image from 'next/image';

import { useIsMobile } from '@hooks/useIsMobile';

import styles from './preview.module.scss';

export default function FadeInImage({
  alt,
  imageLayerPosition,
  imageSizes,
  srcDesktop,
  srcMobile,
}) {
  const [isMobileLoaded, setIsMobileLoaded] = useState(false);
  const [isDesktopLoaded, setIsDesktopLoaded] = useState(false);

  const isMobile = useIsMobile();

  if (isMobile && srcMobile) {
    return (
      <Image
        alt={alt}
        className={clsx(styles.layer, styles.isMobile, {
          [styles.isLoaded]: isMobileLoaded,
        })}
        height={imageSizes.mobile.height}
        onLoad={() => {
          setIsMobileLoaded(true);
        }}
        src={srcMobile}
        style={{
          zIndex: imageLayerPosition || 1,
        }}
        width={imageSizes.mobile.width}
      />
    );
  }

  if (!isMobile && srcDesktop) {
    return (
      <Image
        alt={alt}
        className={clsx(styles.layer, styles.isDesktop, {
          [styles.isLoaded]: isDesktopLoaded,
        })}
        height={imageSizes.desktop.height}
        onLoad={() => {
          setIsDesktopLoaded(true);
        }}
        src={srcDesktop}
        style={{
          zIndex: imageLayerPosition || 1,
        }}
        width={imageSizes.desktop.width}
      />
    );
  }

  return null;
}
