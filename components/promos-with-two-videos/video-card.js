'use client';

import { useEffect, useRef } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import DynamicTitle from '@components/dynamic-title/dynamic-title';

import styles from './video-card.module.scss';

export default function VideoCard({
  idx,
  name,
  price,
  productUrl,
  titleTag,
  titleTagStyle,
  url,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        videoElement.play().catch(() => null);
      } else {
        videoElement.pause();
      }
    }, options);

    observer.observe(videoElement);

    return () => observer.unobserve(videoElement);
  }, [videoRef]);

  return (
    <Link
      className={clsx(styles.videoCard, {
        [styles.videoCardA]: idx === 0,
        [styles.videoCardB]: idx === 1,
      })}
      href={productUrl || ''}
    >
      <video className={styles.video} loop muted playsInline ref={videoRef}>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.information}>
        <DynamicTitle
          className={styles.productName}
          defaultTag="h5"
          titleTag={titleTag}
          titleTagStyle={titleTagStyle}
        >
          {name}
        </DynamicTitle>
        <span className={styles.productPrice}>
          from ${price.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
