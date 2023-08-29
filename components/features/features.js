'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import Button from '@components/button';
import styles from './features.module.scss';

export default function Features({
  title: leadingTitle,
  description: leadingDescription,
  cta,
  video,
  features,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

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
    <div className={styles.container}>
      <div className={styles.leadingFeature}>
        {leadingTitle && (
          <h2 className={styles.leadingTitle}>{leadingTitle}</h2>
        )}
        {leadingDescription && (
          <div
            className={styles.leadingDescription}
            dangerouslySetInnerHTML={{ __html: leadingDescription }}
          />
        )}
        {cta && (
          <Button href={cta.url} size="large">
            {cta.label}
          </Button>
        )}
      </div>
      {video?.src && (
        <div className={styles.videoTile}>
          <video
            className={styles.video}
            title={video.title || null}
            poster={video.poster || null}
            ref={videoRef}
            loop
            muted
          >
            <source src={video.src} type={video.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {features.map(({ title, description }, index) => (
        <div
          className={clsx(styles.featureTile, styles[`f${index + 1}`])}
          key={index}
          style={{ order: (index + 1) * 10 }}
        >
          {title && <h3 className={styles.featureTitle}>{title}</h3>}
          {description && (
            <div
              className={styles.featureDescription}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
