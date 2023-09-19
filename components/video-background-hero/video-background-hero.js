'use client';

import usePlaybackOnScroll from '@hooks/usePlaybackOnScroll';
import { useRef, useEffect } from 'react';

import Container from '@components/container/container';
import Button from '@components/button/button';

import styles from './video-background-hero.module.scss';

export default function VideoBackgroundHero({
  title,
  description,
  linkLabel,
  videoUrl,
}) {
  const videoRef = useRef(null);

  usePlaybackOnScroll(videoRef);

  return (
    <section className={styles.wrapper}>
      <video className={styles.video} ref={videoRef} loop muted>
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className={styles.backgroundGradient} />
      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
          <Button
            size="large"
            onClick={() => null} // WIP - add video modal popup functionality
            rightIcon="play-button"
          >
            {linkLabel}
          </Button>
        </div>
      </Container>
    </section>
  );
}
