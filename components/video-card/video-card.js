'use client';

import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import styles from './video-card.module.scss';

export default function VideoCard({ url, variant, productUrl }) {
  const videoCardClassNames = clsx(styles.videoCard, {
    [styles.portrait]: variant === 'portrait',
    [styles.rectangle]: variant === 'rectangle',
  });

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
  }, []);

  const videoElement = (
    <video className={styles.video} ref={videoRef} loop muted>
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );

  if (!productUrl || productUrl === null) {
    return <div className={videoCardClassNames}>{videoElement}</div>;
  }

  return (
    <Link href={productUrl} className={videoCardClassNames}>
      {videoElement}
    </Link>
  );
}
