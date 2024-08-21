'use client';

import { useEffect, useRef } from 'react';

import clsx from 'clsx';
import Link from 'next/link';

import styles from './video-card.module.scss';

export default function VideoCard({ productUrl, url, variant }) {
  const videoCardClassNames = clsx(styles.videoCard, {
    [styles.portrait]: variant === 'portrait',
    [styles.rectangle]: variant === 'rectangle',
  });

  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    videoElement.load();

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
  }, [url]);

  const videoElement = (
    <video className={styles.video} loop muted playsInline ref={videoRef}>
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );

  if (!productUrl || productUrl === null) {
    return <div className={videoCardClassNames}>{videoElement}</div>;
  }

  return (
    <Link className={videoCardClassNames} href={productUrl}>
      {videoElement}
    </Link>
  );
}
