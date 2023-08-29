'use client';

import { useRef, useEffect } from 'react';
import clsx from 'clsx';
import styles from './video-card.module.scss';
import Link from 'next/link';

export default function VideoCard({ idx, url, name, price, productUrl }) {
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
        videoElement.play();
      } else {
        videoElement.pause();
      }
    }, options);

    observer.observe(videoElement);

    return () => observer.unobserve(videoElement);
  }, []);

  return (
    <Link
      href={productUrl}
      className={clsx(styles.videoCard, {
        [styles.videoCardA]: idx === 0,
        [styles.videoCardB]: idx === 1,
      })}
    >
      <video className={styles.video} ref={videoRef} loop muted>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.information}>
        <h5 className={styles.productName}>{name}</h5>
        <span className={styles.productPrice}>
          from ${price.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
